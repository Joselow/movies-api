// import { Movie } from '../models/Movie.js'
import { Movie } from '../models/mysql/movie.js'
import { validationPatchMovie, validationPostMovie } from '../movieEschema.js'

export class MovieController {
  static async getAll (req, res) {
    // res.header('Access-control-allow-origin', '*')
    const { gender } = req.query
    try {
      const movies = await new Movie().getAll({ gender })
      if (movies.length) {
        return res.json(movies)
      }
      return res.status(404).json({
        error: 'Not Found',
        message: 'There are no movies yet'
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }

  static async getById (req, res) {
    const { id } = req.params
    try {
      const movieFound = await new Movie().getById({ id })
      if (movieFound) {
        return res.json(movieFound)
      }
      return res.status(404).json({
        error: 'Not Found',
        message: 'The movie hasn\'t been found '
      })
    } catch (error) {
      if (error.name === 'InvalidUUIDError') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        })
      }
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }

  static async create (req, res) {
    const result = validationPostMovie(req.body)
    try {
      if (result.error) {
        return res.status(402).json({ error: JSON.parse(result.error.message) })
      }
      const newMovie = await new Movie().create({ request: result.data })
      if (newMovie) {
        return res.status(201).json(newMovie)
      }
      return res.status(404).json({
        error: 'Not Found',
        message: 'The movie hasn\'t been found '
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }

  static async update (req, res) {
    const { id } = req.params
    const result = validationPatchMovie(req.body)

    try {
      if (result.error) {
        return res.status(404).json({ message: JSON.parse(result.error.message) })
      }

      const movieUpdated = await new Movie().update({ id, request: result.data })

      if (!movieUpdated) {
        return res.status(404).json({ message: 'Movie not found' })
      }
      res.json(movieUpdated)
    } catch (error) {
      if (error.name === 'InvalidUUIDError') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        })
      }
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }

  static async delete (req, res) {
    // res.header('Access-control-allow-origin', '*')
    try {
      const { id } = req.params
      const deleted = await new Movie().delete({ id })
      if (deleted) {
        return res.status(204).json({ message: 'deleted' })
      }
      return res.status(404).json({
        error: 'Not Found',
        message: 'Movie not found, maybe it has been deleted before'
      })
    } catch (error) {
      if (error.name === 'InvalidUUIDError') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        })
      }
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }
}
