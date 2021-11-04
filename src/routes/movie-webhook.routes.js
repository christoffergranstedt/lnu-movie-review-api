import express from 'express'

import { movieWebhooksController } from '../controllers/movie-webhook.controllers.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'
import { getCache, setCache, invalidateCache } from '../middlewares/cache.js'
import { responseHandler } from '../middlewares/responseHandler.js'
import { validateInput } from '../middlewares/validateInput.js'

export const router = express.Router({ mergeParams: true })

// Routes for the Movie webhook resoruces
router.get('/:webhookId', verifyAccessToken, getCache, movieWebhooksController.getWebhook, setCache, responseHandler)
router.post('/', verifyAccessToken, validateInput.createWebhook, validateInput.validate, movieWebhooksController.createWebhook, responseHandler)
router.delete('/:webhookId', verifyAccessToken, movieWebhooksController.deleteWebhook, invalidateCache, responseHandler)
