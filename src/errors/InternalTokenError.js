import { CustomError } from './CustomError.js'

/**
 * A class for when an error interanlly in handling the token
 *
 * @class InternalTokenError
 */
export class InternalTokenError extends CustomError {
	constructor () {
		super('Internal token error in server')
		this._statusCode = 500
	}
}
