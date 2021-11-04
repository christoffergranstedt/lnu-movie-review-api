import { Movie } from '../config/sequelize.js'

/**
 * Get all movies. Possible to use with pagination.
 * Accessible for everyone.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns movie reviews based on the filtered and paginated settings provided
 */
const getMovies = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { pageSize, pageStartIndex, year } = req.query

		const defaultPageSize = 20
		const defaultPageStartIndex = 0
		const selectedPageSize = pageSize || defaultPageSize
		const selectedStartPageIndex = pageStartIndex || defaultPageStartIndex
		const movies = await Movie.getMovies(selectedPageSize, selectedStartPageIndex, year)

		res.locals.data = {
			movies: movies,
			message: 'All movies for your provided options',
			links: [
				{
					rel: 'self',
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
				href: `${API_BASE_URL}/movies/?pageSize=${selectedPageSize}&startPageIndex=${newSelectedStartPageIndex}`,
				type: 'GET'
			}
		}

		if (movies.length > (selectedPageSize + selectedStartPageIndex)) {
			const newSelectedStartPageIndex = selectedStartPageIndex + selectedPageSize
			res.locals.data.links = {
				rel: 'next movies',
				href: `${API_BASE_URL}/movies/?pageSize=${selectedPageSize}&startPageIndex=${newSelectedStartPageIndex}`,
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
 * Get a specific movie.
 * Accessible for everyone.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about the movie.
 */
const getMovie = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { movieId } = req.params
		const movie = await Movie.getMovie(movieId)

		res.locals.data = {
			data: movie,
			message: 'The specific movie',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/${movieId}`,
					type: 'GET'
				},
				{
					rel: 'update the movie',
					href: `${API_BASE_URL}/movies/${movieId}`,
					type: 'PUT'
				},
				{
					rel: 'delete the movie',
					href: `${API_BASE_URL}/movies/${movieId}`,
					type: 'DELETE'
				},
				{
					rel: 'reviews for the movie',
					href: `${API_BASE_URL}/movies/${movieId}/reviews`,
					type: 'GET'
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
 * Create a new movie  providing the attributes name, year and imageCoverLink in the body.
 * Accessible only by authenticated users.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about a successful creation
 */
const createMovie = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { name, year, imageCoverLink } = req.body
		await Movie.checkIfAuthorized(req.user.id)
		const movie = await Movie.createMovie({ name, year, imageCoverLink })
		res.locals.data = {
			message: `You have successfully added movie ${name} to database`,
			movie: movie,
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/${movie.id}`,
					type: 'GET'
				},
				{
					rel: 'update the movie',
					href: `${API_BASE_URL}/movies/${movie.id}`,
					type: 'PUT'
				},
				{
					rel: 'delete the movie',
					href: `${API_BASE_URL}/movies/${movie.id}`,
					type: 'DELETE'
				},
				{
					rel: 'reviews for the movie',
					href: `${API_BASE_URL}/movies/${movie.id}/reviews`,
					type: 'GET'
				},
				{
					rel: 'add a new movie',
					href: `${API_BASE_URL}/movies`,
					type: 'POST'
				},
				{
					rel: 'movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
				}
			]
		}

		res.location(`${API_BASE_URL}/movies/${movie.id}`)
		res.status(201)
		return next()
	} catch (error) {
		next(error)
	}
}

/**
 * Update an existing movie review by providing the attributes name, year and imageCoverLink in the body.
 * Accessible only by authenticated users and authorized user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about a successful update
 */
const updateMovie = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { movieId } = req.params
		const { name, year, imageCoverLink } = req.body
		await Movie.checkIfAuthorized(req.user.id)
		const movie = await Movie.updateMovie(movieId, { name, year, imageCoverLink })

		res.locals.data = {
			message: `You have successfully updated movie ${name} in database`,
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/${movie.id}`,
					type: 'PUT'
				},
				{
					rel: 'delete the movie',
					href: `${API_BASE_URL}/movies/${movie.id}`,
					type: 'DELETE'
				},
				{
					rel: 'reviews for the movie',
					href: `${API_BASE_URL}/movies/${movie.id}/reviews`,
					type: 'GET'
				},
				{
					rel: 'add a new movie',
					href: `${API_BASE_URL}/movies`,
					type: 'POST'
				},
				{
					rel: 'movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
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
 * Delete an existing movie by providing movie ID.
 * Accessible only by authenticated users and authorized user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information about a successful delete
 */
const deleteMovie = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { movieId } = req.params
		await Movie.checkIfAuthorized(req.user.id)
		await Movie.deleteMovie(movieId)

		res.locals.data = {
			message: `You have successfully deleted movie ${movieId} in database`,
			links: [
				{
					rel: 'add a new movie',
					href: `${API_BASE_URL}/movies`,
					type: 'POST'
				},
				{
					rel: 'movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
				}
			]
		}

		res.status(200)
		return next()
	} catch (error) {
		next(error)
	}
}

export const moviesController = { getMovies, getMovie, createMovie, updateMovie, deleteMovie }
