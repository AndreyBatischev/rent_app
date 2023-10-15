import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'

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

app.use('/api/user',  userRoute)
app.use('/api/auth',  authRoute)

