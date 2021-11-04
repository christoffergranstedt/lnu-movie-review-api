import express from 'express'
import { router as accountsRouter } from './account.routes.js'
import { router as moviesRouter } from './movie.routes.js'
import { router as movieReviewsRouter } from './movie-review.routes.js'
import { router as moviesWebhookRouter } from './movie-webhook.routes.js'
import { router as homeRouter } from './home.routes.js'

export const router = express.Router()

// Main routes for different resources
router.use('/', homeRouter)
router.use('/accounts', accountsRouter)
router.use('/movies/webhooks', moviesWebhookRouter)
router.use('/movies', moviesRouter)
router.use('/movies/:movieId/reviews', movieReviewsRouter)
