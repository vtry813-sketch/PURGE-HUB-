import axios from "axios";

import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setnotificationdata } from "../redux/UserSlice";

function Getallnotification() {
  const dispatch = useDispatch();
  const fetchnotification = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/user/getallnotification`,
        { withCredentials: true }
      );

      dispatch(setnotificationdata(response.data));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  fetchnotification();
}

export default Getallnotification;
