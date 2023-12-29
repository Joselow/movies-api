import zod from 'zod'

const movieScheme = zod.object({
  title: zod.string({
    invalid_type_error: 'title mus be a string',
    required_error: 'title is required'
  }),
  year: zod.number().int().min(1900).max(2024),
  director: zod.string(),
  duration: zod.number().int().positive(),
  rate: zod.number().positive().max(10).optional(),
  poster: zod.string().url({
    message: 'poster mus be a valid url'
  }),
  genre: zod.array(
    zod.enum(['Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Biography', 'Fantasy']),
    {
      invalid_type_error: 'genre mus be an array of enum',
      required_error: 'genre is required'
    }
  )
})

const validationPostMovie = (object) => {
  // return movieScheme.parse(object) // -- valida la data
  return movieScheme.safeParse(object) // -- valida y te da un error o los datos
}

const validationPatchMovie = (object) => {
  return movieScheme.partial().safeParse(object) // -- el partial vuelev a cada propiedad que se valida
  // opcional, significa que si no esta no pasa nda y si esta la valida
}

export { validationPostMovie, validationPatchMovie }
