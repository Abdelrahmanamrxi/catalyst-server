const mongoose=require('mongoose')
const product=mongoose.Schema({
    id:String,
    title:String,
    price:Number,
    description:String,
    category:String,
    image:String,
    rating:{
        rate:String,
        count:Number
    }
    ,discount:String
    ,quantity:Number
})
const cart=mongoose.Schema({
userId:{
type:mongoose.Schema.Types.ObjectId,
ref:'User',
requied:true

},
items:[{
productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true
}
,quantity:{
    type:Number,
    required:true,
    min:1
},
size:{
    type:String,
},price:{
    type:Number,
    required:true
}

}

]})

const user=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true,
        minlength:7
    },
    passwordUpdatedCount:{
        type:Number,
        default:0,
        max:3
    }
    ,updatedAt: { type: Date } 
})
const order=mongoose.Schema({
    email: { 
        type: String,
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       
    },
    phone:{
        type:String,
        required:true
    },
    state:{
        type:String,
        enum:[
            "Cairo", "Alexandria", "Giza", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
            "Gharbia", "Ismailia", "Monufia", "Minya", "Qaliubiya", "New Valley", 
            "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", 
            "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", 
            "Sohag"],
            required:true

    },
    country:{type:String,enum:['Egypt'],default:"Egypt"},
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    address:{
        type:String,
        required:true
    },
    items:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true

        }
    ,quantity:{
        required:true,
        type:Number,
        min:1
    },
    price:{
        type:Number,
        required:true
    }
}],
    TimeOfPurchase:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:["active","pending","purchased"],
        default:"active"


    }
    ,payment_type:{
        type:String,
        enum:['COD','credit'],
        default:'COD'
    }
    ,payment:{
        card_number:{
            type:String,
        }
        ,expiration_date:{
            type:String,
        }
        ,
        security_code:{
            type:String
        }
    }
    ,Total_Price:{
        type:Number,
        required:true
    }
   
})

user.pre('save',function(next){
    if(this.isModified('password')){
        this.updatedAt=Date.now();
    }
    next()
})
const Product=mongoose.model('Product',product)
const User=mongoose.model('User',user)
const Order=mongoose.model('Order',order)
const Cart=mongoose.model('Cart',cart)
module.exports={Product,User,Order,Cart}