import type { Request, Response } from "express";
import { prisma } from "../db.ts";

export async function cartItems(req: Request, res: Response) {
    try {
        const { user } = req

        const cartItems = await prisma.cartItem.findMany({
        where: {
            userId: user?.id
        },
        include: {
            product: true
        }
    })

    res.json(cartItems)
    
    } catch (error) {
        res.status(500).json({ message: "Server error: ", error })
    }
}