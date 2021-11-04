import express from 'express'

import { homeController } from '../controllers/home.controllers.js'
import { getCache, setCache } from '../middlewares/cache.js'
import { responseHandler } from '../middlewares/responseHandler.js'

export const router = express.Router()

// Routes for the startpage of the API
router.get('/', getCache, homeController.startEndpoint, setCache, responseHandler)
