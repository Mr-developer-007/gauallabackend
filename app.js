import express from "express"
import dotenv  from "dotenv";
import cors from "cors"
import CategoryRoute from "./Route/CategoryRouters.js"
import ProductRoute from "./Route/ProductRouters.js"
import BannerRoutes from "./Route/BannerRoutes.js"
import loginSignup from "./Route/signupinRoutes.js"
import cookieParser from "cookie-parser";


dotenv.config()
const app= express()
app.use(
  cors({
    origin: process.env.url, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies
  })
);
app.use(express.json()) 
app.use(cookieParser())
app.use("/uploads", express.static("uploads"));
app.get("/",async(req,res)=>{
  return res.json({ working:true})
})

 


 //admin
app.use("/admin/category",CategoryRoute);
app.use("/admin/product",ProductRoute);
app.use("/admin/banner",BannerRoutes);


//all
app.use("/api/user/category",CategoryRoute)
app.use("/api/user/getproduct",ProductRoute)
app.use("/api/user/banner",BannerRoutes)

app.use("/api/user/",loginSignup)


// users










const PORT = process.env.PORT || 9002;

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})

