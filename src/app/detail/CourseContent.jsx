"use client";
import ReuseAccordian from "@/components/Accordian/ReuseAccordian";
import React, { useState } from "react";

const CourseContent = ({ course }) => {
  const [open, setOpen] = useState(1);

  console.log(course, "content");

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  return (
    <div className="w-full sm:w-1/2">
      <div className="w-full relative mb-8">
        <div className="flex justify-center w-full">
          <img
          src={course.image}
          alt={course.title}
          className="h-[300px] object-cover rounded-lg"
        />
        </div>
        
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md flex flex-col items-end">
          <p className="text-sm mb-0 text-black bg-white px-4 rounded-md">
            1234 reviews
          </p>
          <p className="mb-0 text-yellow-400">★★★★★</p>
        </div>
      </div>
      <h1 className="text-4xl">{course.title}</h1>
      <p className="text-sm mb-4">{course.description}</p>
      <p className="text-lg para-bold">Course Table of content</p>

      {course.tableOfContents.map((i) => (
        <ReuseAccordian
          icon={
            <i
              className={`fa-solid text-sm ${
                open === 2 ? "fa-xmark" : "fa-plus"
              }`}
            ></i>
          }
          header={i.title}
          body={i.detail}
          id={i.title}
          handleOpen={handleOpen}
          open={open}
        />
      ))}
    </div>
  );
};

export default CourseContent;
