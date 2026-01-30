import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/Auth.routes.js";
import userRouter from "./routes/User.routes.js";
import postRouter from "./routes/Post.routes.js";

import loopRouter from "./routes/Loop.routes.js";
import storyRouter from "./routes/Story.routes.js";
import messageRouter from "./routes/Message.routes.js";
import { app, server } from "./Socket.js";

dotenv.config();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://purge-hub.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

// app.get('/', (req, res) => {
//     res.send("hello")
// })
connectDb() // .then and .catch run function after promise accept or reject
  .then(() => {
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
