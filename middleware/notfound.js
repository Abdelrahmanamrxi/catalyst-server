const notFound=(req,res)=>{
    res.status(404).json({msg:'404 Request Not Found'})
}
module.exports=notFound