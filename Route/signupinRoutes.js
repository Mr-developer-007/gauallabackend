import express from "express";
import {userController} from "../controller/all/userSignupin.js";
const routes= express.Router();

routes.post("/signup",userController.SignupUser)
routes.post("/login",userController.LoginUser)


export default routes;