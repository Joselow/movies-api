export class InvalidUUIDError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidUUIDError'
  }
}
