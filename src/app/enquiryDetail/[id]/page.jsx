"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

import ShowData from "@/components/ShowData";
import { fetchEnquiryData } from "@/service/enquiry";


const EnquiryDetail = ({ params }) => {

  const { id } = params;
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getForm = async (id) => {
    try {
      setLoading(true);
      const res = await fetchEnquiryData(id);
      if (!res) {
        throw new Error("Form not found");
      }
      setForm(res);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch form:", err);
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getForm(id);
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => getForm(id)} />;
  }

  if (!form) {
    return <ErrorMessage message="Course not found" />;
  }


  console.log(form,id,'data');

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
        Back to Forms
      </button>

      <hr />

      {/* <ShowData label='Name' title={form.name} /> */}

    </div>
  );
};

export default EnquiryDetail;
