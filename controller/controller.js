const mongoose=require('mongoose')
const {Product,User}=require('../model/model')
const {createError}=require('./errors')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const bcrypt=require('bcrypt')
 const fixImagePath = (path) => path.replace(/\\/g, '/');


const getProducts=async(req,res)=>{
  const {search,filters}=req.query
  const query_object={}
  
    try{
      const limit=parseInt(req.query.limit)||6
      let page=parseInt(req.query.page)||1
      if(page<1)
        page=1
      if(search){
        const sanitizedSearch =search.trim().split(/[%20.,?'!=]/).join('.*');
        query_object.title={$regex:sanitizedSearch,$options:'i'}
      }
      if(filters){
        query_object.category={$in:filters.split(',')}
      }
      const totalCount=await Product.countDocuments(query_object)
      const totalPages=Math.ceil(totalCount/limit)
      if(page>totalPages){
        page=totalPages
      }
      const skip=page>0?(page-1)*limit:0
     const products=await Product.find(query_object).limit(limit).skip(skip)
     const getProducts=products.map((product)=>{
      return {...product._doc,image:fixImagePath(product.image)}
     })
     if(getProducts.length===0){
     return res.status(200).json({getProducts:[]})
     }
      
      res.status(200).json({
      getProducts,
      totalCount,
      totalPages:Math.ceil(totalCount/limit),
      current_page:page
    })
    }
    catch(err){
      
       res.status(500).json({msg:"Error Fetching Products"})
    
    }
}

const getProduct=async(req,res,next)=>{
  const {id}=req.params
  try{
    const getProduct=await Product.findById(id)
    res.status(200).json({getProduct})
  }
  catch(err){
  return next(createError('Couldnt find Product matching your criteria',400))
  }
}
const createUser=async(req,res,next)=>{
  const{email,password}=req.body

 
  try{
    const user=await User.findOne({email})
    if(user){
      return next(createError('Email Already Exists'))
    }
    else{
    if(password.length<7){
      return res.status(401).json({msg:'Password must be longer than 7 characters.'})
    }
    const hashed_password=await bcrypt.hash(password,10)
    const new_user=new User({email:email,password:hashed_password})
    await new_user.save()
    const token=jwt.sign({userId:new_user._id,role:'user'},process.env.JWT_SECRET,{expiresIn:'24h'})

     return res.status(200).json({msg:'You have succesfully created your account',token})
  }
  }
  catch(err){
    return next(createError("Couldn't Sign Up",500))
  }

}
const login = async (req, res, next) => {

  const { email, password } = req.body; 

  try {
    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).json({ msg: "Couldn't find user matching your criteria" });
    }
    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials Provided." });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ msg: "You have successfully logged in", token }); 
  } catch (err) {
    console.error(err);
    return next(createError("Couldn't Log In", 500)); 
  }
};

const getProfile=async(req,res,next)=>{
  try{
    const userId=req.user.userId
    const user=await User.findOne({_id:userId})
    res.status(201).json({msg:'Access Granted',user})
  }
  catch(err){
    next(createError('Error Getting Profile Information'),500)
  }
}

const updatePassword=async(req,res,next)=>{
  const{email,current_password,new_password}=req.body;
  try{
  const user=await User.findOne({email:email})
if(!current_password||!email){
  return res.status(400).json({msg:"Please Enter your Credentials"})
}

  if(!user){
    return res.status(400).json({msg:"Couldn't find User Matching your Criteria"})
  }
    const isMatch=await bcrypt.compare(current_password,user.password)
   
    if(!isMatch){
      return res.status(403).json({msg:"Your Current Password is Incorrect."})
    }
    if(new_password.length<7||!new_password){
      return res.status(403).json({msg:"Password must be longer than 7 characters."})
    }
   user.password=await bcrypt.hash(new_password,10)
   user.passwordUpdatedCount=user.passwordUpdatedCount+1

   if(user.passwordUpdatedCount>3){
    return res.status(403).json({msg:"You can change your password only 3 times."})
   }
   
   await user.save();
   res.status(200).json({msg:"Password Updated Succesfully."})
  }
  catch(err){
    return next(createError('Error Updating Password'),403)
  }
  
}
module.exports={getProducts,getProduct,createUser,login,getProfile,updatePassword}