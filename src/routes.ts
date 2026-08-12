import { Router } from 'express'
import { logout, me, signIn, signUp } from './controller/sessions-controller.ts'

export const router = Router()

//User routes
router.post('/sign-in', signIn)
router.post('/sign-up', signUp)
router.get('/me', me)
router.post('/logout', logout)
