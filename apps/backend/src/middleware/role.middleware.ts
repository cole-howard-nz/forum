import { NextFunction, Request, Response } from "express"
import prisma from "../utils/prisma"

const isRole = (allowedRoleIds: number | number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoleId: number = req.sessionUser?.roleId ? parseInt(req.sessionUser.roleId) : NaN
      
      if (!userRoleId)
        return res.status(401).json({ msg: "Not Authorised" })

      // Convert single role to array for consistent handling
      const allowedRoles = Array.isArray(allowedRoleIds) ? allowedRoleIds : [allowedRoleIds]

      if (!allowedRoles.includes(userRoleId)) {
        return res.status(403).json({ msg: "Insufficient permissions" })
      }

      next()

    } catch (error) {
      return res.status(500).json({ msg: "Not Authorised", error })
    }
  }
}

const hasPermission = (allowedNodes: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoleId = req.sessionUser?.roleId
      
      if (!userRoleId)
        return res.status(401).json({ msg: "Not Authorised" })

      const role = await prisma.role.findUnique({
        where: { id: userRoleId },
        include: { permissions: true }
      })

      if (!role)
        return res.status(401).json({ msg: "Not Authorised" })

      const nodes = Array.isArray(allowedNodes) ? allowedNodes : [allowedNodes]

      // True if user has 'root' permission or any of the required permissions specified in allowedNodes
      const userHasPermission: boolean = role.permissions.some(permission => permission.node === 'root' || nodes.includes(permission.node)) ?? false

      if (userHasPermission) return next()

      return res.status(403).json({ msg: "Insufficient permissions" })

    } catch (error) {
      return res.status(500).json({ msg: "Not Authorised", error })
    }
  }
}

export { isRole, hasPermission }