import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const ACCEPTED_ORIGINS_VALUES = [
  'http://127.0.0.1:5500',
  'http://localhost:8080'
]

const ACCEPTED_ORIGINS = process.env.ORIGIN_ACCEPTED || ACCEPTED_ORIGINS_VALUES

console.log(ACCEPTED_ORIGINS)

export const corsMiddleware = ({ acceptedOtigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOtigins === '*') {
      return callback(null, true) // 1: error, 2: success
    }
    if (acceptedOtigins.includes(origin)) {
      return callback(null, true) // 1: error, 2: success
    } else if (!origin) {
      return callback(null, true)
    } else {
      const error = new Error('Not allowed by CORS')
      console.log('ERROR: ---- Not allowed by CORS')
      callback(error)
    }
  }
})
