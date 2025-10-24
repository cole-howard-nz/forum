import { Request, Response } from "express"
import prisma from "../utils/prisma"
import auth, { getUserIdFromRequest } from "../utils/auth"
import { Prisma } from "@prisma/client"
import { checkUserPermission, PERMISSIONS, userHasPermission } from "../utils/role"
import { PermissionNode } from "../constants/permissions"


const getAllProfiles = async (_: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany();
    if (!profiles || profiles.length === 0) {
      return res.status(200).json({ msg: "No profiles found" })
    }
    return res.status(200).send({ msg: "Sending all profiles", profiles })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in getAllProfiles", error })
  }
}

const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    // Handle ALL case
    if (userId === 'all') {
      return await getAllProfiles(req, res)
    }

    // Get userId from params or session
    const targetUserId = await getUserIdFromRequest(req)
    
    if (!targetUserId) {
      return res.status(401).json({ msg: "No userId supplied and there is no user in session" })
    }

    // Find profile
    const profile = await prisma.profile.findUnique({ 
      where: { userId: targetUserId },
      include: { user: { select: { email: true } } }
    })

    if (!profile) {
      return res.status(404).json({ msg: `Cannot find profile for user: ${ targetUserId }` })
    }

    return res.status(200).json({ msg: `Found profile for ${ profile.user.email }`, profile })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in getProfile", error });
  }
}

const createProfile = async (req: Request, res: Response) => {
  try {
    // Get userId from params or session
    const targetUserId = await getUserIdFromRequest(req)
    
    if (!targetUserId) {
      return res.status(401).json({ msg: "No userId supplied and there is no user in session" })
    }

    // Check if creating profile for other user and sesson user has permission
    const sessionUserId = req.sessionUser?.id
    if (!isOwnProfile(sessionUserId, targetUserId) && !await userHasPermission(sessionUserId, PERMISSIONS.PROFILE.MODIFY_OTHERS)) {
      return res.status(403).json({ msg: "Insufficient permission to create other users' profiles" })
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({ 
      where: { userId: targetUserId } 
    })

    if (existingProfile) {
      return res.status(400).json({ msg: "A profile already exists for this user" })
    }

    // Verify user exists and create profile
    const user = await prisma.user.findUnique({ 
      where: { id: targetUserId },
      select: { id: true, email: true }
    })

    if (!user) {
      return res.status(404).json({ msg: `No user found with id: ${ targetUserId }` })
    }

    const profile = await prisma.profile.create({ 
      data: { userId: targetUserId } 
    })

    return res.status(201).json({ msg: `Created profile for ${ user.email }`, profile })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in createProfile", error });
  }
}

const editProfile = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "No user information supplied to update" })
    }

    const targetUserId = await getUserIdFromRequest(req);
    
    if (!targetUserId) {
      return res.status(401).json({ msg: "No userId supplied and there is no user in session" })
    }

    // Check permission for edit profile
    const sessionUserId = req.sessionUser?.id
    if (!isOwnProfile(sessionUserId, targetUserId) && !await userHasPermission(sessionUserId, PERMISSIONS.PROFILE.MODIFY_OTHERS)) {
      return res.status(403).json({ msg: "Insufficient permission to modify other users' profiles" })
    }

    // Build update data from schema
    const profileAttributes = Object.keys(Prisma.ProfileScalarFieldEnum)
    const ignored = ["id", "userId", "createdAt", "updatedAt"]

    const data: any = {}
    profileAttributes.forEach(profileAttribute => {
      if (!ignored.includes(profileAttribute) && req.body[profileAttribute] !== undefined) {
        data[profileAttribute] = req.body[profileAttribute]
      }
    })

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "No valid fields provided for update" })
    }

    // Update profile
    const profile = await prisma.profile.update({ 
      where: { userId: targetUserId }, 
      data,
      include: { user: { select: { email: true } } }
    })

    return res.status(200).json({ msg: `Edited profile for ${ profile.user.email }`, profile })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in editProfile", error })
  }
}

const deleteProfile = async (req: Request, res: Response) => {
  try {
    // Get userId from params or session
    const targetUserId = await getUserIdFromRequest(req)

    if (!targetUserId) {
      return res.status(401).json({ msg: "No userId supplied and there is no user in session" })
    }

    // Check permission for delete other profile
    const sessionUserId = req.sessionUser?.id
    if (!isOwnProfile(sessionUserId, targetUserId) && !await userHasPermission(sessionUserId, PERMISSIONS.PROFILE.DELETE_OTHERS)) {
      return res.status(403).json({ msg: "Insufficient permission to modify other users' profiles" })
    }

    const profile = await prisma.profile.findUnique({ where: { userId: targetUserId }})
    if (!profile) {
      return res.status(401).json({ msg: "No profile found with supplied userId" })
    }

    await prisma.profile.delete({ where: { userId: targetUserId }})
    return res.status(200).json({ msg: `Deleted profile for userId: ${ targetUserId }` })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in deleteProfile", error })
  }
}

/*
 *   Specific helper and utilities
 */

const isOwnProfile = (sessionUserId: string | undefined, targetUserId: string): boolean => {
  return sessionUserId === targetUserId
}

export { getAllProfiles, getProfile, createProfile, editProfile, deleteProfile }