import React, { useState } from "react";
import { updateActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

export default function UpdateActor({
  visible,
  onClose,
  initialState,
  onSuccess,
}) {
  const [busy, setBusy] = useState(false);
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor } = await updateActor(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification("error", error);
    console.log(actor);
    onSuccess(actor);
    updateNotification("success", "Updated Actor successfully");
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        onSubmit={!busy ? handleSubmit : null}
        title="Update Actor"
        btnTitle="Update"
        busy={busy}
        initialState={initialState}
      />
    </ModalContainer>
  );
}
