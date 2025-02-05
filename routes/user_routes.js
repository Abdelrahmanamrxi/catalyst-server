const express=require('express')
const router=express.Router()
const AuthUser=require('../controller/auth.js')
const {createUser,login,getProfile,updatePassword}=require('../controller/controller.js')
router.route('/').post(createUser)
router.route('/login').post(login)
router.route('/profile').get(AuthUser,getProfile).patch(AuthUser,updatePassword)
module.exports=router