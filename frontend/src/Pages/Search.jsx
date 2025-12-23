import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setsearch } from "../redux/UserSlice";
import dp from "../assets/dp.webp";

function Search() {
  const navigate = useNavigate();
  const [input, setinput] = useState("");
  const dispatch = useDispatch();
  const { searchData } = useSelector((state) => state.user);

  const handlesearch = async () => {
    if (input.trim() === "") {
      dispatch(setsearch([])); // FIXED
      return;
    }

    try {
      const response = await axios.get(
        `${serverUrl}/api/user/search?q=${input}`,
        { withCredentials: true }
      );
      dispatch(setsearch(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlesearch();
  }, [input]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center pt-5">
      <div className="w-full px-4 flex items-center mb-4">
        <IoMdArrowRoundBack
          className="text-white h-7 w-7 active:scale-95 cursor-pointer"
          onClick={() => navigate(`/`)}
        />
      </div>

      <div className="w-full flex justify-center mb-5 px-4">
        <div className="w-full max-w-[600px] h-[50px] rounded-full bg-white flex items-center px-5">
          <FiSearch className="w-[22px] h-[22px] text-black" />
          <input
            type="text"
            placeholder="Search..."
            className="outline-none w-full ml-3 text-[16px]"
            onChange={(e) => setinput(e.target.value)}
            value={input}
          />
        </div>
      </div>

      <div className="w-full px-4 flex flex-col items-center">
        {searchData?.map((user) => (
          <div
            key={user._id}
            className="w-full max-w-[600px] h-[70px] bg-white rounded-full flex items-center gap-4 px-4 mb-3"
          >
            <div
              onClick={() => navigate(`/profile/${user.username}`)}
              className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-red-400 cursor-pointer"
            >
              <img
                src={user.profileImage || dp}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>

            <div className="text-black text-[15px]">
              <div className="font-semibold">{user.username}</div>
              <div className="text-gray-500 text-[13px]">{user.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
