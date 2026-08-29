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