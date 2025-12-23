import express from "express";
import isAuth from "../middlewares/IsAuth.js";

import { upload } from "../middlewares/multer.js";
import {  deletestory, getallstory, getstorybyusername, uploadstory, Viewstory } from "../controllers/Story.controller.js";



const storyRouter = express.Router()
storyRouter.post("/upload", isAuth, upload.single("media"),uploadstory)
storyRouter.get('/getbyusername/:username', isAuth,getstorybyusername )
storyRouter.get('/view/:storyId', isAuth, Viewstory)
storyRouter.delete('/remove/:storyId', isAuth, deletestory)
storyRouter.get('/getall',isAuth,getallstory)


export default storyRouter;