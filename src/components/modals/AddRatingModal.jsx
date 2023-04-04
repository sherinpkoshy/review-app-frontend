import React from "react";
import { useParams } from "react-router";
import { addReview } from "../../api/review";
import { useNotification } from "../../hooks";
import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";

export default function AddRatingModal({ visible, onClose, onSuccess }) {
  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    const { error, message, reviews } = await addReview(movieId, data);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    onSuccess(reviews);
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
