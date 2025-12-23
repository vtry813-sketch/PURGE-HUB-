import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import Notificationcard from "../components/Notificationcard";
import axios from "axios";
import { serverUrl } from "../App";
function Notification() {
  const navigate = useNavigate();

  const { notificationdata } = useSelector((state) => state.user);

  const ids = notificationdata.map((n) => n?._id);
  const markasread = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/markasread`,
        { notificationId: ids },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    markasread();
  }, []);
  return (
    <div className="w-full h-[100vh] bg-black">
      <div className="p-6 flex items-center gap-3">
        <IoMdArrowRoundBack
          className="h-[30px] w-[30px] text-white cursor-pointer active:scale-95 transition md:hidden"
          onClick={() => navigate("/")}
        />
        <h2 className="text-white text-xl  font-semibold md:text-transparent md:bg-clip-text md:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] ">
          Notifications
        </h2>
      </div>
      <div className="w-full h-[100%] overflow-auto flex flex-col gap-[20px]">
        {notificationdata?.map((noti) => (
          <Notificationcard key={noti._id} noti={noti} />
        ))}
      </div>
    </div>
  );
}

export default Notification;
