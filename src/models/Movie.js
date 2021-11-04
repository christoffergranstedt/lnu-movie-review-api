import { User, Sequelize } from '../config/sequelize.js'
import { PERMISSION_LEVEL } from '../utils/constants.js'
import { NotUniqueError, UnAuthorizedError, DataBaseError, NoResourceIdError } from '../errors/index.js'

/**
 * Represents a movie model
 *
 * @param {object} sequelize - The created sequelize instance.
 * @param {object} DataTypes - Diffrent datatypes for sequelize.
 * @returns {object} - Returns the Movie model
 */
export default (sequelize, DataTypes) => {
	const Movie = sequelize.define('Movie', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		year: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: false
		},
		imageCoverLink: {
			field: 'image-cover-link',
			unique: true,
			type: DataTypes.STRING
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

	/**
	 * Check if a user is authorized for changing an resource. Admin permisson level is required.
	 *
	 * @param {object} userId - The user id.
	 * @returns {boolean} - Returns true or false
	 */
	Movie.checkIfAuthorized = async function (userId) {
		try {
			const user = await User.findByPk(userId)
			if (user.permissonsLevel !== PERMISSION_LEVEL.ADMIN) throw new UnAuthorizedError()
			return true
		} catch (error) {
			if (error instanceof UnAuthorizedError) throw new UnAuthorizedError()
			throw new DataBaseError()
		}
	}

	/**
	 * Gets all movies from the database, possible to paginate
	 *
	 * @param {object} pageSize - Number of records asked for by the user
	 * @param {object} pageStartIndex - Number of records asked for by the user
	 * @returns {object} - Returns the requested movies
	 */
	Movie.getMovies = async function (pageSize, pageStartIndex, year) {
		try {
			const options = {
				limit: parseInt(pageSize),
				offset: parseInt(pageStartIndex),
				where: {}
			}

			if (year) options.where.year = year

			const movies = await Movie.findAndCountAll(options)

			return movies
		} catch (error) {
			throw new DataBaseError()
		}
	}

	/**
	 * Gets a specific movie from the database
	 *
	 * @param {object} movieId - The id of the movie
	 * @returns {object} - Returns the requested movie
	 */
	Movie.getMovie = async function (movieId) {
		try {
			const movie = await checkMovieIdExistAndReturn(movieId)
			return movie
		} catch (error) {
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(movieId)
			throw new DataBaseError()
		}
	}

	/**
	 * Create a movie in the database
	 *
	 * @param {object} attributes - The attributes for the movie (name, year, imageCoverLink)
	 * @returns {object} - Returns the created movie
	 */
	Movie.createMovie = async function ({ name, year, imageCoverLink }) {
		try {
			const newMovie = await this.create({ name, year, imageCoverLink })
			const movie = await this.findOne({ where: { id: newMovie.id }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
			return movie
		} catch (error) {
			if (error instanceof Sequelize.UniqueConstraintError) throw new NotUniqueError(Object.keys(error.fields).toString())
			throw new DataBaseError()
		}
	}

	/**
	 * Update a specific movie in the database
	 *
	 * @param {object} movieId - The id of the movie
	 * @param {object} attributes - The attributes for the movie (name, year, imageCoverLink)
	 * @returns {object} - Returns the updated movie
	 */
	Movie.updateMovie = async function (movieId, { name, year, imageCoverLink }) {
		try {
			await checkMovieIdExistAndReturn(movieId)
			const update = {}
			if (name) update.name = name
			if (year) update.year = year
			if (imageCoverLink) update.imageCoverLink = imageCoverLink

			const updateMovie = await this.update(update, { where: { id: movieId } })
			return updateMovie
		} catch (error) {
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(movieId)
			if (error instanceof Sequelize.UniqueConstraintError) throw new NotUniqueError(Object.keys(error.fields).toString())
			throw new DataBaseError()
		}
	}

	/**
	 * Delete a specific movie in the database
	 *
	 * @param {object} movieId - The id of the movie
	 * @returns {object} - Returns the updated movie
	 */
	Movie.deleteMovie = async function (movieId) {
		try {
			await checkMovieIdExistAndReturn(movieId)
			await this.destroy({ where: { id: movieId } })
		} catch (error) {
			if (error instanceof NoResourceIdError) throw new NoResourceIdError(movieId)
			throw new DataBaseError()
		}
	}

	/**
	 * Check if a movie exist in the database
	 *
	 * @param {object} movieId - The id of the movie
	 * @returns {object} - Returns the updated movie
	 */
	const checkMovieIdExistAndReturn = async movieId => {
		const existingMovie = await Movie.findByPk(movieId)
		if (!existingMovie) throw new NoResourceIdError()
		return existingMovie
	}
	return Movie
}
