const {CustomError}=require('../controller/errors')
const ErrorHandler=(err,req,res,next)=>{
    if(err instanceof CustomError){
     res.status(err.statusCode||500).json({msg:err.message,status:err.statusCode})
    }
    else{
        res.status(500).json({msg:'Internal Server Error'})
    }
}
module.exports=ErrorHandler