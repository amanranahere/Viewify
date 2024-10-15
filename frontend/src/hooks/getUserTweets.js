import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { addUserTweets } from "../store/userSlice.js";

const getUserTweets = async (dispatch, userId, page = 1, limit = 30) => {
  try {
    const response = await axiosInstance.get(
      `/tweets/user/${userId}?page=${page}&limit=${limit}`
    );

    if (response?.data?.data) {
      dispatch(addUserTweets(response.data.data));
      return response.data;
    }
  } catch (error) {
    toast.error("Error fetching user tweets");
    console.log(error);
  }
};

export default getUserTweets;
