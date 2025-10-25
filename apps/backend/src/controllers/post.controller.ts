import { Request, Response } from "express"
import prisma from "../utils/prisma"


// getAllPosts
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany()
    if (!posts || posts.length === 0) {
      res.status(200).send({ msg: "No posts found" })
    } 
    return res.status(200).send({ msg: "Sending all posts", posts })

  } catch (error) {
    res.status(500).send({ msg: "Unexpected error in getAllPosts", error })
  }
}

// getPostsByUser
const getPostsByUser = async (req: Request, res: Response) => {
  try {
     const { userId } = req.params
     
     if (!userId) {
      return await getAllPosts(req, res)
     }

     const user = await prisma.user.findUnique({ where: { id: userId }})
     if (!user) {
      return res.status(404).send({ msg: `Cannot find user with id: ${ userId }` })
     }

     const posts = await prisma.post.findMany({ where: { userId } })
     if (!posts || posts.length === 0) {
      return res.status(404).send({ msg: `Cannot find any posts with id: ${ userId }` })
     }

     return res.status(200).send({ msg: `Found posts from user: ${ userId }`, posts })
  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getPostsByUser", error })
  }
}

// getPostsByAlphabet
const getPostsByAlphabet = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body

    const limit = amount ? parseInt(amount, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send({ msg: "Invalid amount parameter" })
    }

    // Fetch posts sorted alphabetically by name
    const posts = await prisma.post.findMany({
      orderBy: { title: 'asc' },
      ...(limit && { take: limit })
    })

    const message = limit ? `Sending ${ limit } posts sorted alphabetically` : "Sending all posts sorted alphabetically"
    return res.status(200).send({ msg: message, posts })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getPostsByAlphabet", error })
  }
}

// getHiddenPosts
const getHiddenPosts = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body

    const limit = amount ? parseInt(amount, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send({ msg: "Invalid amount parameter" })
    }

    // Fetch all hiddens posts
    const posts = await prisma.post.findMany({
      where: { isHidden: true },
      ...(limit && { take: limit })
    })

    const message = limit ? `Sending ${ limit } posts that are hidden` : "Sending all posts that are hidden"
    return res.status(200).send({ msg: message, posts })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getHiddenPosts", error })
  }
}

// getLockedPosts
const getLockedPosts = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body

    const limit = amount ? parseInt(amount, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send({ msg: "Invalid amount parameter" })
    }

    // Fetch all locked posts
    const posts = await prisma.post.findMany({
      where: { isLocked: true },
      ...(limit && { take: limit })
    })

    const message = limit ? `Sending ${ limit } posts that are locked` : "Sending all posts that are locked"
    return res.status(200).send({ msg: message, posts })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getLockedPosts", error })
  }
}

// getPinnedPosts
const getPinnedPosts = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body

    const limit = amount ? parseInt(amount, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send({ msg: "Invalid amount parameter" })
    }

    // Fetch all pinned posts
    const posts = await prisma.post.findMany({
      where: { isPinned: true },
      ...(limit && { take: limit })
    })

    const message = limit ? `Sending ${ limit } posts that are pinned` : "Sending all posts that are pinned"
    return res.status(200).send({ msg: message, posts })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getPinnedPosts", error })
  }
}

// getMostViewedPosts
const getMostViewedPosts = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body

    const limit = amount ? parseInt(amount, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send({ msg: "Invalid amount parameter" })
    }

    // Fetch all posts sorted by viewCount
    const posts = await prisma.post.findMany({
      orderBy: { viewCount: 'desc' },
      ...(limit && { take: limit })
    })

    const message = limit ? `Sending ${ limit } posts sorted by viewCount` : "Sending all posts sorted by viewCount"
    return res.status(200).send({ msg: message, posts })

  } catch (error) {
    return res.status(500).send({ msg: "Unexpected error in getMostViewedPosts", error })
  }
}

// getMostVotedPosts

// getMostUpVotedPosts

// getMostDownVotedPosts


export { getAllPosts, getPostsByUser, getPostsByAlphabet, getHiddenPosts, getLockedPosts, getPinnedPosts, getMostViewedPosts }