import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setfollowing } from "../redux/UserSlice";

function Getallfollowing() {
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);
  useEffect(() => {
    const fetchfollowing = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/user/followinglist`,
          { withCredentials: true }
        );
        dispatch(setfollowing(response.data));
        //console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchfollowing();
  }, [storyData]);
}

export default Getallfollowing;
