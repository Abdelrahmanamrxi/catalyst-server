const jwt=require('jsonwebtoken')
const {createError}=require('./errors')

const AuthUser= async(req,res,next)=>{

    const authHeader=req.headers.authorization
    const token=req.cookies.token
    if(authHeader){
      const token_storage=authHeader.split(' ')[1]
      jwt.verify(token_storage,process.env.JWT_SECRET,(err,user)=>{
        if(err){
          return next(createError("Couldn't Authenticate User"),403)
        }
      
        req.user=user
        if(user.role!=='admin' && req.path.startsWith('/api/dashboard')){
          return res.status(403).json({msg:'Access Denied UNAUTHORIZED'})
        }
        next()
      })
    }
    else if(token){
      jwt.verify(token,process.env.JWT_SECRET,(err,admin)=>{
        if(err){
          return next(createError("ACCESS DENIED"),403)
        }
        else{
          req.admin=admin
          next()
        }
      })
    }
    else{
      res.status(401).json({msg:"UNAUTHORIZED"})
    }
  
  }
  module.exports=AuthUser