/*
 *   Server entry point
 */

import dotenv from "dotenv"
import APP from "./app"

// Force load custom express type into context
import type {} from './types/express'

dotenv.config()

const PORT = Number(process.env.BACKEND_PORT) || 8000
export const BACKEND_URL = (process.env.BASE || `http://localhost`) + `:${ PORT }`

APP.listen(PORT, () => {
  console.log(`[server] Listening at ${ BACKEND_URL }`)
})