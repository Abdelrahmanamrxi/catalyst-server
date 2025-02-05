const express=require('express')
const cors=require('cors')
require('dotenv').config()
const mongoose=require('mongoose')
const path=require('path')
const products=require('./routes/product_routes')
const ErrorHandler=require('./middleware/error_middleware')
const notFound=require('./middleware/notfound')
const connectDB=require('./db/connect')
const users=require('./routes/user_routes')
const orders=require('./routes/order_routes')
const cart=require('./routes/cart_routes')
const dashboard=require('./routes/dashboard_routes')
const CookieParser=require('cookie-parser')

const app=express()
const port=process.env.PORT || 5000

app.use(express.json())
app.use(CookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials:true
}))

app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/api/products',products)
app.use('/api/users',users)
app.use('/api/orders',orders)
app.use('/api/cart',cart)
app.use('/api/dashboard',dashboard)




app.use('*',notFound)
app.use(ErrorHandler)

async function StartServer(){
    try{
        await connectDB(process.env.MONGOURI)
        console.log('Connected to DB')
        app.listen(port,()=>{
        console.log(`Server is Listening on Port ${port}`)
     })
    }
    catch(err){
        console.log(err)
    }
}
StartServer()