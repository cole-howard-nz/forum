import { Request, Response } from "express"
import prisma from "../utils/prisma"
import { Prisma } from "@prisma/client"
import { getUserIdFromRequest } from "../utils/auth"
import { PERMISSIONS, userHasPermission } from "../utils/role"


// Get all categories
const getAllCategories = async (req: Request, res: Response) => {
  try {
    if (!req.sessionUser) {
      return res.status(401).send({ msg: "Unauthorised" })
    }

    const { hasRoot, permissionIds } = await getUserPermissions(req.sessionUser.roleId!)

    const categories = hasRoot
      ? await prisma.category.findMany({ include: { group: true } })
      : await prisma.category.findMany({
          where: {
            OR: [
              { viewPermissionId: null },
              { viewPermissionId: { in: permissionIds } }
            ]
          },
          include: { group: true }
        })

    if (!categories || categories.length === 0) {
      return res.status(200).json({ msg: "No categories found" })
    }

    return res.status(200).send({ msg: "Sending all categories", categories })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getAllCategories", error })
  }
}

// Get category by id
const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params

    // If no id, send all categories
    if (!categoryId) {
      return await getAllCategories(req, res)
    }

    if (!req.sessionUser) {
      return res.status(401).send({ msg: "Unauthorised" })
    }

    const { hasRoot, permissionIds } = await getUserPermissions(req.sessionUser.roleId!)

    // Check if user can view this category
    const canView = await canViewCategory(categoryId, permissionIds, hasRoot)
    if (!canView) {
      return res.status(403).send({ msg: "You don't have permission to view this category" })
    }

    const category = await prisma.category.findUnique({ 
      where: { id: categoryId },
      include: { group: true }
    })

    if (!category) {
      return res.status(404).json({ msg: `Cannot find category with id: ${ categoryId }` })
    }

    return res.status(200).json({ msg: `Found category for id ${ categoryId }`, category })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getCategory", error })
  }
}

// Get categories by group
const getCategoryByGroupId = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params

    // If no id, send all categories
    if (!groupId) {
      return await getAllCategories(req, res)
    }

    if (!req.sessionUser) {
      return res.status(401).send({ msg: "Unauthorised" })
    }

    const { hasRoot, permissionIds } = await getUserPermissions(req.sessionUser.roleId!)

    // Check if user can view this group
    const canViewGroupAccess = await canViewGroup(groupId, permissionIds, hasRoot)
    if (!canViewGroupAccess) {
      return res.status(403).send({ msg: "You don't have permission to view this group" })
    }

    // Attempt to find group with id
    const group = await prisma.group.findUnique({ where: { id: groupId } })
    if (!group) {
      return res.status(404).json({ msg: `Cannot find group with id: ${ groupId }` })
    }

    // Attempt to find categories within group with permission filtering
    const categories = hasRoot
      ? await prisma.category.findMany({ 
          where: { groupId },
          include: { group: true }
        })
      : await prisma.category.findMany({ 
          where: { 
            groupId,
            OR: [
              { viewPermissionId: null },
              { viewPermissionId: { in: permissionIds } }
            ]
          },
          include: { group: true }
        })

    if (!categories || categories.length === 0) {
      return res.status(200).json({ msg: "No categories found" })
    }
    
    return res.status(200).json({ msg: `Found categories within group id: ${ groupId }`, categories })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getCategoryByGroupId", error })
  }
}

// Create category (Permission)
const createCategory = async (req: Request, res: Response) => {
  try {
    const sessionUserId = await getUserIdFromRequest(req)
    if (!sessionUserId || (sessionUserId && !await userHasPermission(sessionUserId, PERMISSIONS.CATEGORY.CREATE))) {
      return res.status(403).send({ msg: "Insufficient permission to create a category"})
    }

    const prismaCategoryAttributes = Object.keys(Prisma.CategoryScalarFieldEnum)
    const ignoredAttributes = ["id", "createdAt", "updatedAt"]
    const optionalAttributes = ["groupId", "description"]

    // Get required attributes
    const requiredAttributes = prismaCategoryAttributes.filter( attr => !ignoredAttributes.includes(attr) && !optionalAttributes.includes(attr) )

    let data: any = {}
    let missingFields: string[] = []

    // Check for required fields
    requiredAttributes.forEach(attribute => {
      if (req.body[attribute] === undefined || req.body[attribute] === "") {
        missingFields.push(attribute)
      } else {
        data[attribute] = req.body[attribute]
      }
    })

    // Add optional fields if provided
    optionalAttributes.forEach(attribute => {
      if (req.body[attribute] !== undefined) {
        data[attribute] = req.body[attribute]
      }
    })

    // Check if any required fields are missing
    if (missingFields.length > 0) {
      return res.status(400).json({ msg: "Missing required fields to create Category", missingFields, requiredFields: requiredAttributes, optionalFields: optionalAttributes })
    }

    const category = await prisma.category.create({ data })
    return res.status(201).json({ msg: `Created category with name: ${ category.name }`, category })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in createCategory", error })
  }
}

// Edit category (Permission)
const editCategory = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "No category information supplied to update" })
    }

    const { categoryId } = req.params
    
    if (!categoryId) {
      return res.status(401).json({ msg: "No categoryId supplied" })
    }

    // Check permission for edit category
    const sessionUserId = req.sessionUser?.id
    const hasPermission = await userHasPermission(sessionUserId, PERMISSIONS.CATEGORY.MODIFY)
    
    if (!hasPermission) {
      return res.status(403).json({ msg: "Insufficient permission to modify categories" })
    }

    // Build update data from schema
    const attributes = Object.keys(Prisma.CategoryScalarFieldEnum)
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

    // Update category
    const category = await prisma.category.update({ where: { id: categoryId }, data })

    return res.status(200).json({ msg: `Edited category ${ category.name }`, category })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in editCategory", error })
  }
}

// Delete category (Permission)
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params
    
    if (!categoryId) {
      return res.status(401).json({ msg: "No categoryId supplied" })
    }

    // Check permission for delete category
    const sessionUserId = req.sessionUser?.id
    const hasPermission = await userHasPermission(sessionUserId, PERMISSIONS.CATEGORY.DELETE)
    
    if (!hasPermission) {
      return res.status(403).json({ msg: "Insufficient permission to delete categories" })
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId }})
    if (!category) {
      return res.status(401).json({ msg: "No category found with supplied categoryId" })
    }

    await prisma.category.delete({ where: { id: categoryId }})
    return res.status(200).json({ msg: `Deleted category for categoryId: ${ categoryId }` })

  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error in deleteCategory", error })
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

const canViewCategory = async (categoryId: string, permissionIds: string[], hasRoot: boolean): Promise<boolean> => {
  if (hasRoot) return true

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [
        { viewPermissionId: null },
        { viewPermissionId: { in: permissionIds } }
      ]
    }
  })

  return !!category
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


export { getAllCategories, getCategoryById, getCategoryByGroupId, createCategory, editCategory, deleteCategory }