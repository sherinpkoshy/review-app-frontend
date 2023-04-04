import React from "react";

export default function Container({ children, className }) {
  return (
    <div className={"max-w-screen-2xl mx-auto px-2  " + className}>
      {children}
    </div>
  );
}
