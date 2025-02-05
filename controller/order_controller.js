
require('dotenv').config()
const {createError}=require('./errors')
const {Order}=require('../model/model')
const nodemailer=require('nodemailer')

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.PASS_USER
    }
})
const Checkout=async(req,res,next)=>{
    try {
        const { email, phone, address, payment_type, payment, state, apartment, country, Total_Price, items, userId, first_name, last_name ,size,category} = req.body;
        const { card_number, expiration_date, security_code } = payment;
      if(!email&&!address&&!state&&!payment_type&&!phone){
        return next(createError('Please fill in the whole required fields.'))
      }
        // Validation checks
        if (!email) {
            return next(createError('Please provide your email credentials.'), 422);
        }
        if (!address || !state) {
            return next(createError('Please provide your address or governorate you currently settle in.'), 422);
        }
        if (!payment_type) {
            return next(createError("Choose a Payment Type"), 422);
        }
        if (!phone) {
            return next(createError("Provide your contact information."), 422);
        }
        if (payment_type === "credit" && (!card_number || !expiration_date || !security_code)) {
            return next(createError('Please provide Payment Information'), 422);
        }
    
        
        const newOrder = await new Order({
            userId,
            first_name,
            last_name,
            email,
            phone,
            address,
            state,
            apartment,
            country,
            Total_Price,
            
            items: items.map((item) => {
                return {
                    productId: item.productId, 
                    quantity: item.quantity,
                    price: item.price,
                    size:items.size
                };
            }),
            payment: payment_type === "credit" ? {
                payment_type,
                card_number,
                security_code,
                expiration_date
            } : payment_type,
        });
       
    
      console.log(newOrder)
        const {TimeOfPurchase,_id} = await newOrder.save();
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Your Order has been placed succesfully",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2 style="color: #4CAF50;">Order Confirmation</h2>
                <p> Order created at: ${TimeOfPurchase}</p>
                <p>Hi there,</p>
                
                <p>Thank you for shopping with us! We’re happy to let you know that your order has been placed successfully.</p>
                <p><strong>Order ID:</strong> ${_id}</p>
                <p>We’ll notify you when it’s on the way. Here’s a summary of your order:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item) => {
                            return `
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${item.price} EGP</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <p style="font-weight: bold;">Total: $${Total_Price.toFixed(2)}</p>
                <p>We hope you enjoy your purchase! Feel free to reach out with any questions.</p>
                <p>Best, <br>Catalyst</p>
            </div>
        `
        }
        console.log('Preparing..')
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                console.log(err)
                return next(createError('Error Sending Confirmation Email'),500)
            }
            else{
                console.log(info.response)
            }
        })
        res.status(201).json({ message: "Your order has been created successfully." });
    } catch (err) {
        console.log(err)
        return next(createError('An unexpected error happened'), 500);
    }
}
module.exports={Checkout}