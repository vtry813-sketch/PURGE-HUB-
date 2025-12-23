import { createSlice } from "@reduxjs/toolkit";

const MessageSlice = createSlice({
  name: "message",
  initialState: {
    selecteduser: null,
    messages: [],
    prevuserchat: null,
  },
  reducers: {
    setselecteduser: (state, action) => {
      state.selecteduser = action.payload;
    },
    setmessages: (state, action) => {
      state.messages = action.payload;
    },
    setprevuserchat: (state, action) => {
      state.prevuser = action.payload;
    },
  },
});

export const { setselecteduser, setmessages, setprevuserchat } =
  MessageSlice.actions;
export default MessageSlice.reducer;
