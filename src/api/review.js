import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const addReview = async (movieId, reviewData, reviews) => {
  const token = getToken();
  try {
    const { data } = await client.post(`/review/add/${movieId}`, reviewData, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getReviewsByMovie = async (movieId) => {
  try {
    const { data } = await client(`/review/get-review-by-movie/${movieId}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteReview = async (reviewId) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/review/${reviewId}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
