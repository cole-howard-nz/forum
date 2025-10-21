import { NextFunction, Request, Response } from "express";


const TestController = (req: Request, res: Response) => {
  try {
    console.log("TestController reached successfully")
    return res.status(200).json({ user: req.sessionUser })

  } catch (error) {
    return res.status(401).json({ msg: "Unexpected error in TestController", error })
  }
}

export { TestController}