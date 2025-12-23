import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineuser: null,
  },
  reducers: {
    setsocket: (state, action) => {
      state.socket = action.payload;
    },
    setonlineuser: (state, action) => {
      state.onlineuser = action.payload;
    },
  },
});

export const { setsocket, setonlineuser } = socketSlice.actions;
export default socketSlice.reducer;
