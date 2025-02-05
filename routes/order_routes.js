const express=require('express')
const router=express.Router()
const{Checkout}=require('../controller/order_controller')
const {AuthUser}=require('../controller/auth')
router.route('/').post(Checkout)
module.exports=router