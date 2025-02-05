const {User}=require('../../model/model')
const {createError}=require('../errors')

const getUsers=async(req,res,next)=>{
try{
const limit=parseInt(req.query.limit)||8
const page=parseInt(req.query.page)||1
const skip=(page-1)*limit
const totalPages=await User.countDocuments()
let user= await User.find({}).limit(limit).skip(skip)
const formatted_users=user.map((user)=>{
    return {
        userId:user._id,
        email:user.email,
        updatedAt:user.updatedAt.toDateString()
    }
})
res.status(200).json({users:formatted_users,totalPages:Math.ceil(totalPages/limit),currentPage:page})

}
catch(err){
    return next(createError('Error trying to retrieve Users'),500)
}
}
const UpdateUser=async(req,res,next)=>{
    const {password,email}=req.body
    try{
    if(!password || password.length<7){
        return next(createError("Please fill in atleast 7 characters for password."))
    }
  
    let user=await User.findOne({email})
    if(!user){
        return res.status(404).json({msg:"Couldn't find specific User"})
    }
    user.passswordUpdatedCount=user.passswordUpdatedCount+1
    await user.save()
    res.status(200).json({msg:'Password Updated Succesfully'})
}
catch(err){
    return next(createError("Unknown Error while Updating Password"),500)
}
}
const DeleteUser=async(req,res,next)=>{
    const {email}=req.query
 try{  
    const user=await User.findOneAndDelete({email})
    if(!user){
        return res.status(404).json({msg:"Couldn't Find Specific User"})
    }
    res.status(200).json({msg:'User has been deleted succesfully.'})
}
    
    catch(err){
        return next(createError("Unexpected Error",500))
    }
}
module.exports={getUsers,UpdateUser,DeleteUser}