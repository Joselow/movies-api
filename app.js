import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

export function createApp ({ MovieModel }) {
  const app = express()

  app.disable('x-powered-by')
  app.use(json())
  app.use(corsMiddleware())

  app.use('/movies', createMovieRouter({ MovieModel }))

  app.get('/', (req, res) => {
    res.json({ hola: 'holla' })
  })

  const PORT = process.env.PORT ?? 4000

  app.listen(PORT, () => {
    console.log(`puerto en http://localhost:${PORT}`)
  })
}

// app.options('/movies/:id', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'DELETE, PUT')
//   res.sendStatus(200)
// })

// app.get('/movies', (req, res) => {
//   // res.header('Access-control-allow-origin', '*')

//   const { gender } = req.query
//   if (gender) {
//     const moviesFound = movies.filter((movie) => (
//       movie.genre.some(gen => gen.toLowerCase() === gender.toLowerCase())
//     ))
//     if (moviesFound) {
//       return res.json(moviesFound)
//     }
//     return res.status(404).json({ message: 'Movie not found' })
//   }
//   res.json(movies)
// })

// app.get('/movies/:id', (req, res) => {
//   const { id } = req.params
//   const movieFound = movies.find(el => el.id === id)
//   if (movieFound) {
//     return res.json(movieFound)
//   }
//   res.status(404).json({ message: 'Movie not found' })
// })

// app.post('/movies', (req, res) => {
//   const result = validationPostMovie(req.body)
//   console.log(result)
//   if (result.error) {
//     return res.status(402).json({ error: JSON.parse(result.error.message) })
//   }

//   const newMovie = {
//     id: crypto.randomUUID(),
//     ...result.data
//   }
//   movies.push(newMovie)
//   res.status(201).json(newMovie)
// })

// app.patch('/movies/:id', (req, res) => {
//   const { id } = req.params

//   const result = validationPatchMovie(req.body)

//   if (result.error) {
//     return res.status(404).json({ message: JSON.parse(result.error.message) })
//   }

//   const indexMovie = movies.findIndex(el => el.id === id)

//   if (indexMovie === -1) {
//     return res.status(404).json({ message: 'Movie not found' })
//   }
//   movies[indexMovie] = { ...movies[indexMovie], ...result.data }
//   res.json(movies[indexMovie])
// })

// app.put('/movies/:id', (req, res) => {
//   const { id } = req.params

//   const result = validationPatchMovie(req.body)

//   if (result.error) {
//     return res.status(404).json({ message: JSON.parse(result.error.message) })
//   }

//   const indexMovie = movies.findIndex(el => el.id === id)

//   if (indexMovie === -1) {
//     return res.status(404).json({ message: 'Movie not found' })
//   }
//   movies[indexMovie] = { ...movies[indexMovie], ...result.data }
//   res.json(movies[indexMovie])
// })

// app.delete('/movies/:id', (req, res) => {
//   // res.header('Access-control-allow-origin', '*')

//   const { id } = req.params
//   const indexMovie = movies.findIndex(el => el.id === id)
//   if (indexMovie === -1) {
//     return res.status(404).json({ message: 'Movie not found' })
//   }

//   movies.splice(indexMovie, 1)
//   res.json({ message: 'deleted' })
// })
