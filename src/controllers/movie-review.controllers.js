import { MovieReview } from '../config/sequelize.js'

/**
 * Get all movie reviews that are connected with a certain movie. Possible to use with pagination.
 * Accessible for everyone.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns movie reviews based on the filtered and paginated settings provided
 */
const getMovieReviews = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { pageSize, pageStartIndex, rating } = req.query
		const { movieId } = req.params
		const defaultPageSize = 20
		const defaultPageStartIndex = 0
		const selectedPageSize = pageSize || defaultPageSize
		const selectedStartPageIndex = pageStartIndex || defaultPageStartIndex
		const movieReviews = await MovieReview.getMovieReviews(movieId, selectedPageSize, selectedStartPageIndex, rating)

		res.locals.data = {
			reviews: movieReviews,
			message: 'All movie reviews for your selected movie and provided options',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/${movieId}/reviews`,
					type: 'GET'
				},
				{
					rel: 'movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
				},
				{
					rel: 'specific movie',
					href: `${API_BASE_URL}/movies/{movie}`,
					type: 'GET'
				},
				{
					rel: 'reviews for a movie',
					href: `${API_BASE_URL}/movies/{movie}/reviews`,
					type: 'GET'
				}
			]
		}

		if (selectedStartPageIndex > 0) {
			let newSelectedStartPageIndex = selectedStartPageIndex - selectedPageSize
			if (newSelectedStartPageIndex < 0) newSelectedStartPageIndex = 0
			res.locals.data.links = {
				rel: 'previous movies',
				href: `${API_BASE_URL}/movies/${movieId}/reviews?pageSize=${selectedPageSize}&startPageIndex=${newSelectedStartPageIndex}`,
				type: 'GET'
			}
		}

		if (movieReviews.length > (selectedPageSize + selectedStartPageIndex)) {
			const newSelectedStartPageIndex = selectedStartPageIndex + selectedPageSize
			res.locals.data.links = {
				rel: 'next movies',
				href: `${API_BASE_URL}/movies/${movieId}/reviews?pageSize=${selectedPageSize}&startPageIndex=${newSelectedStartPageIndex}`,
				type: 'GET'
			}
		}
		res.status(200)

		return next()
	} catch (error) {
		next(error)
	}
}

/**
 * Get a specific movie review.
 * Accessible for everyone.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about the moviereview
 */
const getMovieReview = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { reviewId, movieId } = req.params
		const movieReview = await MovieReview.getMovieReview(reviewId)

		res.locals.data = {
			review: movieReview,
			message: 'The movie review is fetched',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/${movieId}/reviews/${reviewId}`,
					type: 'GET'
				},
				{
					rel: 'movie information',
					href: `${API_BASE_URL}/movies/${movieId}`,
					type: 'GET'
				},
				{
					rel: 'more reviews for the movie',
					href: `${API_BASE_URL}/movies/${movieId}/reviews`,
					type: 'GET'
				},
				{
					rel: 'add new review to the movie',
					href: `${API_BASE_URL}/movies/${movieId}/reviews`,
					type: 'POST'
				}
			]
		}
		res.status(200)
		return next()
	} catch (error) {
		next(error)
	}
}

/**
 * Create a new movie review connected to a specific movie by providing the attributes title, description and rating in the body.
 * Accessible only by authenticated users.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about a successful creation
 */
const createMovieReview = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { movieId } = req.params
		const { title, description, rating } = req.body
		const userId = req.user.id

		const review = await MovieReview.createMovieReview(userId, movieId, { title, description, rating })
		res.locals.data = {
			review: review,
			message: 'You have successfully create a movie review',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/${movieId}/reviews/${review.id}`,
					type: 'GET'
				},
				{
					rel: 'movie information',
					href: `${API_BASE_URL}/movies/${movieId}`,
					type: 'GET'
				},
				{
					rel: 'more reviews for the movie',
					href: `${API_BASE_URL}/movies/${movieId}/reviews`,
					type: 'GET'
				},
				{
					rel: 'update the movie review',
					href: `${API_BASE_URL}/movies/${movieId}/reviews/${review.id}`,
					type: 'PUT'
				},
				{
					rel: 'delete the movie review',
					href: `${API_BASE_URL}/movies/${movieId}/reviews/${review.id}`,
					type: 'DELETE'
				}
			]
		}

		res.location(`${API_BASE_URL}/movies/${movieId}/reviews/${review.id}`)
		res.status(201)
		return next()
	} catch (error) {
		next(error)
	}
}

/**
 * Update an existing movie review by providing the attributes title, description and rating in the body.
 * Accessible only by authenticated users and authorized user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about a successful update
 */
const updateMovieReview = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { reviewId, movieId } = req.params
		const { title, description, rating } = req.body

		await MovieReview.checkIfAuthorized(req.user.id, reviewId)
		await MovieReview.updateMovieReview(reviewId, { title, description, rating })

		res.locals.data = {
			message: 'You have successfully updated the movie review',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/${movieId}/reviews/${reviewId}`,
					type: 'PUT'
				},
				{
					rel: 'movie information',
					href: `${API_BASE_URL}/movies/${movieId}`,
					type: 'GET'
				},
				{
					rel: 'more reviews for the movie',
					href: `${API_BASE_URL}/movies/${movieId}/reviews`,
					type: 'GET'
				},
				{
					rel: 'delete the movie review',
					href: `${API_BASE_URL}/movies/${movieId}/reviews/${reviewId}`,
					type: 'DELETE'
				}
			]
		}

		res.status(200)
		return next()
	} catch (error) {
		next(error)
	}
}

/**
 * Delete an existing movie review by providing movie review ID.
 * Accessible only by authenticated users and authorized user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about a successful delete
 */
const deleteMovieReview = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { reviewId, movieId } = req.params
		await MovieReview.checkIfAuthorized(req.user.id, reviewId)
		await MovieReview.deleteMovieReview(reviewId)

		res.locals.data = {
			message: 'You have successfully delete the movie review',
			links: [
				{
					rel: 'movie information',
					href: `${API_BASE_URL}/movies/${movieId}`,
					type: 'GET'
				},
				{
					rel: 'more reviews for the movie',
					href: `${API_BASE_URL}/movies/${movieId}/reviews`,
					type: 'GET'
				},
				{
					rel: 'add a new movie review',
					href: `${API_BASE_URL}/movies/${movieId}/reviews/${reviewId}`,
					type: 'POST'
				}
			]
		}

		res.status(200)
		return next()
	} catch (error) {
		next(error)
	}
}

export const movieReviewsController = { getMovieReviews, getMovieReview, createMovieReview, updateMovieReview, deleteMovieReview }
