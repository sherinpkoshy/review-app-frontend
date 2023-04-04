import React from "react";

const commonPosterUI =
  "flex justify-center items-center border border-dashed border-rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

export default function PosterSelector({
  accept,
  name,
  label,
  selectedPoster,
  className,
  onChange,
}) {
  return (
    <div>
      <input
        accept={accept}
        type="file"
        name={name}
        onChange={onChange}
        id={name}
        hidden
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            className={commonPosterUI + " object-cover " + className}
            src=""
            alt=""
          />
        ) : (
          <PosterUI label={label} className={className} />
        )}
      </label>
    </div>
  );
}

const PosterUI = ({ className, label }) => {
  return (
    <div className={commonPosterUI + " " + className}>
      <span className="dark:text-dark-subtle text-light-subtle">{label}</span>
    </div>
  );
};
