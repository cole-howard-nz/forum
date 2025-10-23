import { Request, Response } from "express"
import prisma from "../utils/prisma"
import auth from "../utils/auth"

// CREATE profile for session user / userId
// GET profile from session user / userId
// UPDATE profile for session user / userId
// DELETE profile for session user / userId


const getAllProfiles = async (_: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany();
    if (!profiles || profiles.length === 0) return res.status(200).json({ msg: "No profiles found" })
    return res.status(200).send(profiles)

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in getAllProfiles", error })
  }
}

const createProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body

    if (userId) {
      const existingProfile = await prisma.profile.findFirst({ where: { userId } })
      if (existingProfile) {
        return res.status(400).json({ msg: "A profile already exists for the supplied User" })
      }

      const profile = await prisma.profile.create({ data: { userId } })
      return res.status(200).json({ msg: `Created profile for ${ userId }`, profile })
    }

    const session = await auth.api.getSession({ 
      headers: req.headers as Record<string, string> 
    })

    if (session && session.user) {
      const existingProfile = await prisma.profile.findFirst({ 
        where: { userId: session.user.id } 
      })
      if (existingProfile) {
        return res.status(400).json({ msg: "A profile already exists for this user" })
      }

      const user = await prisma.user.findFirst({ where: { id: session.user.id } })
      if (!user) {
        return res.status(400).json({ msg: "No user found in session" })
      }

      const profile = await prisma.profile.create({ 
        data: { userId: session.user.id } 
      })
      return res.status(200).json({ 
        msg: `Created profile from session: ${session.user.email}`, 
        profile 
      })
    }

    return res.status(401).json({ msg: "No userId supplied and there is no user in session" })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in createProfile", error })
  }
}

export { getAllProfiles, createProfile }