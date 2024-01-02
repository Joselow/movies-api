import { Router } from 'express'
import { GenderController } from '../controllers/GenderController.js'

export function createGenderRouter ({ GenderModel }) {
  const router = Router()
  const genderController = new GenderController({ GenderModel })

  router.get('/', (req, res) => genderController.getAll(req, res))

  return router
}
