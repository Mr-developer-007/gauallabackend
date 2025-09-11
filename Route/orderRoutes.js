import express from "express"
import { userMiddleware } from "../middlewere/userMiddlewere.js";
import { createOrder, verifyOrder } from "../controller/user/razerpayController.js";

const route = express.Router();

route.post("/create",userMiddleware,createOrder)
route.post("/verify",userMiddleware,verifyOrder)

export default route