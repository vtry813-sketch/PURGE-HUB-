import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: null,  
    storyList:[],
  },
  reducers: {
    setstoryData: (state, action) => {
      state.storyData = action.payload; 
    },
    removestory: (state) => {
      state.storyData = null;  
    },
    setstorylist: (state, action) => {
     state.storyList=action.payload
   }
  }
});

export const { setstoryData, removestory ,setstorylist} = storySlice.actions;
export default storySlice.reducer;
