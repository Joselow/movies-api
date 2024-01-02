import { validationPatchMovie, validationPostMovie } from '../movieEschema.js'

export class MovieController {
  constructor ({ MovieModel }) {
    this.movieModel = new MovieModel()
  }

  getAll = async (req, res) => {
    const { gender, search } = req.query
    try {
      const movies = await this.movieModel.getAll({ gender, search })
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

  async getById (req, res) {
    const { id } = req.params
    try {
      const movieFound = await this.movieModel.getById({ id })
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

  async create (req, res) {
    const result = validationPostMovie(req.body)
    try {
      if (result.error) {
        return res.status(402).json({ error: JSON.parse(result.error.message) })
      }
      const newMovie = await this.movieModel.create({ request: result.data })
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

  async update (req, res) {
    const { id } = req.params
    const result = validationPatchMovie(req.body)

    try {
      if (result.error) {
        return res.status(404).json({ message: JSON.parse(result.error.message) })
      }

      const movieUpdated = await this.movieModel.update({ id, request: result.data })

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

  async delete (req, res) {
    try {
      const { id } = req.params
      const deleted = await this.movieModel.delete({ id })
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
