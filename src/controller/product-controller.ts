import type { Request, Response } from "express";
import { prisma } from "../db.ts";

export const product = async (req: Request, res: Response) => {
   try {
    const products = await prisma.product.findMany()

    if(products.length === 0) {
      res.status(404).json({ message: "Products not found" })
    }

    res.json(products)
   } catch (error) {
      res.status(500).json({message: "Server error: ", error})
   }
}

export const deleteProduct = async (req: Request, res: Response) => {
   try {
      const { id } = req.params

      if (!id || Array.isArray(id)) {
         res.status(400).json({message: 'ID not found'})
         return
      }

      const deletedProduct = await prisma.product.delete({
         where: {
            id: id
         }
      })

      if (!deletedProduct) {
         res.status(404).json({message: "Error deleting the product"})
         return
      }

      res.json(deletedProduct)
   } catch (error: any) {
      if(error.code === 'P2025') {
         res.status(404).json({message: "Product not found"})
         return
      }
      res.status(500).json({message: "Server error: ", error})
   }
}