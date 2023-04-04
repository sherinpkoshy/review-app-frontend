import React from "react";
import { useParams } from "react-router";
import { useNotification } from "../../hooks";
import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";

export default function EditRatingModal({
  visible,
  onClose,
  onSuccess,
  initialState,
}) {
  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {};
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} initialState={initialState} />
    </ModalContainer>
  );
}
