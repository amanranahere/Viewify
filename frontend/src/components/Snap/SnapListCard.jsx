import React from "react";
import { Link, useNavigate } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { addUserSnapHistory } from "../../store/userSlice.js";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axios.helper.js";

function SnapListCard({
  imgWidth = "w-[25vw]",
  imgHeight = "h-[14vw]",
  mainDivWidth = "w-full",
  titleWidth = "w-[65%]",
  titleFont = "font-semibold",
  titleSize = "text-[1.2rem]",
  showSnapDescription = true,
  descriptionWidth = "w-[40vw]",
  paddingY = "py-2",
  marginLeft = "ml-10",
  marginLeft2 = "ml-4",
  avatarWidth = "w-9",
  avatarHeight = "h-9",
  textFont = "",
  snap,
}) {
  const formattedDuration = snap?.duration;
  const timeDistance = getTimeDistanceToNow(snap?.createdAt);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateWatchHistory = async (snap) => {
    try {
      const response = await axiosInstance.post(
        `/users/watch-history/snap/${snap._id}`
      );
      if (response?.data?.data) {
        dispatch(addUserSnapHistory([snap._id]));
      }
    } catch (error) {
      console.error("Failed to update watch history", error);
    }
  };

  const updateViewCount = async (video) => {
    try {
      await axiosInstance.patch(`/snaps/views/${snap._id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleSnapClick = () => {
    updateWatchHistory(snap);
    updateViewCount(snap);
  };

  const handleChannelClick = (e) => {
    e.preventDefault();
    navigate(`/channel/${snap?.owner?.username}`);
  };

  return (
    <div className={`${mainDivWidth}`}>
      <Link to={`/snap-watchpage/${snap?._id}`} onClick={handleSnapClick}>
        <div className={`${paddingY} hover:bg-zinc-900 rounded-lg`}>
          <div className={`text-white ${marginLeft} flex`}>
            <div className="relative flex-shrink-0">
              <img
                className={`${imgWidth} ${imgHeight} object-cover rounded-xl`}
                src={snap?.snapThumbnail}
                alt={snap?.title}
              />

              <p className={`absolute bottom-1 right-3 ${textFont}`}>
                {formattedDuration}
              </p>
            </div>

            <div className={`${marginLeft2}`}>
              <h1
                title={snap?.title}
                className={`${titleFont} ${titleWidth} ${titleSize} line-clamp-1`}
              >
                {snap?.title}
              </h1>

              <p className="mb-2 text-gray-400 text-[0.85rem]">{`${snap?.views} views • ${timeDistance}`}</p>

              <div onClick={handleChannelClick}>
                <div className="flex items-center mb-2 text-[0.95rem]">
                  <img
                    className={`${avatarWidth} ${avatarHeight} mr-3 rounded-full object-cover`}
                    src={`${snap?.owner?.avatar}`}
                    alt={snap?.owner?.fullname}
                  />

                  <p className="text-gray-300">{snap?.owner?.fullname}</p>
                </div>
              </div>

              {showSnapDescription && (
                <span>
                  <p
                    className={`${descriptionWidth} text-gray-300 text-[0.90rem] line-clamp-2`}
                  >
                    {snap?.description}
                  </p>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default SnapListCard;
