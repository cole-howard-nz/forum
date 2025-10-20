declare global {
  namespace Express {
    interface Request {
      sessionUser?: { id: string; email: string; name?: string, roleId?: string | null };
    }
  }
}

export {};
