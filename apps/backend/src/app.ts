/*
 *   App instance
 */

import CategoryRoutes from "./routes/category.route"
import ProfileRoutes from "./routes/profile.route"
import GroupRoutes from "./routes/group.route"
import PostRoutes from "./routes/post.route"

import { toNodeHandler } from "better-auth/node"
import auth from "./utils/auth"
import express from "express"
import cors from "cors"

const APP = express()
const PORT = Number(process.env.FRONTEND_PORT) || 5173
export const FRONTEND_URL = (process.env.BASE || `http://localhost`) + `:${ PORT }`

APP.use(express.json())

APP.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

APP.all("/api/auth/*splat", toNodeHandler(auth))


// Routes
APP.use("/api/profile", ProfileRoutes)
APP.use("/api/category", CategoryRoutes)
APP.use("/api/group", GroupRoutes)
APP.use("/api/post", PostRoutes)

export default APP
