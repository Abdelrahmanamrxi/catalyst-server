const {createError} =require('../errors')
const {Product}=require('../../model/model')

const CreateProduct=async(req,res,next)=>{
    const {title,description,category,price,quantity}=req.body
    const image=req.file
    if(!title||!description||!category||!price||!quantity||!image){
        res.status(400).json({message:"Please fill in all fields"})
    }
    else{
    try{
    const newProduct=new Product({
        title,
        description,
        category,     
        price,
        image:image.path,
        quantity})
        await newProduct.save()
        res.status(201).json({message:'Product Created Successfully'})
    }
    catch(err){
        return next(createError(500,'Unexpected Error While Creating Product'))
    }
        
    }
    
   
    

}
module.exports={CreateProduct}