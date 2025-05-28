"use client";
import React from "react";

const ListCard = ({ icon, label, value }) => {
  return (
    <div className="flex items-center mb-2">
      <i className={`${icon} text-gray-500 mr-2 `}></i>
      <p className=" font-semibold">
        {label}: <span className="font-normal text-black"> {value}</span>
      </p>
    </div>
  );
};

export default ListCard;
