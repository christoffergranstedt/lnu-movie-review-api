import { UnauthenticatedError } from '../errors/index.js'
import jwt from 'jsonwebtoken'

/**
 * Verifies if user provided a correct access token in authorization header
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns next
 */
export const verifyAccessToken = async (req, res, next) => {
	try {
		const { ACCESS_TOKEN_SECRET } = process.env
		const authType = req.headers.authorization?.split(' ')[0]
		const authToken = req.headers.authorization?.split(' ')[1]

		if (authType !== 'Bearer') return next(new UnauthenticatedError())

		const tokenPayload = jwt.verify(authToken, ACCESS_TOKEN_SECRET)
		req.user = {
			id: tokenPayload.userId,
			username: tokenPayload.username
		}
		return next()
	} catch (error) {
		throw new UnauthenticatedError()
	}
}
