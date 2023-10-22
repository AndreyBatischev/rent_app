import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import listingRoute from './routes/listingRoute.js'

mongoose.connect(process.env.MONGO_CONNECTION_URL)
    .then(() => {
        console.log('Mongoose connected');
        app.listen(process.env.PORT, () => {
            console.log('server is runing');

        })
    })
    .catch(console.error)

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/listing', listingRoute)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

