import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { IoImageOutline } from "react-icons/io5";
import { BsSendFill } from "react-icons/bs";
import Sender from "../components/Sender";
import { useState } from "react";
import { useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setmessages } from "../redux/MessageSlice";
import { useEffect } from "react";
import Receiver from "../components/Receiver";
import ClipLoader from "react-spinners/ClipLoader";

function Textarea() {
  const { selecteduser } = useSelector((state) => state.message);
  const { socket } = useSelector((state) => state.socket);
  const navigate = useNavigate();
  const [input, setinput] = useState("");
  const imageinput = useRef();
  const [frontendimage, setfrontendimage] = useState(null);
  const [backendimage, setbackendimage] = useState(null);
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const [viewphoto, setviewphoto] = useState(false);
  const scroll = useRef(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleimage = (e) => {
    const file = e.target.files[0];
    setbackendimage(file);
    setfrontendimage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendimage) {
        formData.append("image", backendimage);
      }
      const response = await axios.post(
        `${serverUrl}/api/message/send/${selecteduser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setmessages([...messages, response.data]));
      setinput("");
      setbackendimage(null);
      setfrontendimage(null);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const getAllMessages = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/message/get/${selecteduser._id}`,
        { withCredentials: true }
      );
      dispatch(setmessages(response.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect(() => {
    console.log(socket);
    socket?.on("newMessage", (mess) => {
      dispatch(setmessages([...messages, mess]));
    });
    return () => socket?.off("newMessage");
  }, [messages, setmessages]);

  return (
    <div className="bg-black h-[100vh] w-full">
      <div className="flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 md:top-0z-[100] bg-black w-full">
        <div className=" md:p-2 flex items-center gap-3">
          <IoMdArrowRoundBack
            className="h-[20px] w-[20px] text-white cursor-pointer active:scale-95 transition"
            onClick={() => {
              if (window.innerWidth >= 1024) {
                navigate("/");
              } else {
                navigate("/message");
              }
            }}
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="w-[40px] h-[40px] rounded-full border border-black cursor-pointer overflow-hidden">
            <img
              onClick={() => setviewphoto(true)}
              src={selecteduser.profileImage || dp}
              className="w-full h-full object-cover"
              alt="user"
            />
          </div>
          <div
            onClick={() => navigate(`/profile/${selecteduser.username}`)}
            className="cursor-pointer"
          >
            <div className=" text-[13px] md:text-[18px]  text-white font-semibold">
              {selecteduser.username}
            </div>
            <div className=" text-[11px] md:text-[13px] text-gray-400">
              {selecteduser.name}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h=[80%] py-[100px] pb-[120px] lg:pb-[150px] px-[20px] flex flex-col gap-[20px] overflow-auto bg-black">
        {messages &&
          messages.map((mess) =>
            mess.sender === userData._id ? (
              <Sender key={mess._id} message={mess} />
            ) : (
              <Receiver key={mess._id} message={mess} />
            )
          )}
        <div ref={scroll}></div>
      </div>

      <div className="w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]">
        <form
          onSubmit={handleSendMessage}
          className="relative w-[90%] max-w-[800px] h-[60%] md:h-[70%] rounded-full bg-gray-200 flex items-center gap-[12px] px-[20px] "
        >
          <input
            type="file"
            accept="image/*"
            ref={imageinput}
            hidden
            onChange={handleimage}
          />
          {frontendimage && (
            <div className=" w-[100px] h-[100px] absolute top-[-120px] right-[20px] rounded-2xl overflow-hidden border">
              <img
                src={frontendimage}
                alt="preview"
                className="w-full h-full object-cover"
              />

              <RxCross2
                onClick={() => {
                  setfrontendimage(null);
                  setbackendimage(null);
                  imageinput.current.value = "";
                }}
                className="
                  absolute top-1 right-1
                  text-white bg-red-500
                  rounded-full p-1
                  cursor-pointer
                  hover:scale-110 transition
                "
                size={20}
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-black placeholder-gray-400 outline-none"
            onChange={(e) => setinput(e.target.value)}
            value={input}
          />

          <div onClick={() => imageinput.current.click()}>
            <IoImageOutline className="text-black w-[25px] h-[25px] cursor-pointer" />
          </div>
          {(input || frontendimage) && (
            <button className="text-white  cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500  px-4 py-2 rounded-full text-sm active:scale-95 transition">
              {loading ? (
                <ClipLoader size={20} color="black" />
              ) : (
                <BsSendFill />
              )}
            </button>
          )}

          {viewphoto && (
            <div
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
              onClick={() => setviewphoto(false)}
            >
              <img
                src={selecteduser?.profileImage}
                className="max-w-[90%] max-h-[90%] rounded-xl object-contain"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Textarea;
