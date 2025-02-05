class CustomError extends Error {
  constructor(message,statusCode){
    super(message)
    this.statusCode=statusCode
  }
    
}
const createError=(msg,status)=>{
    return new CustomError(msg,status)
}
module.exports={CustomError,createError}