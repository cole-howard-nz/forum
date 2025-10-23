import { NextFunction, Request, Response } from "express"
import auth from "../utils/auth"
import prisma from "../utils/prisma"


const isAuthenticated = async (req: Request, res: Response, func: NextFunction) => {
  try {
    const session = await auth.api.getSession({ 
      headers: req.headers as Record<string, string>
    })

    if (!session || !session.user ) return res.status(401).json({ message: 'No user in sesion' })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) return res.status(401).json({ message: 'Not Authenticated' })

    // Attach the user in session to all requests using this middleware function
    req.sessionUser = session.user
    req.sessionUser.roleId = user.roleId

    func()
    
  } catch (error) {
    return res.status(401).json({ message: 'Unexpected error', error })
  }
}

export { isAuthenticated }