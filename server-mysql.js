import { createApp } from './app.js'
import { Movie } from './models/mysql/Movie.js'
import { Gender } from './models/mysql/Gender.js'

createApp({ MovieModel: Movie, GenderModel: Gender })
