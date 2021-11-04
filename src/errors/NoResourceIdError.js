import { CustomError } from './CustomError.js'

/**
 * When the provided resources does not exist
 *
 * @class NoResourceIdError
 */
export class NoResourceIdError extends CustomError {
	constructor (id) {
		super(`The resource of the id ${id} could not be found`)
		this._statusCode = 404
	}
}
