import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:8080'
  // add others
]
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (ACCEPTED_ORIGINS.includes(origin)) {
//       return callback(null, true)
//     } else if (!origin) {
//       return callback(null, true)
//     } else {
//       const error = new Error('Not allowed by CORS')
//       callback(error)
//     }
//   }
// }

export const corsMiddleware = ({ acceptedOtigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOtigins.includes(origin)) {
      return callback(null, true) // 1: error, 2: success
    } else if (!origin) {
      return callback(null, true)
    } else {
      const error = new Error('Not allowed by CORS')
      callback(error)
    }
  }
})
