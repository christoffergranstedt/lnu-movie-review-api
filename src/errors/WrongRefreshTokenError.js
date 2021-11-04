import { CustomError } from './CustomError.js'

/**
 * When provided refresh token is incorrect
 *
 * @class WrongRefreshTokenError
 */
export class WrongRefreshTokenError extends CustomError {
	constructor () {
		super('You have provided an incorrect refresh token or user id, please login again instead')
		this._statusCode = 401
	}
}
