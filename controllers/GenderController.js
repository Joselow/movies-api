export class GenderController {
  constructor ({ GenderModel }) {
    this.genderModel = GenderModel
  }

  async getAll (req, res) {
    try {
      const genders = await this.genderModel.getAll()
      res.json(genders)
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }
}
