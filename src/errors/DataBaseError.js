import { CustomError } from './CustomError.js'

/**
 * A class for genereal database connection or query errors
 *
 * @class DataBaseError
 */
export class DataBaseError extends CustomError {
	constructor () {
		super('Internal database connection error')
		this._statusCode = 500
	}
}
