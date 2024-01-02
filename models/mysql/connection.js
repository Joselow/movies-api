import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
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
