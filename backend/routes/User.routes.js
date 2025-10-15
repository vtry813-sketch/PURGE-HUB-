import express from "express";
import isAuth from "../middlewares/IsAuth.js";
import { getCurrentUser } from "../controllers/User.controllers.js";

const userRouter = express.Router()
userRouter.get("/current",isAuth,getCurrentUser)

export default userRouter;