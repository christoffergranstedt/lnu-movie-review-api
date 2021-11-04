import express from 'express'

import { accountsController } from '../controllers/account.controllers.js'
import { validateInput } from '../middlewares/validateInput.js'
import { responseHandler } from '../middlewares/responseHandler.js'

export const router = express.Router()

// Routes for the Account resoruces
router.post('/authenticate', validateInput.authenticateUser, validateInput.validate, accountsController.authenticateUser, responseHandler)
router.post('/register', validateInput.registerUser, validateInput.validate, accountsController.registerUser, responseHandler)
router.post('/refresh', accountsController.refreshAccessToken, responseHandler)
