import React, { useState, useEffect } from "react";
import { getMostRatedMovies } from "../api/admin";
import { useNotification } from "../hooks";
import { convertReviewCount } from "../utils/helper";
import RatingStar from "./RatingStar";

export default function MostRatedMovies() {
  const [movies, setMovies] = useState([]);

  const { updateNotification } = useNotification();

  const fetchMostRatedMovies = async () => {
    const { error, movies } = await getMostRatedMovies();
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMostRatedMovies();
  }, []);
  return (
    <div className="bg-white shadow dark:bg-secondary p-5 rounded">
      <h1 className="font-semibold text-xl mb-2 text-primary dark:text-white">
        Most Rated Movies
      </h1>
      <ul className="space-y-3">
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h1 className="text-secondary dark:text-white font-semibold">
                {movie.title}
              </h1>
              <div className="flex space-x-2">
                <RatingStar rating={movie.reviews?.ratingAvg} />
                <p className="text-light-subtle dark:text-dark-subtle">
                  {convertReviewCount(movie.reviews?.reviewCount)} Reviews
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
