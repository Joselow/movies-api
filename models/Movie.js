import { importJson } from '../utils/requireImport.js'
import { randomUUID } from 'node:crypto'

const movies = importJson('./movies.json')

export class Movie {
  static async getAll ({ gender }) { // asincrono para cubrir todas las posibilidades
    if (gender) {
      const moviesFound = movies.filter((movie) => (
        movie.genre.some(gen => gen.toLowerCase() === gender.toLowerCase())
      ))
      if (moviesFound) {
        return moviesFound
      }
      return { message: 'Movie not found' }
    }
    return movies
  }

  static async getById ({ id }) {
    const movieFound = movies.find(el => el.id === id)
    return movieFound
  }

  static async create ({ request }) {
    const newMovie = {
      id: randomUUID(),
      ...request
    }
    movies.push(newMovie)

    return newMovie
  }

  static async update ({ id, request }) {
    const indexMovie = movies.findIndex(el => el.id === id)

    if (indexMovie === -1) {
      return false
    }
    movies[indexMovie] = { ...movies[indexMovie], ...request }
    return movies[indexMovie]
  }

  static async delete ({ id }) {
    const indexMovie = movies.findIndex(el => el.id === id)
    if (indexMovie === -1) {
      return false
    }
    return true
  }
}
