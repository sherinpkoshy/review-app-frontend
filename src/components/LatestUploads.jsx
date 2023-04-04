import React, { useEffect, useState } from "react";
import { useMovies } from "../hooks";
import MovieListItem from "./MovieListItem";

const pageNo = 0;
const limit = 2;

export default function LatestUploads() {
  const { fetchLatestUploads, latestUploads } = useMovies();

  const handleUiUpdate = () => fetchLatestUploads();
  useEffect(() => {
    fetchLatestUploads();
  }, []);
  return (
    <>
      <div className="bg-white shadow dark:bg-secondary p-5 rounded col-span-2">
        <h1 className="font-semibold text-xl mb-2 text-primary dark:text-white">
          Recent Uploads
        </h1>
        <div className="space-y-3">
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                movie={movie}
                key={movie.id}
                afterDelete={handleUiUpdate}
                afterUpdate={handleUiUpdate}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
