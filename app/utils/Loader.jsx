"use client";
import React from "react";
import { FadeLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <FadeLoader />
    </div>
  );
}
