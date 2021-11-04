import rateLimit from 'express-rate-limit'

import { RateLimitError } from '../errors/RateLimitError.js'

/**
 * Set the rate limit for a specific IP-adress
 *
 */
export const apiRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	handler: (req, res, next) => {
		throw new RateLimitError()
	}
})
