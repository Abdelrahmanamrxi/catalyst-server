const {Order}=require('../../model/model')
const {createError}=require('../errors')
const getOrder=async(req,res,next)=>{
    try{
      const limit=req.query.limit || 5
      const page= req.query.page || 1
      const skip=(page-1)*limit
      const totalOrders=await Order.countDocuments()
      const Orders=await Order.find({}).limit(limit).skip(skip)
      if(!Orders){
        res.status(404).json({msg:"Couldn't find Orders Due to Unknown Error"})
      }
      else{
        res.status(200).json({
        Orders,
        totalOrders,
        totalPages:Math.ceil(totalOrders/limit),
        current_page:page

        })
      }


    }
    catch(err){
     
      return next(createError('Error While Trying to Retrieve Order'),404)
    }
    
}
module.exports={getOrder}