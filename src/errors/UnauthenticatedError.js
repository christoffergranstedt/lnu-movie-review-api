import { CustomError } from './CustomError.js'

/**
 * When ta user is not authenticated to reach a endpoint
 *
 * @class UnauthenticatedError
 */
export class UnauthenticatedError extends CustomError {
	constructor () {
		super('You are not authenticated for this endpoint, possibly wrong token or passed in wrong format in request headers "Authorization" ("Bearer <Token>")')
		this._statusCode = 401
	}
}
