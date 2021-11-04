import { CustomError } from './CustomError.js'

/**
 * When the rate for request from a user/ip reach the top
 *
 * @class RateLimitError
 */
export class RateLimitError extends CustomError {
	constructor () {
		super('Too many requests, please try again later')
		this._statusCode = 429
	}
}
