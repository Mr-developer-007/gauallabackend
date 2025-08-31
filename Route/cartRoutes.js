import express from "express";
import { AddtoCart } from "../controller/user/CartController.js";
import { userMiddleware } from "../middlewere/userMiddlewere.js";
const route = express.Router();


route.post("/addtocart",userMiddleware,AddtoCart)


export default route;