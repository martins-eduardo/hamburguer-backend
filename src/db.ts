import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }

export async function connection() {
   try {
      await prisma.$connect()
      console.log('🟢 Banco de dados conectado com sucesso.')
   } catch (error) {
      console.log('🔴 Não foi possível conectar com o banco de dados:', error)
   }
}
