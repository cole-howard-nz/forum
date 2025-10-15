/*
 *   Server entry point
 */

import dotenv from "dotenv"
import APP from "./app"

dotenv.config()

const PORT = Number(process.env.BACKEND_PORT) || 8000
const URL = (process.env.BASE || `http://localhost`) + `:${ PORT }`

APP.listen(PORT, () => {
  console.log(`Server listening at ${ URL }`)
})