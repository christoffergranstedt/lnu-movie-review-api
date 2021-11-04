import { CustomError } from './CustomError.js'

/**
 * When ta user is not authorized to change a resource
 *
 * @class UnAuthorizedError
 */
export class UnAuthorizedError extends CustomError {
	constructor () {
		super('You are not permitted to change this resource, or possibly is your permission level to low to create new resources')
		this._statusCode = 403
	}
}
