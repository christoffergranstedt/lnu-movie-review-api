/**
 * Home of the REST API. Return just information about the API.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Information about the REST API
 */
const startEndpoint = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		res.locals.data = {
			message: 'Welcome to the REST API for Movie Reviews Center',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}`,
					type: 'GET'
				},
				{
					rel: 'movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
				},
				{
					rel: 'register new account',
					href: `${API_BASE_URL}/accounts/register`,
					type: 'POST'
				},
				{
					rel: 'authenticate account',
					href: `${API_BASE_URL}/accounts/authenticate`,
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

export const homeController = { startEndpoint }
