import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  getAllMessages,
  getPrevUserChats,
  sendMessage,
} from "../controllers/Message.controllers.js";
import isAuth from "../middlewares/IsAuth.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiverId",
  isAuth,
  upload.single("image"),
  sendMessage
);
messageRouter.get("/get/:receiverId", isAuth, getAllMessages);
messageRouter.get("/getprevchat", isAuth, getPrevUserChats);

export default messageRouter;
