import { CustomError } from './CustomError.js'

/**
 * A class for when user provides wrong input
 *
 * @class InputValidationError
 */
export class InputValidationError extends CustomError {
	constructor (errorArray) {
		super('User input is incorrect')
		this._statusCode = 400
		this._messages = errorArray
	}

	/**
	 * Overwrites the base class implementation since the passed errors are an array already
	 *
	 * @class InputValidationError
	 */
	getErrors () {
		return this._messages
	}
}
