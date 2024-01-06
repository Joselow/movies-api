import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'moviesdb'
}

let connection
let successConnection = false;

(async ({ delay = 5000 }) => { // -- función autoinvocada
  while (!successConnection) {
    try {
      connection = await mysql.createConnection(config)
      successConnection = true
      console.log('Conexion establecida correctamente')
    } catch (error) {
      console.log('Error al conectar con la base de datos:', error.code)
      successConnection = false
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
})({})

export {
  connection
}
