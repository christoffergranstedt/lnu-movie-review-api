import { Webhook } from '../config/sequelize.js'
import axios from 'axios'

/**
 * Add a webhook by providing webhook ID.
 * Accessible only by authenticated users and authorized user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information the webhook
 */
const getWebhook = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { webhookId } = req.params
		await Webhook.checkIfAuthorized(req.user.id, webhookId)
		const webhook = await Webhook.getWebhook(webhookId)

		res.locals.data = {
			webhook: webhook,
			message: 'The movie webhook is fetched',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/webhooks/${webhookId}`,
					type: 'GET'
				},
				{
					rel: 'all movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
				},
				{
					rel: 'delete the movie webhook',
					href: `${API_BASE_URL}/movies/webhooks/${webhookId}`,
					type: 'DELETE'
				}
			]
		}

		res.status(200)
		return next()
	} catch (error) {
		return next(error)
	}
}

/**
 * Create a webhook by providing webhook ID.
 * Accessible only by authenticated users.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information the webhook
 */
const createWebhook = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { url, token } = req.body

		const webhook = await Webhook.createWebhook(req.user.id, url, token)
		res.locals.data = {
			webhook: webhook,
			message: 'The movie webhook is created',
			links: [
				{
					rel: 'self',
					href: `${API_BASE_URL}/movies/webhooks/${webhook[0]}`,
					type: 'GET'
				},
				{
					rel: 'all movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
				},
				{
					rel: 'delete the movie webhook',
					href: `${API_BASE_URL}/movies/webhooks/${webhook[0]}`,
					type: 'DELETE'
				}
			]
		}

		res.location(`${API_BASE_URL}/movies/webhooks/${webhook[0]}`)
		res.status(201)
		return next()
	} catch (error) {
		return next(error)
	}
}

/**
 * Delete a webhook by providing webhook ID.
 * Accessible only by authenticated users and authorized user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns information the webhook
 */
const deleteWebhook = async (req, res, next) => {
	try {
		const { API_BASE_URL } = process.env
		const { webhookId } = req.params

		await Webhook.checkIfAuthorized(req.user.id, webhookId)
		await Webhook.deleteWebhook(webhookId)

		res.locals.data = {
			message: 'The movie webhook is deleted',
			links: [
				{
					rel: 'all movies',
					href: `${API_BASE_URL}/movies`,
					type: 'GET'
				},
				{
					rel: 'add a new movie webhook',
					href: `${API_BASE_URL}/movies/webhooks`,
					type: 'POST'
				}
			]
		}

		res.status(200)
		return next()
	} catch (error) {
		return next(error)
	}
}

/**
 * Sends a response to all url that are stored in the webhook table and wants a notification about a newly added movie
 *
 * @param {object} movie - Information about the newly added movie.
 */
const sendEventToWebhooksURL = async (movie) => {
	const allWebhooks = await Webhook.getAll()
	const allAxiosPromises = allWebhooks.map(webhook => axios.post(webhook.url, { ...movie, token: webhook.token }))
	Promise.allSettled(allAxiosPromises)
}

export const movieWebhooksController = { getWebhook, createWebhook, deleteWebhook, sendEventToWebhooksURL }
