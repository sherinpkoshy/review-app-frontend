import React, { useEffect, useState } from "react";
import { useMovies, useNotification } from "../../hooks";
import MovieListItem from "../MovieListItem";
import NextAndPreviousButton from "../NextAndPreviousButton";

const limit = 2;
let currentPageNo = 0;

export default function Movies() {
  const {
    fetchMovies,
    movies: newMovies,
    fetchPreviousPage,
    fetchNextPage,
  } = useMovies();

  const handleUiUpdate = () => fetchMovies();

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);
  return (
    <>
      <div className="space-y-3 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUiUpdate}
              afterUpdate={handleUiUpdate}
            />
          );
        })}
        <NextAndPreviousButton
          className="mt-5"
          onNextClick={fetchNextPage}
          onPreviousClick={fetchPreviousPage}
        />
      </div>
    </>
  );
}
