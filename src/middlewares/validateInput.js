import { body, query, validationResult } from 'express-validator'
import { InputValidationError } from '../errors/index.js'

export const validateInput = { }

// USER VALIDATORS
validateInput.registerUser = [
	body('username')
		.isLength({ min: 1, max: 50 }).withMessage('Username is required and need to be between 1 and 50 characters.')
		.trim()
		.escape(),
	body('password')
		.isLength({ min: 6, max: 2000 }).withMessage('Password is required and need to be between 6 and 2000 characters.')
		.trim()
		.escape()
]

validateInput.authenticateUser = [
	body('username')
		.isLength({ min: 1, max: 50 }).withMessage('Username is required and need to be between 1 and 50 characters.')
		.trim()
		.escape(),
	body('password')
		.isLength({ min: 6, max: 2000 }).withMessage('Password is required and need to be between 6 and 2000 characters.')
		.trim()
		.escape()
]

// MOVIE VALIDATORS
validateInput.createMovie = [
	body('name')
		.isLength({ min: 1, max: 100 }).withMessage('Name is required and need to be between 1 and 100 characters.')
		.trim()
		.escape(),
	body('year')
		.custom(value => {
			if (!value?.match(/^\d{4}$/)) return false
			return true
		}).withMessage('Year is required and format needs to match YYYY'),
	body('imageCoverLink')
		.isURL().withMessage('URL is required and need to be a valid URL')
]

validateInput.updateMovie = [
	body('name')
		.isLength({ min: 1, max: 100 }).withMessage('Name is required and need to be between 1 and 100 characters.')
		.trim()
		.escape(),
	body('year')
		.custom(value => {
			if (!value?.match(/^\d{4}$/)) return false
			return true
		}).withMessage('Year is required and format needs to match YYYY'),
	body('imageCoverLink')
		.isURL().withMessage('URL is required and need to be a valid URL')
]

// MOVIE REVIEW VALIDATORS
validateInput.createMovieReview = [
	body('title')
		.isLength({ min: 1, max: 100 }).withMessage('Title need to be between 1 and 100 characters.')
		.trim()
		.escape(),
	body('description')
		.isLength({ min: 1, max: 10000 }).withMessage('Description need to be between 1 and 10 000 characters.')
		.trim()
		.escape(),
	body('rating')
		.isInt({ min: 0, max: 10 }).withMessage('Rating needs to be an integer between 0 and 10')
]

validateInput.updateMovieReview = [
	body('title')
		.isLength({ min: 1, max: 100 }).withMessage('Title need to be between 1 and 100 characters.')
		.trim()
		.escape(),
	body('description')
		.isLength({ min: 1, max: 10000 }).withMessage('Description need to be between 1 and 10 000 characters.')
		.trim()
		.escape(),
	body('rating')
		.isInt({ min: 0, max: 10 }).withMessage('Rating needs to be an integer between 0 and 10')
]

// WEBHOOK VALIDATORS
validateInput.createWebhook = [
	body('url')
		.isURL().withMessage('URL is required and need to be a valid URL'),
	body('token')
		.optional()
		.isLength({ min: 1, max: 2000 }).withMessage('Token need to be between 1 and 10 000 characters.')
		.trim()
]

validateInput.getMovies = [
	query('year')
		.optional()
		.custom(value => {
			if (!value?.match(/^\d{4}$/)) return false
			return true
		}).withMessage('Year is required and format needs to match YYYY'),
	query('pageSize')
		.optional()
		.isInt({ min: 1, max: 2000 }).withMessage('pageSize needs to be an integer between 1 and 2000'),
	query('pageStartIndex')
		.optional()
		.isLength().withMessage('pageStartIndex must be an integer.')
		.trim()
]

validateInput.getMovieReviews = [
	query('rating')
		.optional()
		.isInt({ min: 0, max: 10 }).withMessage('rating needs to be an integer between 0 and 10'),
	query('pageSize')
		.optional()
		.isInt({ min: 1, max: 2000 }).withMessage('pageSize needs to be an integer between 1 and 2000'),
	query('pageStartIndex')
		.optional()
		.isLength().withMessage('pageStartIndex must be an integer.')
		.trim()
]

/**
 * Middleware, validate if there are any errors of input.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} User and message.
 */
validateInput.validate = (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		return next()
	}

	const extractedErrors = []
	errors.array().map(error => extractedErrors.push({ message: error.msg }))
	throw new InputValidationError(extractedErrors)
}
