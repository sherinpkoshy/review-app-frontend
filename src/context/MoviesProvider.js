import React, { createContext, useState } from "react";
import { getMovies } from "../api/movie";
import { useNotification } from "../hooks";

const limit = 2;
let currentPageNo = 0;

export const MovieContext = createContext();

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const { updateNotification } = useNotification();

  const fetchLatestUploads = async (qty = 5) => {
    const { error, movies } = await getMovies(0, qty);
    if (error) return updateNotification("error", error);
    setLatestUploads([...movies]);
  };

  const fetchMovies = async (pageNo = currentPageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification("error", error);
    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setMovies([...movies]);
  };
  const fetchNextPage = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const fetchPreviousPage = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        latestUploads,
        fetchLatestUploads,
        fetchMovies,
        fetchNextPage,
        fetchPreviousPage,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
export default MoviesProvider;
