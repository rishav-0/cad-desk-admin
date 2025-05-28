"use client";
import React, { useEffect, useState } from "react";

import ReuseAccordian from "@/components/Accordian/ReuseAccordian";
import ListCard from "@/components/ListCard";
import { Button } from "@material-tailwind/react";

const CourseSortDetail = ({ course }) => {
  const languages = course.languages.map((i) => i).join(" , ");
  const resource = course.additionalResources.map((i) => i.title).join(" , ");
  const certificate = course.certification ? "Yes" : "No";

  const courseDetails = [
    { icon: "fas fa-user-graduate", label: "Students" },
    { icon: "fas fa-language", label: "Language" },
    { icon: "fas fa-closed-captioning", label: "Subtitles" },
    {
      icon: "fas fa-file-alt",
      label: "Additional Resources",
    },
    { icon: "fas fa-clock", label: "Duration" },
    { icon: "fas fa-comments", label: "Critique Sessions" },
    { icon: "fas fa-certificate", label: "Certification" },
  ];
  return (
    <div className="w-full sm:w-1/2 ">
      <div className="flex items-center">
        <span className="para-bold text-4xl">₹</span>
        <h2 className="text-4xl text-black font-semibold ml-1">{course.price}</h2>
      </div>
      <div className="flex justify-between items-start mt-2">
        <div className="border-2 border-gray-100 p-1 rounded-l-lg w-1/2 flex items-center">
          <i className="fa-solid fa-book mr-2  text-xl"></i>
          <div>
            <h3 className="text-sm font-semibold mb-0">Lessons</h3>
            <span className=" para-bold text-black">
              {course.lessons}
            </span>
          </div>
        </div>
        <div className="border-2 border-gray-100 p-1 rounded-r-lg w-1/2 flex items-center">
          <i className="fas fa-signal mr-2  text-xl"></i>
          <div>
            <h3 className="text-sm font-semibold mb-0 ">Difficulty Level</h3>
            <span className=" para-bold text-black">
              {course.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ListCard
          icon="fas fa-user-graduate"
          label="Students"
          value={course.students}
        />
        <ListCard icon="fas fa-language" label="Language" value={languages} />
        <ListCard
          icon="fas fa-file-alt"
          label="Additional Resources"
          value={resource}
        />
        <ListCard
          icon="fas fa-clock"
          label="Duration"
          value={course.duration}
        />
        <ListCard
          icon="fas fa-certificate"
          label="Certification"
          value={certificate}
        />
        {/* <ListCard
          icon="fas fa-comments"
          label="Critique Sessions"
          value={course.duration}
        /> */}

        <br />

        <Button className="w-50 mb-4">Enroll a Course</Button>
        <hr />
        <div className="">
          <p className="para-bold text-black mt-4 font-semibold">Assignment</p>
          <p className="text-sm">{course.assignment}</p>

          <p className="para-bold text-black mt-4 font-semibold">Prerequisites</p>
          <p className="text-sm">{course.prerequisites}</p>

          <p className="para-bold text-black mt-4 font-semibold">Materials</p>
          {course.materials.map((i) => (
            <p className="text-sm" key={i}>
              - {i}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSortDetail;
