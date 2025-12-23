import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setprofiledata, setuserData } from "../redux/UserSlice";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";
import { SlUserFollow } from "react-icons/sl";
import Followbutton from "../components/Followbutton";
import Post from "../components/Post";
import { TiThSmall } from "react-icons/ti";
import { IoBookmarks } from "react-icons/io5";
import { BiSolidVideos } from "react-icons/bi";
import Loops from "./Loops";
import Loopcard from "../components/Loopcard";
import { FaPlusSquare } from "react-icons/fa";
import { setselecteduser } from "../redux/MessageSlice";

function Profile() {
  const [showphoto, setshowphoto] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profiledata, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const [type, settype] = useState("allpost");
  const { loopData } = useSelector((state) => state.loop);
  const handleprofile = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/user/getprofile/${username}`,
        { withCredentials: true }
      );
      dispatch(setprofiledata(response.data));
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handlelogout = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setuserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleprofile();
  }, [dispatch, username]);
  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* White background (base layer) */}
      <div className="absolute inset-0 bg-white z-0"></div>

      {/* Black box on top */}
      <div className="absolute left-[5%] top-[5%]  w-[90%]  min-h-screen bg-black z-10 rounded-t-[60px]">
        <div className="w-full h-[80px] flex justify-between items-center px-[30px] text-white">
          <div className="w-full flex justify-between items-center px-[-10px] mt-[30px] lg:mt-[0px] lg:px-[30px] text-white h-[80px]">
            <div>
              <IoMdArrowRoundBack
                className="h-[25px] w-[25px] cursor-pointer"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>
            <div
              className="font-bold text-[20px] "
              style={{ fontFamily: "cursive" }}
            >
              {profiledata?.username}
            </div>
            {profiledata?._id == userData._id && (
              <div onClick={handlelogout}>
                <FiLogOut className="text-white h-[21px] w-[21px] " />
              </div>
            )}
            {profiledata?._id != userData._id && (
              <Followbutton
                targertuserId={profiledata?._id}
                onfollowchange={handleprofile}
                tailwind={
                  "bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] px-1 py-1 md:px-2 font-semibold cursor-pointer rounded-2xl w-[100px]"
                }
              />
            )}
          </div>
        </div>
        <div className="w-[104%] lg:w-[104%] h-[150px] flex item-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center">
          <div
            onClick={() => setshowphoto(true)}
            className="w-[90px] h-[90px] lg:w-[140px] lg:h-[140px] mt-3 md:mt-0
                      rounded-full cursor-pointer p-[3px] 
                       border-2 border-white "
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-black ">
              <img
                src={profiledata?.profileImage || dp}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className=" lg:mt-[12px]">
            <div className="font-semibold text-[18px] lg:text-[22px] text-white">
              {profiledata?.name}
            </div>
            <div className="text-[14px] lg:text-[18px] text-[#ffffffe8]">
              {profiledata?.profession || "new user"}
            </div>
            <div className="text-[12px] lg:text-[14px] text-[#ffffffe8] break-words max-w-[220px] lg:max-w-[600px]">
              {profiledata?.bio || "Add Bio"}
            </div>
          </div>
        </div>

        <div className="w-full h-[100px] flex item-center justify-center gap-[40px] md:gap-[60px] px-[20%]  md:pt-[30px] text-white">
          <div>
            <div className="text-white text-[22px] md:text-[30px] font-semibold ">
              {(profiledata?.posts?.length || 0) +
                (profiledata?.loops?.length || 0)}
            </div>
            <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
              Posts
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {/* Stacked following images */}
              <div className="flex relative">
                {profiledata?.followers
                  ?.slice(-3)
                  .reverse()
                  .map((user, index) => (
                    <div
                      key={index}
                      className="w-[30px] h-[30px] rounded-full border border-black overflow-hidden"
                      style={{
                        marginLeft: index === 0 ? "0px" : `-${index * 10}px`,
                      }}
                    >
                      <img
                        src={user.profileImage || dp}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>

              {/* Followers count */}
              <div className="text-white text-[22px] md:text-[30px] font-semibold ">
                {profiledata?.followers?.length}
              </div>
            </div>

            <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
              Followers
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {/* Stacked following images */}
              <div className="flex relative">
                {profiledata?.following
                  ?.slice(-2)
                  .reverse()
                  .map((user, index) => (
                    <div
                      key={index}
                      className="w-[30px] h-[30px] rounded-full border border-black overflow-hidden"
                      style={{
                        marginLeft: index === 0 ? "0px" : `-${index * 10}px`,
                      }}
                    >
                      <img
                        src={user.profileImage || dp}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>

              {/* Following count */}
              <div className="text-white text-[22px] md:text-[30px] font-semibold ">
                {profiledata?.following?.length}
              </div>
            </div>

            <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
              Following
            </div>
          </div>
        </div>

        <div className="w-full h-[80px] mt-[-50px] md:mt-[5px] flex justify-center items-center gap-[20px]">
          {profiledata?._id == userData._id && (
            <button
              onClick={() => navigate("/editprofile")}
              className="px-[10px] min-w-[100px] lg:min-w-[120px] py-[3px] md:py-[5px] mr-7 md:mr-9 h-[35px] md:h-[40px] bg-white cursor-pointer rounded-2xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white"
            >
              Edit Profile
            </button>
          )}
          {profiledata?._id != userData._id && (
            <>
              <Followbutton
                targertuserId={profiledata?._id}
                onfollowchange={handleprofile}
                tailwind={
                  "px-[10px] min-w-[130px] lg:min-w-[170px] py-[3px] md:py-[5px]  h-[35px] md:h-[40px] bg-white cursor-pointer rounded-2xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white"
                }
              />

              <button
                onClick={() => {
                  dispatch(setselecteduser(profiledata));
                  navigate("/textarea");
                }}
                className="px-[10px] min-w-[130px] lg:min-w-[170px] py-[3px] md:py-[5px]  h-[35px] md:h-[40px] bg-white cursor-pointer rounded-2xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white"
              >
                Message
              </button>
            </>
          )}
        </div>

        <div className="w-full min-h-[100vh] flex justify-center px-2 ">
          <div className="w-full max-w-[800px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[120px]">
            <div className="w-[90%] h-[40px] md:h-[70px] bg-white rounded-4xl flex justify-around items-center mx-auto gap-[10px] ">
              {profiledata?._id == userData?._id && (
                <>
                  <TiThSmall
                    onClick={() => settype("allpost")}
                    className={` ${
                      type == "allpost"
                        ? "bg-black text-white rounded-3xl shadow-2xl shadow-black"
                        : ""
                    }text-black w-[150px] md:w-[200px] h-[30px] md:h-[40px] cursor-pointer py-[3px]  rounded-3xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white hover:shadow-white`}
                  />
                  <BiSolidVideos
                    onClick={() => settype("allloop")}
                    className={` ${
                      type == "allloop"
                        ? "bg-black text-white rounded-3xl shadow-2xl shadow-black"
                        : ""
                    }text-black w-[150px] md:w-[200px] h-[30px] md:h-[40px] cursor-pointer py-[3px]  rounded-3xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white hover:shadow-white`}
                  />
                  <IoBookmarks
                    onClick={() => settype("save")}
                    className={` ${
                      type == "save"
                        ? "bg-black text-white rounded-3xl shadow-2xl shadow-black"
                        : ""
                    }text-black w-[150px] md:w-[200px] h-[30px] md:h-[40px] cursor-pointer py-[3px] rounded-3xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white hover:shadow-white`}
                  />
                </>
              )}
              {profiledata?._id != userData?._id && (
                <>
                  <TiThSmall
                    onClick={() => settype("allpost")}
                    className={` ${
                      type == "allpost"
                        ? "bg-black text-white rounded-3xl shadow-2xl shadow-black"
                        : ""
                    }text-black w-[150px] md:w-[200px] h-[30px] md:h-[40px] cursor-pointer py-[3px]  rounded-3xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white hover:shadow-white`}
                  />
                  <BiSolidVideos
                    onClick={() => settype("allloop")}
                    className={` ${
                      type == "allloop"
                        ? "bg-black text-white rounded-3xl shadow-2xl shadow-black"
                        : ""
                    }text-black w-[150px] md:w-[200px] h-[30px] md:h-[40px] cursor-pointer py-[3px]  rounded-3xl hover:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] hover:text-white hover:shadow-white`}
                  />
                </>
              )}
            </div>
            {profiledata?._id === userData?._id && (
              <>
                {/* ALL POSTS */}
                {type === "allpost" &&
                  (postData.filter(
                    (post) => post.author?._id === profiledata?._id
                  ).length === 0 ? (
                    <p
                      onClick={() => navigate("/upload")}
                      className="text-center text-black/80 mt-10 cursor-pointer border border-dashed p-5 rounded bg-black/10"
                    >
                      Create Your First Post
                    </p>
                  ) : (
                    postData
                      .filter((post) => post.author?._id === profiledata?._id)
                      .map((post, index) => <Post post={post} key={index} />)
                  ))}

                {/* SAVED POSTS */}
                {type === "save" &&
                  (userData.savedpost.length === 0 &&
                  userData.savedloop.length === 0 ? (
                    <p className="text-center text-neutral-400 mt-10">
                      No saved posts or loops yet.
                    </p>
                  ) : (
                    postData
                      .filter((post) => userData.savedpost.includes(post._id))
                      .map((post, index) => <Post post={post} key={index} />)
                  ))}
                <div className="flex flex-col gap-10  ">
                  {type === "save" &&
                    loopData
                      .filter((loop) => userData.savedloop.includes(loop._id))
                      .map((loop, index) => (
                        <div
                          key={index}
                          className=" w-[calc(100%-15px)] p-3 flex justify-center my-0 md:my-[5px] shadow-xl m-auto rounded-2xl "
                        >
                          <div className="w-fit h-fit ">
                            <Loopcard loop={loop} key={index} />
                          </div>
                        </div>
                      ))}
                </div>

                {/* ALL LOOPS */}
                {type === "allloop" &&
                  (loopData.filter(
                    (loop) => loop.author?._id === profiledata?._id
                  ).length === 0 ? (
                    <p
                      onClick={() => navigate("/upload")}
                      className="text-center text-black/80 mt-10 cursor-pointer border border-dashed p-5 rounded bg-black/10"
                    >
                      Create Your First Loop
                    </p>
                  ) : (
                    loopData
                      .filter((loop) => loop.author?._id === profiledata?._id)
                      .map((loop, index) => (
                        <div
                          key={index}
                          className="w-[calc(100%-20px)] md:w-[calc(100%-260px)]  flex justify-center my-0 md:my-[5px]    shadow-xl p-2 rounded "
                        >
                          <div className="w-fit h-fit ">
                            <Loopcard loop={loop} key={index} />
                          </div>
                        </div>
                      ))
                  ))}
              </>
            )}

            {profiledata?._id != userData?._id && (
              <>
                {/* POSTS */}
                {type === "allpost" &&
                  (postData.filter(
                    (post) => post.author?._id === profiledata?._id
                  ).length === 0 ? (
                    <p className="text-center text-neutral-400 mt-10">
                      No posts yet.
                    </p>
                  ) : (
                    postData
                      .filter((post) => post.author?._id === profiledata?._id)
                      .map((post, index) => <Post post={post} key={index} />)
                  ))}

                {/* LOOPS */}
                {type === "allloop" &&
                  (loopData.filter(
                    (loop) => loop.author?._id === profiledata?._id
                  ).length === 0 ? (
                    <p className="text-center text-neutral-400 mt-10">
                      No loops yet.
                    </p>
                  ) : (
                    loopData
                      .filter((loop) => loop.author?._id === profiledata?._id)
                      .map((loop, index) => (
                        <div
                          key={index}
                          className="w-[calc(100%-20px)] md:w-[calc(100%-260px)]  flex justify-center my-0 md:my-[5px]    shadow-xl p-2 rounded "
                        >
                          <div className="w-fit h-fit ">
                            <Loopcard loop={loop} key={index} />
                          </div>
                        </div>
                      ))
                  ))}
              </>
            )}

            <Nav />
          </div>
        </div>
      </div>
      {showphoto && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
          onClick={() => setshowphoto(false)}
        >
          <img
            src={profiledata?.profileImage || dp}
            className="max-w-[90%] max-h-[90%] rounded-xl object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default Profile;
