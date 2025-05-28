"use client";
import React, { useEffect, useState } from "react";
import CourseContent from "../CourseContent";
import CourseSortDetail from "../CourseSortDetail";
import { fetchCourses } from "@/service/courses";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";



const CourseDetail = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCourse = async (id) => {
    try {
      setLoading(true);
      const res = await fetchCourses(id);
      if (!res) {
        throw new Error("Course not found");
      }
      setCourse(res);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch course:", err);
 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCourse(id);
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => getCourse(id)} />;
  }

  if (!course) {
    return <ErrorMessage message="Course not found" />;
  }


  console.log(course,'data');

  return (
    <div className="container mx-auto ">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Courses
      </button>

      <div className="flex   gap-8">
       
          <CourseContent course={course[0]} />
   
           <CourseSortDetail course={course[0]} />
        
      </div>
    </div>
  );
};

export default CourseDetail;
