import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setprevuserchat } from "../redux/MessageSlice";

function Getallpreviouschatuser() {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/message/getprevchat`,
          { withCredentials: true }
        );
        dispatch(setprevuserchat(response.data));
        //console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchuser();
  }, [messages]);
}

export default Getallpreviouschatuser;
