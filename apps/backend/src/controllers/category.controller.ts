import { Request, Response } from "express"
import prisma from "../utils/prisma"
import { Prisma } from "@prisma/client"
import { getUserIdFromRequest } from "../utils/auth"
import { PERMISSIONS, userHasPermission } from "../utils/role"


// Get all categories
const getAllCategories = async (req: Request, res: Response) => {
  try {
     const categories = await prisma.category.findMany()
     if (!categories || !(categories.length > 1)) {
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
    const { categoryId } = req.body

    // If no id, send all categories
    if (!categoryId) {
      return await getAllCategories(req, res)
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId }})
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
    const { groupId } = req.body

    // If no id, send all categories
    if (!groupId) {
      return await getAllCategories(req, res)
    }

    // Attempt to find group with id
    const group = await prisma.group.findUnique({ where: { id: groupId }})
    if (!group) {
      return res.status(404).json({ msg: `Cannot find group with id: ${ groupId }` })
    }

    // Attempt to find categories within group
    const categories = await prisma.category.findMany({ where: { groupId }})
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
    const sessionUserId = await getUserIdFromRequest(req)
    if (!sessionUserId || (sessionUserId && !await userHasPermission(sessionUserId, PERMISSIONS.CATEGORY.MODIFY))) {
      return res.status(403).send({ msg: "Insufficient permission to modify a category" })
    }

    const { categoryId } = req.body

    if (!categoryId) {
      return res.status(400).send({ msg: "No categoryId supplied in request" })
    }

  } catch (error) {
    res.status(500).send({ msg: "Unexpected error in editCategory", error })
  }
}

// Delete category (Permission)


export { getAllCategories, getCategoryById, getCategoryByGroupId, createCategory, editCategory }