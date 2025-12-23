import React, { useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Videoplayer from "../components/Videoplayer";
import axios from "axios";
import { serverUrl } from "../App";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import { setpostData } from "../redux/PostSlice";
import { setstoryData } from "../redux/StorySlice";
import { setloopData } from "../redux/LoopSlice";
import { setuserData } from "../redux/UserSlice";

function Upload() {
  const navigate = useNavigate();
  const [uploadType, setuploadType] = useState("Post");
  const [frontendMedia, setfrontendMedia] = useState(null);
  const [backendMedia, setbackendMedia] = useState(null);
  const mediainput = useRef();
  const [mediatype, setmediatype] = useState("");
  const [caption, setcaption] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { storyData } = useSelector((state) => state.story);
  const { loopData } = useSelector((state) => state.loop);
  const [showphoto, setshowphoto] = useState(false);

  const handlemedia = (e) => {
    const file = e.target.files[0];

    if (file.type.includes("image")) {
      setmediatype("image");
    } else {
      setmediatype("video");
    }

    setbackendMedia(file);
    setfrontendMedia(URL.createObjectURL(file));
  };

  const uploadpost = async () => {
    setloading(true);
    try {
      const formdata = new FormData();
      formdata.append("caption", caption);
      formdata.append("mediatype", mediatype);
      formdata.append("media", backendMedia);
      const response = await axios.post(
        `${serverUrl}/api/post/upload`,
        formdata,
        { withCredentials: true }
      );
      dispatch(setpostData([...postData, response.data]));
      console.log(response);
      setloading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const stopAllVideos = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((v) => {
      v.pause();
      v.muted = true;
    });
  };
  const uploadstory = async () => {
    setloading(true);
    try {
      const formdata = new FormData();
      formdata.append("mediatype", mediatype);
      formdata.append("media", backendMedia);
      const response = await axios.post(
        `${serverUrl}/api/story/upload`,
        formdata,
        { withCredentials: true }
      );

      dispatch(setstoryData(response.data));
      //setuserData((prev) => ({ ...prev, story: response.data }));
      console.log(response);
      setloading(false);
      stopAllVideos();
      navigate("/");

      //window.location.href = "/";
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const uploadloop = async () => {
    setloading(true);
    try {
      const formdata = new FormData();
      formdata.append("caption", caption);
      formdata.append("media", backendMedia);
      const response = await axios.post(
        `${serverUrl}/api/loop/upload`,
        formdata,
        { withCredentials: true }
      );
      console.log(response);
      dispatch(setloopData([...loopData, response.data]));
      setloading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const handleUpload = () => {
    if (uploadType == "Post") {
      uploadpost();
    } else if (uploadType == "Story") {
      uploadstory();
    } else {
      uploadloop();
    }
  };

  const handlecancel = () => {
    setfrontendMedia(null);
    setbackendMedia(null);
  };
  return (
    <div className="relative w-full min-h-screen bg-white">
      <div className="absolute inset-0 bg-white z-0"></div>

      <div className="absolute left-[5%] top-[5%] w-[90%] min-h-screen bg-black z-10 rounded-t-[60px]">
        {/* Back Icon */}
        <div className="p-10 flex items-center gap-3">
          <IoMdArrowRoundBack
            className="h-[30px] w-[30px] text-white cursor-pointer active:scale-95 transition"
            onClick={() => navigate("/")}
          />
          <h2 className="text-white text-xl font-semibold">Upload Media</h2>
        </div>

        {/* Top Buttons */}
        <div className="w-[80%] max-w-[600px] h-[50px] md:h-[70px] bg-white rounded-full flex justify-around items-center mx-auto gap-[10px]">
          {["Post", "Story", "Loop"].map((type) => (
            <div
              key={type}
              className={`w-[28%] h-[80%] flex justify-center items-center text-[18px] font-semibold cursor-pointer 
              rounded-full transition-all duration-200 
              hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black
              ${
                uploadType === type
                  ? "bg-black text-white shadow-2xl shadow-black"
                  : ""
              }`}
              onClick={() => setuploadType(type)}
            >
              {type}
            </div>
          ))}
        </div>

        {/* Upload Box */}
        {!frontendMedia && (
          <div
            onClick={() => mediainput.current.click()}
            className="text-white mx-auto w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-600 border-2 border-dotted flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]"
          >
            <input
              onChange={handlemedia}
              accept={uploadType === "Loop" ? "video/*" : "*"}
              type="file"
              hidden
              ref={mediainput}
            />
            <FaPlus className="w-[20px] h-[20px]" />
            <div className="text-[20px]">Upload {uploadType}</div>
          </div>
        )}

        {/* Preview */}
        {frontendMedia && (
          <div className="mx-auto w-[140px] md:w-[140px] h-[450px] md:h-auto flex flex-col items-center justify-center mt-[12vh]">
            {mediatype === "image" && (
              <>
                <div className="w-full flex flex-col items-center">
                  {/* FIXED SIZE PREVIEW BOX - FULL IMAGE VISIBLE */}
                  <div className="w-full h-[300px] overflow-hidden rounded-2xl flex justify-center items-center bg-black">
                    <img
                      onClick={() => setshowphoto(true)}
                      src={frontendMedia}
                      alt=""
                      className="max-w-full max-h-full object-contain cursor-pointer rounded-2xl"
                    />
                  </div>
                </div>

                {uploadType !== "Story" && (
                  <input
                    onChange={(e) => setcaption(e.target.value)}
                    value={caption}
                    placeholder="Caption"
                    type="text"
                    className="w-[300px] md:w-[500px] border-b-gray-200 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]"
                  />
                )}
              </>
            )}

            {mediatype === "video" && (
              <div className="w-full flex flex-col items-center">
                <video
                  src={frontendMedia}
                  controls
                  loop
                  className="max-w-full max-h-[300px] object-contain rounded-2xl bg-black"
                />
                {uploadType !== "Story" && (
                  <input
                    onChange={(e) => setcaption(e.target.value)}
                    value={caption}
                    placeholder="Caption"
                    type="text"
                    className="w-[250px] md:w-[350px] border-b-gray-200 border-b-2 outline-none px-[5px] py-[5px] text-white mt-[20px]"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        {frontendMedia && (
          <div>
            <div
              onClick={handleUpload}
              className="font-semibold mx-auto px-[10px] mb-[15px] md:mb-[0] py-[13px] w-[60%] max-w-[400px] h-[50px] text-center bg-white mt-[50px] cursor-pointer rounded-2xl  hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)]"
            >
              {loading ? (
                <ClipLoader size={30} color="black" />
              ) : (
                `Upload ${uploadType}`
              )}
            </div>
            <div
              onClick={handlecancel}
              className="font-semibold mx-auto px-[10px] mb-[15px] md:mb-[10px] py-[13px] w-[60%] max-w-[400px] h-[50px] text-center bg-white mt-[10px] cursor-pointer rounded-2xl  hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)]"
            >
              Cancel
            </div>
          </div>
        )}
        {showphoto && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
            onClick={() => setshowphoto(false)}
          >
            <img
              src={frontendMedia}
              className="max-w-[90%] max-h-[90%] rounded-xl object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
