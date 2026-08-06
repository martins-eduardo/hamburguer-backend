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

   let user = await prisma.user.findUnique({
      where: {
         email: email,
      },
   })

   if (!user) {
      throw new Error('Usuário não existe')
   }

   if (password !== user.password) {
      throw new Error('Senhas não coicidem')
   }

   res.json(user)
})

app.post('/sign-up', async (req: Request, res: Response) => {
   try {
      const { fullname, email, password, cep } = req.body

      if (!fullname || !email || !password || !cep) {
         res.status(400).json({ message: 'All information is required' })
      }

      const user = await prisma.user.findFirst({
         where: {
            email: email,
         },
      })

      if (user?.email) {
         res.status(409).json({ message: 'E-mail already exists' })
      }

      const newUser = await prisma.user.create({
         data: {
            name: fullname,
            email: email,
            password: password,
            cep: cep,
         },
      })

      res.status(201).json({ message: 'Successfully created' })
   } catch (error) {
      res.status(500).json({ message: 'Server error: ', error })
   }
})

app.listen(3000, () => {
   console.log('Servidor rodando na porta 3000')
})
