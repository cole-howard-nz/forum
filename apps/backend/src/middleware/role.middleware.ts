import { NextFunction, Request, Response } from "express"

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

const hasPermission = (req: Request, res: Response, func: NextFunction) => {
  try {

    

    func()

  } catch (error) {
    return res.status(401).json({ msg: "Not Authorisied", error })
  }
}

export { isRole, hasPermission }