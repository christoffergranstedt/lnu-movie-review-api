import NodeCache from 'node-cache'

const cacheStoredInSeconds = 24 * 60 * 60
const cache = new NodeCache({ stdTTL: cacheStoredInSeconds })

/**
 * To set a cache for the domain and eventual specific resource
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns next to go next middleware
 */
export const setCache = (req, res, next) => {
	const url = `${req.headers.host}${req.originalUrl}`
	cache.set(url, res.locals.data)
	return next()
}

/**
 * To get the cache for the domain and eventual specific resource
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns next to go next middleware
 */
export const getCache = (req, res, next) => {
	const url = `${req.headers.host}${req.originalUrl}`
	const content = cache.get(url)
	if (!content) return next()

	return res.status(200).send(content)
}

/**
 * Invalidate the cache that is set on the resource
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns next to go next middleware
 */
export const invalidateCache = async (req, res, next) => {
	const movieId = req.params.movieId
	const reviewId = req.params.reviewId
	const webhookId = req.params.webhookId

	const cacheKeys = await cache.keys()

	const baseUrl = req.headers.host
	const resourcesUrl = req.baseUrl
	const storesUrl = `${baseUrl}${resourcesUrl}`

	const resourceskeys = cacheKeys.filter(key => key === storesUrl)
	cache.del(resourceskeys)

	// If movieId, reviewId or webhookId is set we need to also invalidate the set cache for the specific resource
	if (movieId || reviewId || webhookId) {
		const resourceUrl = `${storesUrl}/${movieId || reviewId}`
		const resourcekeys = cacheKeys.filter(key => key === resourceUrl)
		cache.del(resourcekeys)
	}

	return next()
}
