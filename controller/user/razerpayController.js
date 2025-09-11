import Razorpay  from "razorpay";
import crypto from "crypto";
import pool from "../../config.js";

 const razorpay= new  Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
 })


 export const createOrder= async (req,res)=>{
 try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 10000),
    };

    const order = await razorpay.orders.create(options);
    return  res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
 }


 export const verifyOrder=async(req,res)=>{
   try {
const site_user_id= req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      
      address_id,
      cart_items,
      total_amount,
      type
    } = req.body;

    // ✅ Verify Razorpay signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Insert into orders table
    const [orderResult] = await pool.query(
      `INSERT INTO orders (site_user_id, address_id, total_amount, status, payment_status, type)
       VALUES (?, ?, ?, 'processing', 'paid', ?)`,
      [site_user_id, address_id, total_amount, type]
    );

    const orderId = orderResult.insertId;

    // ✅ Insert each cart item into order_items table
    for (const item of cart_items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, start_date)
         VALUES (?, ?, ?, ?, CURDATE())`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    return res.json({ success: true, message: "Payment verified & Order Created", order_id: orderId });
  } catch (error) {
    console.error("❌ Error in verifyOrder:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
 }