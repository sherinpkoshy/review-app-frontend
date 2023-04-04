import React from "react";

export default function NextAndPreviousButton({
  className = "",
  onPreviousClick,
  onNextClick,
}) {
  const getClasses = () => {
    return "flex justify-end items-center space-x-3 ";
  };
  return (
    <div className={getClasses() + className}>
      <Button onClick={onPreviousClick} title="Prev" />
      <Button onClick={onNextClick} title="Next" />
    </div>
  );
}

const Button = ({ title, onClick }) => {
  return (
    <button
      type="button"
      className="text-primary dark:text-white hover:underline"
      onClick={onClick}
    >
      {title}
    </button>
  );
};
