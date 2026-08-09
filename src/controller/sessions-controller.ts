import { compareSync, hashSync } from 'bcrypt'
import type { Request, Response } from 'express'
import { prisma } from '../db.ts'

export const signIn = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body

      const user = await prisma.user.findUnique({
         where: {
            email: email,
         },
      })

      if (!user) {
         return res.status(401).json({ message: 'Invalid email or password' })
      }

      if (!compareSync(password, user.password)) {
         return res.status(401).json({ message: 'Invalid email or password' })
      }

      res.status(200).json({ message: 'Login successful' })
   } catch (error) {
      return res.status(500).json({
         message: 'Server error',
         error,
      })
   }
}

export const signUp = async (req: Request, res: Response) => {
   try {
      const { name, email, password, cep } = req.body

      if (!name || !email || !password || !cep) {
         return res.status(400).json({
            message: 'All information is required',
         })
      }

      const user = await prisma.user.findFirst({
         where: {
            email,
         },
      })

      if (user) {
         return res.status(409).json({
            message: 'E-mail already exists',
         })
      }

      const newUser = await prisma.user.create({
         data: {
            name: name,
            email: email,
            password: hashSync(password, 10),
            cep: cep,
         },
      })

      return res.status(201).json({
         message: 'Successfully created',
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Server error',
         error,
      })
   }
}
