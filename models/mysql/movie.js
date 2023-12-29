import mysql from 'mysql2/promise'
import { InvalidUUIDError } from '../../Errors/InvalidUUIDError.js'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}

const data = 'BIN_TO_UUID(movies.id) as id, movies.title, movies.year, movies.director, movies.duration, movies.poster, movies.rate'

let connection
let successConnection = false;

(async ({ delay = 5000 }) => { // -- función autoinvocada
  while (!successConnection) {
    try {
      connection = await mysql.createConnection(config)
      successConnection = true
      console.log('Conexion establecida correctamente')
    } catch (error) {
      console.log('Error al conectar con la base de datos:', error.code)
      successConnection = false
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
})({})

export class Movie {
  async getAll ({ gender }) {
    if (gender) {
      return await this.getMoviesByGenre({ gender, data })
    }

    return await this.getAllMovies({ data })
  }

  async getById ({ id }) {
    return await this.getMovieById(id)
  }

  async create ({ request }) {
    const { genre, title, year, director, duration, poster, rate } = request

    await connection.beginTransaction()
    try {
      const [uuidResult] = await connection.query('SELECT UUID() uuid')
      const [{ uuid }] = uuidResult
      await connection.query(
      `INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES 
        (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);
      `, [title, year, director, duration, poster, rate]
      )

      genre.forEach(async (genre) => {
        const [genders] = await connection.query('SELECT id FROM genres WHERE name = ?', [genre])

        const { id: idGender } = genders[0]
        await connection.query('INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)', [uuid, idGender])
      })

      await connection.commit()

      // const [movies] = await connection.query(`SELECT ${data} FROM movies WHERE id = UUID_TO_BIN("${uuid}")`)
      const movie = {
        id: uuid,
        title,
        year,
        director,
        duration,
        poster,
        rate,
        genre
      }
      return movie
    } catch (error) {
      await connection.rollback()
      throw new Error('server crashed')
    }
  }

  async delete ({ id }) {
    if (!this.isValidUUID(id)) {
      throw new InvalidUUIDError('The id must be UUID')
    }

    await connection.beginTransaction()
    try {
      const [deleteMovie] = await connection.query('DELETE FROM movies WHERE id = UUID_TO_BIN(?);', [id])
      const [deleteMovieGenres] = await connection.query('DELETE FROM movies_genres WHERE movie_id = UUID_TO_BIN(?);', [id])

      if (deleteMovie.affectedRows > 0 && deleteMovieGenres.affectedRows > 0) {
        return true
      }
      return false
    } catch (error) {
      await connection.rollback()
      throw new Error('server crashed')
    }
  }

  async update ({ id, request }) {
    if (!this.isValidUUID(id)) {
      throw new InvalidUUIDError('The id must be UUID')
    }
    const { genre, ...requestWithoutGenre } = request
    let formattedInsertMoviesGenres = ''
    const moviesGenresID = []
    await connection.beginTransaction()
    try {
      if (genre) {
        const newGenresIDs = await Promise.all(genre.map(async (genreName) => {
          const [idGenres] = await connection.query('SELECT id from genres WHERE name = ?', [genreName])
          if (idGenres.length > 0) {
            const { id: idGender } = idGenres[0]
            formattedInsertMoviesGenres += '(UUID_TO_BIN(?),?),'
            moviesGenresID.push(id)
            moviesGenresID.push(idGender)
            return idGender
          }
        }))
        await connection.query(`
        DELETE FROM movies_genres 
        WHERE movie_id = ? 
          AND genre_id NOT IN (?);`, [id, newGenresIDs])

        formattedInsertMoviesGenres = formattedInsertMoviesGenres.slice(0, -1)

        await connection.query(`
        INSERT INTO movies_genres (movie_id, genre_id) 
        VALUES 
          ${formattedInsertMoviesGenres}
        ON DUPLICATE KEY 
        UPDATE movie_id = movie_id `, [...moviesGenresID])
      }

      const updateFieldsFormatted = Object.keys(requestWithoutGenre)
        .filter(key => request[key] !== undefined)
        .map(key => `${key} = ?`)
        .join(', ')

      const updateValues = Object.values(requestWithoutGenre)
        .filter(value => value !== undefined)

      await connection.query(
      `
      UPDATE movies
      SET ${updateFieldsFormatted}
      WHERE id = UUID_TO_BIN(?);
      `,
      [...updateValues, id]
      )
      await connection.commit()

      const updatedMovie = await this.getMovieById(id)
      return updatedMovie
    } catch (error) {
      await connection.rollback()
      throw new Error('server crashed')
    }
  }

  async getAllMovies ({ data }) {
    try {
      const [movies] = await connection.query(`
      SELECT 
        ${data}, 
        JSON_ARRAYAGG(genres.name) AS genre
      FROM movies
      JOIN movies_genres 
        ON movies_genres.movie_id = movies.id
      JOIN genres 
        ON genres.id = movies_genres.genre_id
      GROUP BY
        movies.title, movies.id
      `)
      return movies
    } catch (error) {
      throw new Error('Does not posible get the movies')
    }
  }

  async getMoviesByGenre ({ gender, data }) {
    try {
      const [moviesValue] = await connection.query(`
      SELECT
        ${data},
        JSON_ARRAYAGG(genres.name) AS genre
      FROM movies
      JOIN movies_genres 
        ON movies.id = movies_genres.movie_id
      JOIN genres 
        ON movies_genres.genre_id = genres.id
      WHERE
        movies.id IN (
          SELECT DISTINCT movie_id
          FROM movies_genres
          WHERE genre_id = (
            SELECT id
            FROM genres
            WHERE name = ?
          )
        )
      GROUP BY
        movies.id, movies.title;
      `, [gender])

      return moviesValue
    } catch (error) {
      throw new Error('server crashed')
    }
  }

  isValidUUID (uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  async getMovieById (id) {
    try {
      if (!this.isValidUUID(id)) {
        throw new InvalidUUIDError('The id must be UUID')
      }
      const [movies] = await connection.query(
        `SELECT 
          ${data}, 
          JSON_ARRAYAGG(genres.name) AS genre
        FROM movies 
        JOIN movies_genres 
          ON movies_genres.movie_id = movies.id
        JOIN genres
          ON genres.id = movies_genres.genre_id
        WHERE 
          movies.id = UUID_TO_BIN(?)
        GROUP BY
          movies.id`,
        [id]
      )
      if (!movies.length) return null
      return movies[0]
    } catch (error) {
      if (error instanceof InvalidUUIDError) throw error
      else throw new Error('server crashed')
    }
  }
}
