import jwt from 'jsonwebtoken'
import cryptoRandomString from 'crypto-random-string'
import { User } from '../config/sequelize.js'
import { UnauthenticatedError } from '../errors/index.js'

/**
 * Authenticate a user by checking if the provided username and password exist in database and returns an access token and a refresh token
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Access token and refresh token for user.
 */
const authenticateUser = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { username, password } = req.body
		const user = await User.authenticate(username, password, next)

		const { ACCESS_TOKEN_SECRET } = process.env
		const payload = {
			userId: user.id,
			username: username
		}

		const optionsAccessToken = {
			expiresIn: '1h',
			algorithm: 'HS256'
		}

		const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET, optionsAccessToken)

		const refreshToken = cryptoRandomString({ length: 64, type: 'base64' })

		await User.storeRefreshToken(user.id, refreshToken)

		res.locals.data = {
			accessToken: accessToken,
			refreshToken: refreshToken,
			message: 'You are now authenticated',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/account/authenticate`,
					type: 'POST'
				},
				{
					rel: 'refresh access token',
					href: `${API_BASE_URL}/account/refresh`,
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
		res.status(200)
		return next()
	} catch (error) {
		next(error)
	}
}

/**
 * Registers a new account by providing a username and password.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Information about successful register.
 */
const registerUser = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { username, password } = req.body
		await User.register(username, password)
		res.locals.data = {
			message: `Welcome to Movie Review Center ${username}. Please login via link below with your username and password before able to access more endpoints`,
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/account/register`,
					type: 'POST'
				},
				{
					rel: 'authenticate',
					href: `${API_BASE_URL}/account/authenticate`,
					type: 'POST'
				}
			]
		}
		res.status(201)
		return next()
	} catch (error) {
		next(error)
	}
}

/**
 * Refresh an access token that has expired by providing a refresh token. The refresh token is compared with whats in the database for the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - New access token and refresh token for user.
 */
const refreshAccessToken = async (req, res, next) => {
	try {
		const { ACCESS_TOKEN_SECRET, API_BASE_URL } = process.env

		const authType = req.headers.authorization?.split(' ')[0]
		const refreshToken = req.headers.authorization?.split(' ')[1]
		if (authType !== 'Bearer') return next(new UnauthenticatedError())
		const { userId } = req.body

		const user = await User.authenticateRefreshToken(userId, refreshToken)

		const payload = {
			userId: user.id,
			username: user.username
		}

		const optionsAccessToken = {
			expiresIn: '1h',
			algorithm: 'HS256'
		}

		const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET, optionsAccessToken)

		const newRefreshToken = cryptoRandomString({ length: 64, type: 'base64' })

		User.storeRefreshToken(user.id, newRefreshToken)

		res.locals.data = {
			accessToken: accessToken,
			refreshToken: newRefreshToken,
			message: 'You have now refreshed your access token and refresh token',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/account/refresh`,
					type: 'POST'
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

		res.status(200)
		return next()
	} catch (error) {
		next(error)
	}
}

export const accountsController = { authenticateUser, registerUser, refreshAccessToken }
