import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import getUserLikedVideos from "../hooks/getUserLikedVideos.js";
import VideoListCard from "../components/Video/VideoListCard.jsx";
import { BiLike } from "react-icons/bi";
import { icons } from "../components/Icons.jsx";
import GuestLikedContent from "../components/GuestPages/GuestLikedContent.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { removeUserLikedVideos } from "../store/userSlice.js";
import InfiniteScroll from "react-infinite-scroll-component";

function LikedVideos() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (status) {
      if (page === 1) {
        dispatch(removeUserLikedVideos());
      }
      getUserLikedVideos(dispatch, page).then((res) => {
        setLoading(false);
        if (res.data.length !== 10) {
          setHasMore(false);
        }
      });
    }
  }, [status, page]);

  const likedVideos = useSelector((state) => state.user.userLikedVideos);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!status) {
    return <GuestLikedContent content={"videos"} />;
  }

  return (
    <>
      {loading && (
        <span className="flex justify-center mt-20">{icons.bigLoading}</span>
      )}

      {likedVideos?.length > 0 && !loading && (
        <InfiniteScroll
          dataLength={likedVideos.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center h-7 mt-1">{icons.loading}</div>
          }
          scrollableTarget="scrollableDiv"
        >
          {likedVideos.map((video) => (
            <div key={video._id}>
              <VideoListCard
                video={video}
                imgWidth="w-[20vw]"
                imgHeight="h-[11vw]"
              />
            </div>
          ))}
        </InfiniteScroll>
      )}

      {likedVideos?.length < 1 && !loading && (
        <GuestComponent
          icon={
            <span className="w-full h-full flex items-center p-4 pb-5">
              <BiLike className="w-32 h-32" />
            </span>
          }
          title="Empty Liked Videos"
          subtitle="You have no previously liked videos"
          guest={false}
        />
      )}
    </>
  );
}

export default LikedVideos;
