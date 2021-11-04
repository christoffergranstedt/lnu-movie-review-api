import { CustomError } from './CustomError.js'

/**
 * When a user already has set a webhook
 *
 * @class WebhookAlreadySetError
 */
export class WebhookAlreadySetError extends CustomError {
	constructor () {
		super('You have already set a webhook, use the get endpoint to view it')
		this._statusCode = 400
	}
}
