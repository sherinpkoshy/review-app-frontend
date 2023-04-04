import React from "react";
import { ImSpinner2 } from "react-icons/im";

export default function Submit({ value, busy, type, onClick }) {
  return (
    <button
      type={type || "submit"}
      className="w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:opacity-90 transition font-semibold text-lg cursor-pointer h-10 flex items-center justify-center"
      onClick={onClick}
    >
      {busy ? <ImSpinner2 className="animate-spin" /> : value}
    </button>
  );
}
