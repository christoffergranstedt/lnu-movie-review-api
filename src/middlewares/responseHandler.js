import { movieWebhooksController } from '../controllers/movie-webhook.controllers.js'

/**
 * A middleware to handle all responses to user that can be called last in the routes
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns the resources and information
 */
export const responseHandler = async (req, res, next) => {
	try {
		return res.json(res.locals.data)
	} catch (error) {
		next(error)
	}
}

/**
 * A middleware to handle all responses to user that can be called last in the routes and also send a webhook response to subscribers
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns the resources and information
 */
export const responseHandlerNewMovie = async (req, res, next) => {
	try {
		res.json(res.locals.data)
		await movieWebhooksController.sendEventToWebhooksURL(res.locals.data.movie)
	} catch (error) {
		next(error)
	}
}
