import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'

mongoose.connect(process.env.MONGO_CONNECTION_URL)
    .then(() => {
        console.log('Mongoose connected');
        app.listen(process.env.PORT, () => {
            console.log('server is runing');
            
        })
    })
    .catch(console.error)

const app = express()

 

app.get('/', (req, res) => {
    res.send('hello')
})

// app.listen(PORT , () => {
//     console.log(`Server is running on port ${PORT}`);
// })
