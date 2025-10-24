import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { PERMISSIONS } from "../constants/permissions";
import { userHasPermission } from "../utils/role";
import { getUserIdFromRequest } from "../utils/auth";
import { Prisma } from "@prisma/client";


// Get all groups
const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany()
    if (!groups || groups.length === 0) {
      res.status(200).send({ msg: "No groups found" })
    } 
    return res.status(200).send({ msg: "Sending all groups", groups })

  } catch (error) {
    res.status(500).send({ msg: "Unexpected error in getAllGroups", error })
  }
}

// Get group by id
const getGroupById = async (req: Request, res: Response) => {
  try {
     const { groupId } = req.params
     
     if (!groupId) {
      return await getAllGroups(req, res)
     }

     const group = await prisma.group.findUnique({ where: { id: groupId }})
     if (!group) {
      return res.status(404).send({ msg: `Cannot find group with id: ${ groupId }` })
     }

     return res.status(200).send({ msg: `Found group with id: ${ groupId }`, group })
  } catch (error) {
    res.status(500).send({ msg: "Unexpected error in getGroupById", error })
  }
}

// Create group (Permission)
const createGroup = async (req: Request, res: Response) => {
  try {
    const sessionUserId = await getUserIdFromRequest(req)
    if (!sessionUserId || (sessionUserId && !await userHasPermission(sessionUserId, PERMISSIONS.GROUP.CREATE))) {
      return res.status(403).send({ msg: "Insufficient permission to create a category"})
    }

    const prismaCategoryAttributes = Object.keys(Prisma.GroupScalarFieldEnum)
    const ignoredAttributes = ["id", "createdAt", "updatedAt"]
    const optionalAttributes = ["description"]

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
      return res.status(400).json({ msg: "Missing required fields to create Group", missingFields, requiredFields: requiredAttributes, optionalFields: optionalAttributes })
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


export { getAllGroups, getGroupById, createGroup, editGroup, deleteGroup }