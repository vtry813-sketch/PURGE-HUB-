import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedusers: null,
    profiledata: null,
    following: [],
    searchData: null,
    notificationdata: null,
  },
  reducers: {
    setuserData: (state, action) => {
      state.userData = action.payload;
    },
    setsuggesteduser: (state, action) => {
      state.suggestedusers = action.payload;
    },
    setprofiledata: (state, action) => {
      state.profiledata = action.payload;
    },
    setfollowing: (state, action) => {
      state.following = action.payload;
    },
    togglefollow: (state, action) => {
      const targetuserId = action.payload;
      state.following = state.following || [];
      if (state.following.includes(targetuserId)) {
        state.following = state.following.filter((id) => id != targetuserId);
      } else {
        state.following.push(targetuserId);
      }
    },
    setsearch: (state, action) => {
      state.searchData = action.payload;
    },
    setnotificationdata: (state, action) => {
      state.notificationdata = action.payload;
    },
  },
});

export const {
  setuserData,
  setsuggesteduser,
  setprofiledata,
  setfollowing,
  togglefollow,
  setsearch,
  setnotificationdata,
} = userSlice.actions;
export default userSlice.reducer;
