/**
 * A class that acts a base class for my custom errors and implements a certain structure
 *
 * @class CustomError
 */
export class CustomError extends Error {
	/**
 	* Returns an array of object with errors
 	*
 	* @returns {object} - Returns an array of object with errors
 	*/
	getErrors () {
		return [{ message: this.message }]
	}

	/**
 	* Returns the status code
 	*
 	* @returns {object} - Returns status code for the error
 	*/
	getStatusCode () {
		return this._statusCode
	}
}
