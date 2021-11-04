import bcrypt from 'bcrypt'
import { DataBaseError, WrongCredentialsError, UsernameIsTakenError, NoResourceIdError, WrongRefreshTokenError } from '../errors/index.js'
import { PERMISSION_LEVEL } from '../utils/constants.js'

/**
 * Represents a User model
 *
 * @param {object} sequelize - The created sequelize instance.
 * @param {object} DataTypes - Diffrent datatypes for sequelize.
 * @returns {object} - Returns the User model
 */
export default (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				args: true,
				msg: 'Username is already taken, please choose another name.'
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		refreshToken: {
			type: DataTypes.STRING
		},
		permissonsLevel: {
			type: DataTypes.STRING,
			defaultValue: PERMISSION_LEVEL.USER
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

	User.getUser = async function (userId) {
		const user = await checkMovieReviewIdExistAndReturn(userId)
		return user
	}

	User.authenticate = async function (username, password) {
		const user = await this.findOne({ where: { username: username } })
		if (!user || !await bcrypt.compare(password, user.password)) throw new WrongCredentialsError()
		return user
	}

	User.storeRefreshToken = async function (userId, refreshToken) {
		const user = await this.findByPk(userId)
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
		user.refreshToken = hashedRefreshToken
		user.save()
	}

	User.authenticateRefreshToken = async function (userId, refreshToken) {
		const user = await this.findByPk(userId)
		if (!user || !await bcrypt.compare(refreshToken, user.refreshToken)) throw new WrongRefreshTokenError()
		return user
	}

	User.register = async function (username, password) {
		try {
			const existingUser = await this.findOne({ where: { username: username } })
			if (existingUser) throw new UsernameIsTakenError()
			const hashedPassword = await bcrypt.hash(password, 10)
			await this.create({ username: username, password: hashedPassword })
		} catch (error) {
			if (error instanceof UsernameIsTakenError) throw new UsernameIsTakenError()
			throw new DataBaseError()
		}
	}

	const checkMovieReviewIdExistAndReturn = async userId => {
		const existingUser = await User.findByPk(userId)
		if (!existingUser) throw new NoResourceIdError()
		return existingUser
	}

	return User
}
