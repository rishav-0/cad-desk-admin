"use client";
import { fetchEnquiryData } from "@/service/enquiry";
import { handleDelete } from "@/service/handleDelete";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  const [formlist, setFormlist] = useState([]);

  const getForm = async () => {
    const res = await fetchEnquiryData();
    setFormlist(res);
  };

  const deleteForm = async (id) => {
    await handleDelete({
      collection: "enquiry",
      id,
      onSuccess: getForm,
    });
    getForm();
  };

  useEffect(() => {
    getForm();
  }, []);

  console.log(formlist, "list");

  return (
    <div className="container p-4">
      <h1 className="text-2xl mb-8 font-bold">Enquiry Forms</h1>

      {formlist.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No enquiry found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquirer name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delete
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formlist.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className=" font-semibold text-gray-900">
                        {form.course}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className=" text-gray-900 font-semibold">
                      {form.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className=" font-semibold ">{form.phone}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/enquiryDetail/${form.id}`} passHref>
                      <span
                        className={`font-semibold rounded-full cursor-pointer`}
                      >
                        Details
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default page;
