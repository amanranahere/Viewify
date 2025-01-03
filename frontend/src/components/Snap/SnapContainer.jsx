import React, { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { icons } from "../Icons.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import SnapCard from "./SnapCard.jsx";

function SnapContainer() {
  const [snaps, setSnaps] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const getData = async (page) => {
    try {
      const response = await axiosInstance.get(`/snaps?page=${page}&limit=10`);

      if (response?.data?.data?.snaps?.length > 0) {
        setSnaps(response.data.data.snaps);
        setLoading(false);
        if (response.data.data.snaps.length !== 20) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching snaps", error);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  if (snaps.length === 0) {
    return (
      <div className="flex justify-center mt-[30vh]">
        <div className="flex flex-col items-center">
          <FaVideo className="w-20 h-20" />
          <h1>No Snaps Available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <InfiniteScroll
        dataLength={snaps.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center h-7 mt-1">{icons.loading}</div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="overflow-hidden mb-2 mx-2">
          <div
            className={`grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2 ${
              snaps.length < 4 &&
              "sm:grid-cols-[repeat(auto-fit,_minmax(300px,0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,0.24fr))]"
            }`}
          >
            {snaps.map((snap) => (
              <SnapCard key={snap._id} snap={snap} />
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default SnapContainer;
