const {createError}=require('./errors')
const {Cart}=require('../model/model')

const AddToCart=async(req,res,next)=>{
const{productId,userId,size,price,quantity}=req.body

try{
  let cart=await Cart.findOne({userId}).populate({
    path:'items.productId',
    select:'title image'
  })
  if(!cart){
    cart=new Cart({userId,items:[]})
  }

  let existingProduct=cart.items.find(items=>items.productId._id.toString()===productId&&items.size===size)
  if(existingProduct){
    existingProduct.quantity+=quantity
  }
  else{
    const newItem = {
      productId,
      quantity,
      size,
      price
  };
    cart.items.push(newItem)
   
  }
  await cart.save()
  await cart.populate({
    path: 'items.productId',
    select: 'title image'
});
existingProduct = cart.items.find(
  item => item.productId._id.toString() === productId && item.size === size
);
const updatedItem = {
  productId: existingProduct.productId._id,
  title: existingProduct.productId.title,
  image: existingProduct.productId.image,
  quantity: existingProduct.quantity,
  size: existingProduct.size,
  price: existingProduct.price,
  category:existingProduct.productId.category
};

  res.status(201).json(updatedItem)

}
catch(err){
 console.log(err)
 return next(createError('Error while Adding Items into Cart'),500)
}

}
const DeleteItem = async (req, res, next) => {
  const { userId, productId, size } = req.body;

  try {
    let cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'title image'
    });

    if (!cart) {
      return next(createError(404, "Couldn't find Cart"));
    }

    const existingProductIndex = cart.items.findIndex(
      product => product.productId._id.toString() === productId && product.size === size
    );

    if (existingProductIndex === -1) {
      return next(createError(404, 'No items match your criteria.'));
    }

    
    const existingProduct = cart.items[existingProductIndex];

    if (existingProduct.quantity <= 1) {
    
      cart.items.splice(existingProductIndex, 1);
      await cart.save();
      return res.status(204).send(); 
      existingProduct.quantity -= 1;
    }

    await cart.save();

    const updatedItem = {
      productId: existingProduct.productId._id,
      title: existingProduct.productId.title,
      image: existingProduct.productId.image,
      quantity: existingProduct.quantity,
      size: existingProduct.size,
      price: existingProduct.price,
      category: existingProduct.productId.category
    };

    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err.message || err);
    return next(createError(500, "Error while Removing from Cart"));
  }
};

const UpdateCart=async(req,res,next)=>{
    const{userId,productId,size}=req.body
    try{
        let cart=await Cart.findOne({userId})
        if(!cart){
            return next(createError("Couldn't find Cart.",404))
        }
       
        const existingProduct=cart.items.find(product=>product.productId._id.toString()===productId&&product.size===size)
        if(!existingProduct){
        return next(createError("Couldn't find item."),404)
        }
        else{
            existingProduct.quantity+=1
        }
        await cart.save()
        await cart.populate({
          path: 'items.productId',
          select: 'title image'
      });
      const updatedItem = {
        productId: existingProduct.productId._id,
        title: existingProduct.productId.title,
        image: existingProduct.productId.image,
        quantity: existingProduct.quantity,
        size: existingProduct.size,
        price: existingProduct.price,
        category:existingProduct.productId.category
    };

        res.status(201).json(updatedItem)
    }
    catch(err){
        console.log(err)
        return next(createError('Error while updating Cart'),500)
    }
}
const GetCart=async(req,res,next)=>{
  const{userId}=req.query
  if(!userId){
    return res.json([])
  }
  try{
   
  let cart=await Cart.findOne({userId}).populate({
    path:'items.productId',
    select:'title image'
  })
  if(!cart){
    res.json([])
  }
  const formattedCart = cart.items.map(item => ({
    productId: item.productId._id,
    title: item.productId.title,
    image: item.productId.image,
    quantity: item.quantity,
    size: item.size,
    price: item.price,
    category:item.productId.category
  }));
  res.status(201).json(formattedCart)
}
catch(err){
  return next(createError("Internal Server Error while finding the Cart"),404)
}
}

module.exports={AddToCart,DeleteItem,UpdateCart,GetCart}