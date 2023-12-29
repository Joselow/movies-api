import { createRequire } from 'node:module'
import path from 'node:path'

const currentDir = path.dirname(import.meta.url)
const parentDir = path.join(currentDir, '.')

const require = createRequire(parentDir)

export const importJson = (path) => {
  try {
    const data = require(path)
    return data
  } catch (error) {
    console.error(`Error reading JSON file at ${path}: ${error.message}`)
    throw error
  }
}
