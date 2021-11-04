/* eslint-disable import/first */
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import { NotFoundError } from './errors/index.js'
import { CustomError } from './errors/CustomError.js'
import { router as routes } from './routes/routes.js'
import { apiRateLimiter } from './middlewares/rateLimiter.js'
import { connectToSequelize } from './config/sequelize.js'
const { PORT } = process.env

const app = express()
app.use(express.json())
app.use(logger('dev'))

app.use(cors())

// A simple rate limiter that only limit the number of requests from a IP-adress
app.use(apiRateLimiter)

// Instansiate helmet package for extra security layer.
app.use(helmet())

// TODO, update methods and allowed headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, OPTIONS')
	next()
})

// Different routes
app.use('/', routes)

// Handle all request methods and routes that are not supported and return a NotFoundError
app.all('*', async (req, res, next) => {
	next(new NotFoundError())
})

// Handle all errors on the server
app.use((err, req, res, next) => {
	if (err instanceof CustomError) {
		return res.status(err.getStatusCode()).send({ errors: err.getErrors() })
	}

	res.status(500).send({
		errors: [{ message: 'Something went wrong in the server, please try again' }]
	})
})

// Start the server and database
const connectToDbAndServer = async () => {
	try {
		await app.listen(PORT, async () => {
			await connectToSequelize()

			console.log(`Server running on port ${PORT}`)
		})
	} catch (error) {
		console.log('Something went wrong when connecting to database or server')
	}
}

connectToDbAndServer()
