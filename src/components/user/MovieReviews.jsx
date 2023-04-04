import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { deleteReview, getReviewsByMovie } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import ConfirmModal from "../modals/ConfirmModal";
import NotFoundText from "../NotFoundText";
import EditRatingModal from "../modals/EditRatingModal";

const getNameInitials = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const [reviews, setReviews] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState(null);
  const [busy, setBusy] = useState(false);
  const { movieId } = useParams();
  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const fetchReviews = async (movieId) => {
    const { error, movie } = await getReviewsByMovie(movieId);
    if (error) return updateNotification("error", error);

    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  const findProfileOwnersReview = async (movieId) => {
    if (profileOwnersReview) return setProfileOwnersReview(null);
    const matched = reviews.find((review) => review.owner.id === profileId);
    if (!matched)
      return updateNotification("error", "You don't have any reviews");
    setProfileOwnersReview(matched);
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnersReview.id);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );
    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);
    hideConfirmModal();
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    if (movieId) fetchReviews(movieId);
  }, [movieId]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="px-2 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-white text-secondary">
            <span className="text-light-subtle dark:text-dark-subtle font-normal">
              Reviews For :{" "}
            </span>{" "}
            {movieTitle}
          </h1>
          {profileId ? (
            <CustomButtonLink
              label={profileOwnersReview ? "View All" : "Find my review"}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </div>

        <NotFoundText text="No Reviews" visible={!reviews.length} />

        {profileOwnersReview ? (
          <div>
            <ReviewCard review={profileOwnersReview} />
            <div className="flex space-x-3 dark:text-white text-primary text-xl p-3">
              <button onClick={displayConfirmModal} type="button">
                <BsTrash />
              </button>
              <button type="button">
                <BsPencilSquare />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>
      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        onConfirm={handleDeleteConfirm}
        subtitle="This action will remove this review permanently."
        onCancel={hideConfirmModal}
        busy={busy}
      />

      <EditRatingModal visible={showEditModal} initialState={selectedReviews} />
    </div>
  );
}

const ReviewCard = ({ review }) => {
  if (!review) return null;
  const { owner, content, rating } = review;
  return (
    <div className="flex space-x-3 mt-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-2xl select-none">
        {getNameInitials(owner.name)}
      </div>
      <div className="">
        <h1 className="dark:text-white text-secondary font-semibold text-lg">
          {owner.name}
        </h1>
        <RatingStar rating={rating} />
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
