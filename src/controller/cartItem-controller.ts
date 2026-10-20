import type { Request, Response } from 'express'
import { prisma } from '../db.ts'

export async function cartItems(req: Request, res: Response) {
   try {
      const { user } = req

      const cartItems = await prisma.cartItem.findMany({
         where: {
            userId: user?.id,
         },
         include: {
            product: true,
         },
      })

      res.json(cartItems)
   } catch (error) {
      res.status(500).json({ message: 'Server error: ', error })
   }
}

export async function cartItem(req: Request, res: Response) {
   try {
      const { user } = req
      const { productId } = req.body

      if (!productId) {
         res.status(400).json({ message: 'productId is required' })
      }

      const existingItem = await prisma.cartItem.findFirst({
         where: {
            productId,
            userId: user?.id,
         },
      })

      let cartItem

      if (existingItem) {
         cartItem = await prisma.cartItem.update({
            where: {
               id: existingItem.id,
            },
            data: {
               quantity: {
                  increment: 1,
               },
            },
         })
      } else {
         cartItem = await prisma.cartItem.create({
            data: {
               product: {
                  connect: {
                     id: productId,
                  },
               },
               user: {
                  connect: {
                     id: user?.id,
                  },
               },
            },
         })
      }

      res.json(cartItem)
   } catch (error) {
      res.status(500).json({ message: 'Server error: ', error })
   }
}
