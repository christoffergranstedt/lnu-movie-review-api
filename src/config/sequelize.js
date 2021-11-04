import sequelizePackage from 'sequelize'
import UserModel from '../models/User.js'
import MovieMovel from '../models/Movie.js'
import MovieReviewModel from '../models/MovieReview.js'
import WebhookModel from '../models/Webhook.js'
import fs from 'fs'

export let Sequelize = null
export let sequelize = null
export let User = null
export let Movie = null
export let MovieReview = null
export let Webhook = null

/**
 * Initializes the database connection with Sequelize and setting up the relationship with the models.
 */
export const connectToSequelize = async () => {
	try {
		Sequelize = sequelizePackage.Sequelize
		const DataTypes = sequelizePackage.DataTypes
		const { DB_DEV_SCHEMA, DB_DEV_USER, DB_DEV_PASSWORD, DATABASE_URL, NODE_ENV } = process.env
		if (NODE_ENV === 'development') {
			sequelize = new Sequelize(DB_DEV_SCHEMA, DB_DEV_USER, DB_DEV_PASSWORD, {
				dialect: 'mysql',
				host: 'localhost'
			})
		} else {
			sequelize = new Sequelize(DATABASE_URL, {
				dialect: 'mysql',
				protocol: 'mysql'
			})
		}

		User = UserModel(sequelize, DataTypes)
		Movie = MovieMovel(sequelize, DataTypes)
		MovieReview = MovieReviewModel(sequelize, DataTypes)
		Webhook = WebhookModel(sequelize, DataTypes)

		User.hasMany(MovieReview)
		Movie.hasMany(MovieReview)
		MovieReview.belongsTo(User)
		MovieReview.belongsTo(Movie)

		User.hasOne(Webhook)
		Webhook.belongsTo(User)

		await sequelize.sync()
		await populateDatabase()
	} catch (error) {
		console.log(error)
	}
}

/**
 * Populates the database the first time.
 */
export const populateDatabase = async () => {
	try {
		const usersExist = await User.findAll()
		if (usersExist.length === 0) {
			const usersString = fs.readFileSync('./src/config/data/users.json')
			const moviesString = fs.readFileSync('./src/config/data/movies.json')
			const movieReviewsString = fs.readFileSync('./src/config/data/movie-reviews.json')

			const users = JSON.parse(usersString)
			for (let i = 0; i < users.length; i++) {
				await User.register(users[i].username, users[i].password)
			}
			await User.update({ permissonsLevel: 'ADMIN' }, { where: { username: 'admin' } })

			await Movie.bulkCreate(JSON.parse(moviesString.toString()))
			await MovieReview.bulkCreate(JSON.parse(movieReviewsString.toString()))
		}
	} catch (error) {
		console.log(error)
	}
}
