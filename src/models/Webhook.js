import { WebhookAlreadySetError, UnAuthorizedError, NoResourceIdError, DataBaseError } from '../errors/index.js'

/**
 * To get a webhook model for storing info about which users wants webhook when a new movie is added
 *
 * @param {object} sequelize - The created sequelize instance.
 * @param {object} DataTypes - Diffrent datatypes for sequelize.
 * @returns {object} - Returns the Webhook model
 */
export default (sequelize, DataTypes) => {
	const Webhook = sequelize.define('Webhook', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdAt: {
			field: 'created-at',
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			field: 'updated-at',
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {})

	Webhook.checkIfAuthorized = async function (userId, webhookId) {
		try {
			const webhook = await this.findByPk(webhookId)
			if (!webhook) throw new NoResourceIdError()
			if (webhook.UserId !== userId) throw new UnAuthorizedError()
			return true
		} catch (error) {
			if (error instanceof UnAuthorizedError) throw new UnAuthorizedError()
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(webhookId)
			throw new DataBaseError()
		}
	}

	Webhook.getWebhook = async function (webhookId) {
		try {
			return await this.findOne({ where: { id: webhookId } })
		} catch (error) {
			throw new DataBaseError()
		}
	}

	Webhook.createWebhook = async function (userId, url, token) {
		try {
			const webhook = await this.findOne({ where: { UserID: userId } })
			if (webhook) throw new WebhookAlreadySetError()
			const newWebhook = await this.create({ url, token, UserId: userId })
			return await this.findOne({ where: { id: newWebhook.id }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
		} catch (error) {
			if (error instanceof WebhookAlreadySetError) throw new WebhookAlreadySetError()
			throw new DataBaseError()
		}
	}

	Webhook.deleteWebhook = async function (webhookId) {
		try {
			await this.destroy({ where: { id: webhookId } })
		} catch (error) {
			throw new DataBaseError()
		}
	}

	Webhook.getAll = async function (webhookId) {
		try {
			return await this.findAll()
		} catch (error) {
			throw new DataBaseError()
		}
	}

	return Webhook
}
