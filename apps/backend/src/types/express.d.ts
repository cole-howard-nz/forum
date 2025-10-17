import 'express-serve-static-core'

declare module 'express-serve-static-core' {
  interface Request {
    sessionUser?: { id: string; email: string; name?: string }
  }
}