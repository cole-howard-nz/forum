/*
 *   App instance
 */

import cors from "cors"
import express from "express"

const APP = express()

APP.use(cors())
APP.use(express.json())

export default APP
