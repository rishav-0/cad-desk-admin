"use client";


import RegisterTable from "@/components/RegisterTable";
import { fetchRegister } from "@/service/register";
import React, { useEffect, useState } from "react";

const page = () => {
  const [formlist, setFormlist] = useState([]);

  const getForm = async () => {
    const res = await fetchRegister();
    setFormlist(res);
  };



  useEffect(() => {
    getForm();
  }, []);

  console.log(formlist, "list");

  return (
    <div className="container p-4">
      <h1 className="text-2xl mb-8 font-bold">Register Forms</h1>

      {formlist.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No enquiry found.</div>
      ) : (
        
        <RegisterTable allforms={formlist} />
      )}
    </div>
  );
};

export default page;
