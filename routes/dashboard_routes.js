const express=require('express')
const {getUsers, UpdateUser,DeleteUser}=require('../controller/dashboard/dashboard_user')
const {CreateProduct}=require('../controller/dashboard/dashboard_product')
const {getOrder}=require('../controller/dashboard/dashboard_order')
const {AdminLogin,CheckAdmin}=require('../controller/dashboard/dashboard_auth')
const AuthUser=require('../controller/auth')
const router=express.Router()
const multer=require('multer')
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}+'-'+${file.originalname}`);
    }
})
const upload=multer({storage:storage})
router.route('/auth').post(AdminLogin).get(CheckAdmin)
router.route('/users').get(AuthUser,getUsers).patch(AuthUser,UpdateUser).delete(AuthUser,DeleteUser)

router.route('/orders').get(AuthUser,getOrder)
router.route('/products').post(upload.single('image'),AuthUser,CreateProduct)
module.exports=router