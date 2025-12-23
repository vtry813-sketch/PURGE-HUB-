import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setfollowing, setuserData } from "../redux/UserSlice";

function Getcurrentuser() {
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setuserData(response.data));

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchuser();
  }, [storyData]);
}

export default Getcurrentuser;
