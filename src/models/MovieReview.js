import { Sequelize } from '../config/sequelize.js'
import { NotUniqueError, UnAuthorizedError, DataBaseError, NoResourceIdError } from '../errors/index.js'

/**
 *  Represents a MovieReview model
 *
 * @param {object} sequelize - The created sequelize instance.
 * @param {object} DataTypes - Diffrent datatypes for sequelize.
 * @returns {object} - Returns the MovieReview model
 */
export default (sequelize, DataTypes) => {
	const MovieReview = sequelize.define('MovieReview', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		rating: {
			type: DataTypes.INTEGER,
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

	MovieReview.checkIfAuthorized = async function (userId, movieReviewId) {
		try {
			const movieReview = await this.findByPk(movieReviewId)
			if (movieReview.UserId !== userId) throw new UnAuthorizedError()
			return true
		} catch (error) {
			if (error instanceof UnAuthorizedError) throw new UnAuthorizedError()
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(movieReviewId)
			throw new DataBaseError()
		}
	}

	MovieReview.getMovieReviews = async function (movieId, pageSize, pageStartIndex, rating) {
		try {
			const options = {
				limit: parseInt(pageSize),
				offset: parseInt(pageStartIndex),
				where: { MovieId: movieId }
			}

			if (rating) options.where.rating = rating
			console.log(options)

			return await this.findAndCountAll(options)
		} catch (error) {
			throw new DataBaseError()
		}
	}

	MovieReview.getMovieReview = async function (movieReviewId) {
		try {
			const movieReview = await checkMovieReviewIdExistAndReturn(movieReviewId)
			return movieReview
		} catch (error) {
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(movieReviewId)
			throw new DataBaseError()
		}
	}

	MovieReview.createMovieReview = async function (userId, movieId, { title, description, rating }) {
		try {
			const newMovieReview = await this.create({ title, description, rating, UserId: userId, MovieId: movieId })
			const movieReview = await this.findOne({ where: { id: newMovieReview.id }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
			return movieReview
		} catch (error) {
			if (error instanceof Sequelize.UniqueConstraintError) throw new NotUniqueError(Object.keys(error.fields).toString())
			throw new DataBaseError()
		}
	}

	MovieReview.updateMovieReview = async function (movieReviewId, { title, description, rating }) {
		try {
			await checkMovieReviewIdExistAndReturn(movieReviewId)
			const update = {}
			if (title) update.title = title
			if (description) update.description = description
			if (rating) update.rating = rating

			const updateMovieReview = await this.update(update, { where: { id: movieReviewId } })
			return updateMovieReview
		} catch (error) {
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(movieReviewId)
			if (error instanceof Sequelize.UniqueConstraintError) throw new NotUniqueError(Object.keys(error.fields).toString())
			throw new DataBaseError()
		}
	}

	MovieReview.deleteMovieReview = async function (movieReviewId) {
		try {
			await this.destroy({ where: { id: movieReviewId } })
		} catch (error) {
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(movieReviewId)
			throw new DataBaseError()
		}
	}

	const checkMovieReviewIdExistAndReturn = async movieReviewId => {
		const existingMovie = await MovieReview.findByPk(movieReviewId)
		if (!existingMovie) throw new NoResourceIdError()
		return existingMovie
	}
	return MovieReview
}
