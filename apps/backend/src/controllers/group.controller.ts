import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { PERMISSIONS } from "../constants/permissions";
import { userHasPermission } from "../utils/role";
import auth, { getUserIdFromRequest } from "../utils/auth";
import { Prisma } from "@prisma/client";


// Get all groups
const getAllGroups = async (req: Request, res: Response) => {
  try {
    if (!req.sessionUser) { 
      return res.status(401).send({ msg: "Unauthorised" })
    }

    const { hasRoot, permissionIds } = await getUserPermissions(req.sessionUser.roleId!)

    const groups = hasRoot 
      ? await prisma.group.findMany({ include: { categories: true } })
      : await prisma.group.findMany({
          where: {
            OR: [
              { viewPermissionId: null }, 
              { viewPermissionId: { in: permissionIds } }
            ]
          },
          include: { categories: true }
        })

    if (!groups || groups.length === 0) {
      return res.status(200).send({ msg: "No groups found" })
    } 
    return res.status(200).send({ msg: "Sending all groups", groups })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getAllGroups", error })
  }
}

// Get group by id
const getGroupById = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params
    
    if (!groupId) {
      return await getAllGroups(req, res)
    }

    if (!req.sessionUser) {
      return res.status(401).send({ msg: "Unauthorised" })
    }

    const { hasRoot, permissionIds } = await getUserPermissions(req.sessionUser.roleId!)

    // Check if user can view this group
    const canView = await canViewGroup(groupId, permissionIds, hasRoot)
    if (!canView) {
      return res.status(403).send({ msg: "You don't have permission to view this group" })
    }

    const group = await prisma.group.findUnique({ 
      where: { id: groupId },
      include: { categories: true }
    })

    if (!group) {
      return res.status(404).send({ msg: `Cannot find group with id: ${ groupId }` })
    }

    return res.status(200).send({ msg: `Found group with id: ${ groupId }`, group })
  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getGroupById", error })
  }
}

// Get groups by alphabetical sort on name
const getGroupsByAlphabet = async (req: Request, res: Response) => {
  try {
    if (!req.sessionUser) {
      return res.status(401).send({ msg: "Unauthorised" })
    }

    const { amount } = req.body
    const limit = amount ? parseInt(amount, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send({ msg: "Invalid amount parameter" })
    }

    const { hasRoot, permissionIds } = await getUserPermissions(req.sessionUser.roleId!)

    // Fetch groups sorted alphabetically by name with permission filtering
    const groups = hasRoot
      ? await prisma.group.findMany({
          orderBy: { name: 'asc' },
          include: { 
            categories: { 
              orderBy: { name: 'asc' } 
            } 
          },
          ...(limit && { take: limit })
        })
      : await prisma.group.findMany({
          where: {
            OR: [
              { viewPermissionId: null },
              { viewPermissionId: { in: permissionIds } }
            ]
          },
          orderBy: { name: 'asc' },
          include: { 
            categories: { 
              orderBy: { name: 'asc' } 
            } 
          },
          ...(limit && { take: limit })
        })

    const message = limit 
      ? `Sending ${ limit } groups sorted alphabetically` 
      : "Sending all groups sorted alphabetically"
    return res.status(200).send({ msg: message, groups })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getGroupsByAlphabet", error })
  }
}

// Get groups by number of posts
const getGroupsByPosts = async (req: Request, res: Response) => {
  try {
    if (!req.sessionUser) {
      return res.status(401).send({ msg: "Unauthorised" })
    }

    const { amount } = req.body;
    const limit = amount ? parseInt(amount, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send({ msg: "Invalid amount parameter" })
    }

    const { hasRoot, permissionIds } = await getUserPermissions(req.sessionUser.roleId!)

    // Fetch groups with permission filtering
    const groups = hasRoot
      ? await prisma.group.findMany({
          include: { 
            categories: { 
              include: {
                posts: true
              }
            } 
          }
        })
      : await prisma.group.findMany({
          where: {
            OR: [
              { viewPermissionId: null },
              { viewPermissionId: { in: permissionIds } }
            ]
          },
          include: { 
            categories: { 
              include: {
                posts: true
              }
            } 
          }
        })

    const groupsWithPostCount = groups.map(group => ({
      ...group,
        postCount: group.categories.reduce((total, category) => total + category.posts.length, 0)
      })
    ).sort((a, b) => b.postCount - a.postCount)

    const result = limit ? groupsWithPostCount.slice(0, limit) : groupsWithPostCount

    const message = limit 
      ? `Sending ${ limit } groups sorted by post count` 
      : "Sending all groups sorted by post count";
    return res.status(200).send({ msg: message, groups: result })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getGroupsByPosts", error })
  }
}

// Create group (Permission)
const createGroup = async (req: Request, res: Response) => {
  try {
    const sessionUserId = await getUserIdFromRequest(req)
    if (!sessionUserId || (sessionUserId && !await userHasPermission(sessionUserId, PERMISSIONS.GROUP.CREATE))) {
      return res.status(403).send({ msg: "Insufficient permission to create a group" })
    }

    const prismaCategoryAttributes = Object.keys(Prisma.GroupScalarFieldEnum)
    const ignoredAttributes = ["id", "createdAt", "updatedAt"]
    const optionalFields = ["description", "viewPermissionId", "postPermissionId"]

    // Get required attributes
    const requiredFields = prismaCategoryAttributes.filter(
      attr => !ignoredAttributes.includes(attr) && !optionalFields.includes(attr)
    )

    let data: any = {}
    let missingFields: string[] = []

    // Check for required fields
    optionalFields.forEach(attribute => {
      if (req.body[attribute] === undefined || req.body[attribute] === "") {
        missingFields.push(attribute)
      } else {
        data[attribute] = req.body[attribute]
      }
    })

    // Add optional fields if provided
    optionalFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        data[field] = req.body[field]
      }
    })

    // Check if any required fields are missing
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        msg: "Missing required fields to create Group", 
        missingFields, 
        requiredFields, 
        optionalFields 
      })
    }

    const group = await prisma.group.create({ data })
    return res.status(201).json({ msg: `Created group with name: ${ group.name }`, group })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in createGroup", error })
  }
}

// Edit group (Permission)
const editGroup = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "No group information supplied to update" })
    }

    const { groupId } = req.params
    
    if (!groupId) {
      return res.status(401).json({ msg: "No groupId supplied" })
    }

    // Check permission for edit group
    const sessionUserId = req.sessionUser?.id
    const hasPermission = await userHasPermission(sessionUserId, PERMISSIONS.GROUP.MODIFY)
    
    if (!hasPermission) {
      return res.status(403).json({ msg: "Insufficient permission to modify groups" })
    }

    // Build update data from schema
    const attributes = Object.keys(Prisma.GroupScalarFieldEnum)
    const ignored = ["id", "createdAt", "updatedAt"]

    const data: any = {}
    attributes.forEach(attributes => {
      if (!ignored.includes(attributes) && req.body[attributes] !== undefined) {
        data[attributes] = req.body[attributes]
      }
    })

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "No valid fields provided for update" })
    }

    // Update group
    const group = await prisma.group.update({ where: { id: groupId }, data })

    return res.status(200).json({ msg: `Edited group ${ group.name }`, group })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in editGroup", error })
  }
}

// Delete group (Permission)
const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params
    
    if (!groupId) {
      return res.status(401).json({ msg: "No groupId supplied" })
    }

    // Check permission for delete group
    const sessionUserId = req.sessionUser?.id
    const hasPermission = await userHasPermission(sessionUserId, PERMISSIONS.GROUP.DELETE)
    
    if (!hasPermission) {
      return res.status(403).json({ msg: "Insufficient permission to delete group" })
    }

    const group = await prisma.group.findUnique({ where: { id: groupId }})
    if (!group) {
      return res.status(401).json({ msg: "No group found with supplied groupId" })
    }

    await prisma.group.delete({ where: { id: groupId }})
    return res.status(200).json({ msg: `Deleted group for categoryId: ${ groupId }` })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in deleteGroup", error })
  }
}

const getUserPermissions = async (userId: string) => {
  const sessionRole = await prisma.role.findUnique({ 
    where: { id: userId }, 
    include: { permissions: true }
  })

  let hasRoot = false
  const permissionIds = sessionRole?.permissions.map(p => {
    if (p.node === PERMISSIONS.ROOT) {
      hasRoot = true
    }

    return p.id
  }) || []

  return { hasRoot, permissionIds }
}

const canViewGroup = async (groupId: string, permissionIds: string[], hasRoot: boolean): Promise<boolean> => {
  if (hasRoot) return true

  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      OR: [
        { viewPermissionId: null },
        { viewPermissionId: { in: permissionIds } }
      ]
    }
  })

  return !!group
}

export { getAllGroups, getGroupById, getGroupsByAlphabet, getGroupsByPosts, createGroup, editGroup, deleteGroup }