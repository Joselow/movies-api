import { connection } from './connection.js'

export class Gender {
  async getAll () {
    const [genders] = await connection.query(
      'SELECT * from genres'
    )
    return genders
  }
}
