require('dotenv').config()
require('express-async-errors') 
//express
const express = require('express')
const app = express() 
//rest packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
//database
const connectDB = require('./db/connect')

//router
//authrouter
const authRouter = require('./routes/authRoute')


//middleware 
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//middleware used access jason data in req body
app.use(morgan('tiny'))
app.use(express.json()) 
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/',(req,res) =>{
    res.send('<h1>E-commerce API</h1>')
})
app.get('/api/v1',(req,res) =>{
    console.log(req.signedCookies )
    res.send('<h1>E-commerce API</h1>')
}) 

app.use('/api/v1/auth',authRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening on port ${port} ...`))
    } catch (error) { 
        console.log(error)
    }
}
start()  