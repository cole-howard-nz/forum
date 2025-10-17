import { NextFunction, Request, Response } from "express"
import auth from "../utils/auth"


const isAuthenticated = async (req: Request, res: Response, func: NextFunction) => {
  try {
    const session = await auth.api.getSession({ 
      headers: req.headers as Record<string, string>
    })

    if (!session || !session.user ) return res.status(401).json({ message: 'Not Authenticated' })

    // Attach the user in session to all requests using this middleware function
    req.sessionUser = session.user
    func()
    
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Not Authenticated'})
  }
}

export default isAuthenticated