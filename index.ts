import express, { type Response, type Request } from 'express'
import { connection } from './src/db.ts'
import { prisma } from './src/db.ts'
import cors from 'cors'

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

app.listen(3000, () => {
   console.log('Servidor rodando na porta 3000')
})
