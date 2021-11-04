import { CustomError } from './CustomError.js'

/**
 * When the provided resources is not found
 *
 * @class NoResourceIdError
 */
export class NotFoundError extends CustomError {
	constructor () {
		super('Route not found')
		this._statusCode = 404
	}
}
