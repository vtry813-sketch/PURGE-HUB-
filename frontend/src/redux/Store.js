import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import postSlice from "./PostSlice";
import loopSlice from "./LoopSlice";
import storySlice from "./StorySlice";
import MessageSlice from "./MessageSlice";
import socketSlice from "./SocketSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    loop: loopSlice,
    story: storySlice,
    message: MessageSlice,
    socket: socketSlice,
  },
});

export default store;
