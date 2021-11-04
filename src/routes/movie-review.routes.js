import express from 'express'

import { movieReviewsController } from '../controllers/movie-review.controllers.js'
import { getCache, setCache, invalidateCache } from '../middlewares/cache.js'
import { responseHandler } from '../middlewares/responseHandler.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'
import { validateInput } from '../middlewares/validateInput.js'

export const router = express.Router({ mergeParams: true })

// Routes for the MovieReview resoruces
router.get('/', getCache, validateInput.getMovieReviews, validateInput.validate, movieReviewsController.getMovieReviews, setCache, responseHandler)
router.get('/:reviewId', getCache, movieReviewsController.getMovieReview, setCache, responseHandler)
router.post('/', verifyAccessToken, validateInput.createMovieReview, validateInput.validate, movieReviewsController.createMovieReview, invalidateCache, responseHandler)
router.put('/:reviewId', verifyAccessToken, validateInput.updateMovieReview, validateInput.validate, movieReviewsController.updateMovieReview, invalidateCache, responseHandler)
router.delete('/:reviewId', verifyAccessToken, movieReviewsController.deleteMovieReview, invalidateCache, responseHandler)
