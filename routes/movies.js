import { Router } from 'express'
import { MovieController } from '../controllers/MovieController.js'

export function createMovieRouter ({ MovieModel }) {
  const router = Router()
  const movieModelController = new MovieController({ MovieModel })

  router.get('/', (req, res) => movieModelController.getAll(req, res))
  router.post('/', (req, res) => movieModelController.create(req, res))
  router.get('/:id', (req, res) => movieModelController.getById(req, res))
  router.patch('/:id', (req, res) => movieModelController.update(req, res))
  router.delete('/:id', (req, res) => movieModelController.delete(req, res))

  return router
}
