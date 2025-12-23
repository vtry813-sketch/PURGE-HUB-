import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setstoryData } from "../redux/StorySlice";
import Storypage from "../components/Storypage";

function Story() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);

  const handlestory = async () => {
    dispatch(setstoryData());
    try {
      const response = await axios.get(
        `${serverUrl}/api/story/getbyusername/${username}`,
        { withCredentials: true }
      );
      dispatch(setstoryData(response.data[0]));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (username) {
      handlestory();
    }
  }, [username]);
  return (
    <div className="w-full h-[100vh] bg-black flex justify-center items-center">
      <Storypage storyData={storyData} />
    </div>
  );
}

export default Story;
