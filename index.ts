import { compareSync, hashSync } from 'bcrypt'
import cors from 'cors'
import express, { type Response, type Request } from 'express'
import { connection } from './src/db.ts'
import { prisma } from './src/db.ts'

const app = express()
app.use(express.json())
app.use(
   cors({
      origin: 'http://localhost:5173',
      credentials: true,
   })
)
connection()

app.post('/sign-in', async (req: Request, res: Response) => {
   const { email, password } = req.body

   const user = await prisma.user.findUnique({
      where: {
         email: email,
      },
   })

   if (!user) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
   }

   if (!compareSync(password, user.password)) {
      res.status(401).json({ message: 'Invalid email or password' })
   }
   res.status(200)
})

app.post('/sign-up', async (req: Request, res: Response) => {
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
})

app.listen(3000, () => {
   console.log('Servidor rodando na porta 3000')
})
