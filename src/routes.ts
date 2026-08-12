import { Router } from 'express'
import { logout, me, signIn, signUp } from './controller/sessions-controller.ts'
import { sessionsMiddleware } from './middlewares/sessions-middleware.ts'

export const router = Router()

//User routes
router.post('/sign-in', signIn)
router.post('/sign-up', signUp)
router.get('/me', sessionsMiddleware, me)
router.post('/logout', sessionsMiddleware, logout)
