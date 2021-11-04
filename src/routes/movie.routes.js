import express from 'express'

import { moviesController } from '../controllers/movie.controllers.js'
import { getCache, setCache, invalidateCache } from '../middlewares/cache.js'
import { responseHandler, responseHandlerNewMovie } from '../middlewares/responseHandler.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'
import { validateInput } from '../middlewares/validateInput.js'

export const router = express.Router()

// Routes for the Movie resoruces
router.get('/', getCache, validateInput.getMovies, validateInput.validate, moviesController.getMovies, setCache, responseHandler)
router.get('/:movieId', getCache, moviesController.getMovie, setCache, responseHandler)
router.post('/', verifyAccessToken, validateInput.createMovie, validateInput.validate, moviesController.createMovie, invalidateCache, responseHandlerNewMovie)
router.put('/:movieId', verifyAccessToken, validateInput.updateMovie, validateInput.validate, moviesController.updateMovie, invalidateCache, responseHandler)
router.delete('/:movieId', verifyAccessToken, moviesController.deleteMovie, invalidateCache, responseHandler)
