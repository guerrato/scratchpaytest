import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from './routes/index'
import { setupSwagger } from './swaggerConfig'

const app = express()

// Add the Swagger setup function
setupSwagger(app)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, './public')))

// Routes
app.use('/', indexRouter)

export default app
module.exports = app
