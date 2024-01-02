import { connection } from './connection.js'

export class Gender {
  async getAll () {
    try {
      const [genders] = await connection.query(
        'SELECT * from genres'
      )
      return genders
    } catch (error) {
      console.log(error)
      throw new Error('server crashed')
    }
  }
}
