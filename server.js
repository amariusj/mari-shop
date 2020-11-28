require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')

//Calls express
const app = express()

//Parses responses into JSON
app.use(express.json())

//Paeses cookies from the client
app.use(cookieParser());

//Allow cross browser HTTP requests
app.use(cors());

//Creates a tempory folder when uploading files
app.use(fileUpload({
    useTempFiles: true
}))

//Writes log requests
app.use(morgan('dev'))

//Connect to mongodb

//Grabs the mongodb connection URL
const URI = process.env.MONGODB_URL

//Attemps to connect with mongodb
mongoose.connect(`${URI}`, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB')
})

//Requires the routes
const userRoute = require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute')
const upload = require('./routes/upload')
const productRouter = require('./routes/productRoute')
const paymentRouter = require('./routes/paymentRouter')


//Requires the routes
app.use('/users', userRoute)
app.use('/api', categoryRoute)
app.use('/api', upload)
app.use('/api', productRouter)
app.use('/api', paymentRouter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

//Sets the port and starts server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})