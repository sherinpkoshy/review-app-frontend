import React, { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import TagsInput from "../TagsInput";
import Submit from "../form/Submit";
import { useNotification } from "../../hooks";
import WritersModal from "../modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenreSelector from "../GenreSelector";
import GenreModal from "../modals/GenreModal";
import Selector from "../Selector";
import Label from "../Label";
import DirectorSelector from "../DirectorSelector";
import WriterSelector from "../WriterSelector";
import ViewAllBtn from "../ViewAllButton";
import LabelWithBadge from "../LabelWithBadge";
import validateMovie from "../../utils/validator";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releaseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

export default function MovieForm({ initialState, btnTitle, onSubmit, busy }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModals] = useState(false);
  const [showCastModal, setShowCastModals] = useState(false);
  const [showGenresModal, setShowGenresModals] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");

  const { updateNotification } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification("error", error);

    // cast, tags, genres, writers
    const { cast, tags, genres, writers, director, poster } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,
    };
    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }
    if (director.id) finalMovieInfo.director = director.id;
    if (poster) finalMovieInfo.poster = poster;

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === "poster") {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

    setMovieInfo({ ...movieInfo, [name]: value });
  };
  const upadateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };
  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };
  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };
  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is already selected"
        );
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const hideWritersModal = () => {
    setShowWritersModals(false);
  };
  const displayWritersModal = () => {
    setShowWritersModals(true);
  };
  const hideCastModal = () => {
    setShowCastModals(false);
  };
  const displayCastModal = () => {
    setShowCastModals(true);
  };
  const hideGenresModal = () => {
    setShowGenresModals(false);
  };
  const displayGenresModal = () => {
    setShowGenresModals(true);
  };

  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter(({ id }) => id !== profileId);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };
  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        releaseDate: initialState.releaseDate.split("T")[0],
        poster: null,
      });
      setSelectedPosterForUI(initialState.poster);
      console.log(movieInfo);
    }
  }, [initialState]);

  const {
    title,
    storyLine,
    writers,
    cast,
    tags,
    genres,
    type,
    language,
    status,
    releaseDate,
  } = movieInfo;
  return (
    <>
      <div className="flex space-x-3">
        <div className="w-[70%] space-y-5">
          <div>
            <Label htmlFor={"title"}>Title</Label>
            <input
              id="title"
              value={title}
              onChange={handleChange}
              name="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
              placeholder="Titanic"
            />
          </div>
          <div>
            <Label htmlFor={"storyLine"}>Story Line</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              className={commonInputClasses + " resize-none h-24 border-b-2"}
              placeholder="Movie story line..."
            ></textarea>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} onChange={upadateTags} name="tags" />
          </div>

          <DirectorSelector onSelect={updateDirector} />

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>
          </div>
          <WriterSelector onSelect={updateWriters} />
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast and Crew
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>
          <input
            type="date"
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
            onChange={handleChange}
            name="releaseDate"
            value={releaseDate}
          />

          <Submit
            busy={busy}
            value={btnTitle}
            type="button"
            onClick={handleSubmit}
          />
        </div>
        <div className="w-[30%] h-5 space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            accept="image/jpg, image/jpeg, image/png"
            label="Select Avatar"
          />
          <GenreSelector badge={genres.length} onClick={displayGenresModal} />
          <Selector
            onChange={handleChange}
            name="type"
            value={type}
            options={typeOptions}
            label="Type"
          />
          <Selector
            onChange={handleChange}
            name="language"
            value={language}
            options={languageOptions}
            label="Language"
          />
          <Selector
            onChange={handleChange}
            name="status"
            value={status}
            options={statusOptions}
            label="Status"
          />
        </div>
      </div>
      <WritersModal
        onRemoveClick={handleWriterRemove}
        onClose={hideWritersModal}
        profiles={writers}
        visible={showWritersModal}
      />
      <CastModal
        onRemoveClick={handleCastRemove}
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
      />
      <GenreModal
        visible={showGenresModal}
        onSubmit={updateGenres}
        onClose={hideGenresModal}
        previousSelection={genres}
      />
    </>
  );
}
