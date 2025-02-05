const {createError}=require('../errors')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const admin_email=process.env.ADMIN_EMAIL
const admin_password=process.env.ADMIN_PASSWORD
const AdminLogin=async(req,res,next)=>{
    
    const{email,password}=req.body.admin
   
    try{
    if(!email || !password){
        return next(createError('Enter Email Address & Password to Continue'),400)
    }
    if(email!==admin_email|| password !==admin_password){
        return next(createError('UNAUTHORIZED ACCESS'),401)
    }
    else{
        const token=jwt.sign({role:'admin'},process.env.JWT_SECRET,{expiresIn:'1d'})
        res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
        maxAge:24*60*60*1000
        })
        res.status(201).json({msg:'Welcome Admin',login:true})
    }
}
catch(err){
    console.log(err)
    return next(createError('Error UNAUTHORIZED ACCESS',500))
}
}
const CheckAdmin=(req,res,next)=>{
    const token=req.cookies.token
    let isAdmin=false
    try{
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,admin)=>{
            if(err){
                return res.status(401).json({isAdmin:isAdmin,msg:"UNAUTHORIZED ACCESS"})
            }
            else{
               isAdmin=true
              return res.status(201).json({isAdmin:isAdmin,msg:'Welcome Admin'})

            }
            next()
        })
    }
    else{
        
        return res.status(401).json({isAdmin:isAdmin,msg:'UNAUTHORIZED ACCESS'})
    }
   
}
catch(err){
    console.log(err)
    res.status(401).json({isAdmin:isAdmin,msg:'UNAUTHORIZED ACCESS'})
}

}
module.exports={AdminLogin,CheckAdmin}