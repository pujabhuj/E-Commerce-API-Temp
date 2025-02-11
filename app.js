require('dotenv').config()
require('express-async-errors') 
//express
const express = require('express')
const app = express() 
//rest packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
//extra security packages
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

//database
const connectDB = require('./db/connect')

//router
//authrouter
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoute')
const orderRouter = require('./routes/orderRoute')


//middleware 
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());


app.use(express.json()) 
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())

app.get('/',(req,res) =>{
    res.send('<h1>E-commerce API</h1>')
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders',orderRouter)

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