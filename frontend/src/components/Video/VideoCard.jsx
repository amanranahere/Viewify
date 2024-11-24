import React from "react";
import { Link, useNavigate } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { useDispatch } from "react-redux";
import { addUserVideoHistory } from "../../store/userSlice.js";
import axiosInstance from "../../utils/axios.helper.js";

function VideoCard({ video, name = true }) {
  const formattedDuration = video?.duration;
  const timeDistance = getTimeDistanceToNow(video?.createdAt);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateWatchHistory = async (video) => {
    try {
      const response = await axiosInstance.post(
        `/users/watch-history/video/${video._id}`
      );
      if (response?.data?.data) {
        dispatch(addUserVideoHistory([video._id]));
      }
    } catch (error) {
      console.error("Failed to update watch history", error);
    }
  };

  const updateViewCount = async (video) => {
    try {
      await axiosInstance.patch(`/videos/views/${video._id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleVideoClick = () => {
    updateWatchHistory(video);
    updateViewCount(video);
  };

  const handleChannelClick = (e) => {
    e.preventDefault();
    navigate(`/channel/${video?.owner?.username}`);
  };

  return (
    <Link to={`/video-watchpage/${video?._id}`} onClick={handleVideoClick}>
      <div
        key={video._id}
        className="rounded-xl mt-2 text-white p-1 hover:bg-zinc-900"
      >
        <div className="relative w-full pt-[60%]">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover mb-2 rounded-xl border border-gray-800"
              src={video?.thumbnail}
              alt={video?.title}
            />
          </div>

          <p className="absolute bottom-1 right-3 ">{formattedDuration}</p>
        </div>

        <div className="flex mt-1">
          <div onClick={handleChannelClick} className="mt-1 flex-shrink-0">
            <img
              className="w-9 h-9 bg-gray-100 rounded-full object-cover"
              src={video?.owner?.avatar}
              alt={video?.owner?.fullname}
            />
          </div>

          <div className="ml-4">
            <h2
              className="text-lg font-semibold line-clamp-2"
              title={video?.title}
            >
              {video?.title}
            </h2>

            {name && (
              <h2 className="text-gray-200">{video?.owner?.fullname}</h2>
            )}

            <p className="text-gray-300 text-[0.95rem]">{`${video?.views} views • ${timeDistance}`}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
