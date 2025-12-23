import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setstorylist } from "../redux/StorySlice";

function Getallstories() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchstories = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/story/getall`, {
          withCredentials: true,
        });
        dispatch(setstorylist(response.data));
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchstories();
  }, [userData]);
  return <div></div>;
}

export default Getallstories;
