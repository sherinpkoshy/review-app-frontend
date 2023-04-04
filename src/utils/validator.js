const validateMovie = (movieInfo) => {
  const {
    title,
    storyLine,
    tags,
    language,
    releaseDate,
    status,
    type,
    genres,
    cast,
  } = movieInfo;

  if (!title.trim()) return { error: "Title is missing" };
  if (!storyLine.trim()) return { error: "StoryLine is missing" };
  if (!language.trim()) return { error: "Language is missing" };
  if (!releaseDate.trim()) return { error: "Release date is missing" };
  if (!status.trim()) return { error: "Status is missing" };
  if (!type.trim()) return { error: "Type is missing" };

  // Validation for genres - array or not
  if (!genres.length) return { error: "Genres are missing" };
  // checking for field with string value
  for (let gen of genres) {
    if (!gen.trim()) return { error: "Invalid genres" };
  }
  // Validation for tags- array or not
  if (!tags.length) return { error: "Tags are missing" };
  // checking for field with string value
  for (let tag of tags) {
    if (!tag.trim()) return { error: "Invalid tags" };
  }
  // Validation for tags- array or not
  if (!cast.length) return { error: "Cast and crew are missing" };
  // checking for field with string value
  for (let c of cast) {
    if (typeof c !== "object") return { error: "Invalid cast" };
  }
  return { error: null };
};

export default validateMovie;
