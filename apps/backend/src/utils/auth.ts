/*
 *   BetterAuth instance and configuration
 */

import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth"
import prisma from "./prisma"
import { FRONTEND_URL } from "../app"
import { Request } from "express"

// https://www.better-auth.com/docs/installation
const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),

  emailAndPassword: { 
    enabled: true,
    minPasswordLength: 8,
  },

  session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 days
  updateAge: 60 * 60 * 24, // Update every day
  cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    }
  },
  
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  
  trustedOrigins: [
    FRONTEND_URL || "http://localhost:5173"
  ],
})

const getUserIdFromRequest = async (req: Request): Promise<string | null> => {
  const { userId } = req.params
  
  if (userId && userId !== 'all') {
    return userId
  }
  
  const session = await auth.api.getSession({ headers: req.headers as Record<string, string> })
  return session?.user?.id || null
}

export default auth
export { getUserIdFromRequest }

