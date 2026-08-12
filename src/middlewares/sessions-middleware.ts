import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const sessionsMiddleware = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { user } = req.cookies

   if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'Server error' })
      return
   }

   try {
      const decoded = jwt.verify(user, process.env.JWT_SECRET)

      req.user = decoded
      next()
   } catch (error) {
      res.status(401).json({ message: 'Unauthenticated user' })
      return
   }
}
