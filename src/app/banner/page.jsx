"use client";
import { Fragment, useEffect, useState } from "react";

import { Button, Drawer } from "@material-tailwind/react";
import { fetchCategories } from "@/service/categories";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { handleDelete } from "@/service/handleDelete";
import { fetchBanners } from "@/service/banners";
import { fetchCourses } from "@/service/courses";
import Bannerform from "./BannerForm";

const BannerPage = () => {
  // States
  const [showForm, setShowForm] = useState(false);
  const [banners, setBanners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [bannerCourse, setBannerCourse] = useState([]);

  const initialbannerState = {
    title: "",
    image: "",
    courses: [],
    category: [],
  };

  const [banner, setBanner] = useState(initialbannerState);

  const getCategories = async () => {
    const res = await fetchCategories();
    setCategories(res);
  };

  const getCourses = async () => {
    const res = await fetchCourses();
    setCourses(res);
  };
  const getBanners = async () => {
    const res = await fetchBanners();
    setBanners(res);
  };

  useEffect(() => {
    getCategories();
    getBanners();
    getCourses();
  }, []);

  // Reset form
  const resetForm = () => {
    setBanner(initialbannerState);
    setEditingId(null);
  };

  // Toggle form visibility
  const toggleForm = () => {
    resetForm();
    setShowForm(!showForm);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBanner((prev) => ({
      ...prev,
      courses: bannerCourse,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!banner.title || !banner.image) {
      alert("Please fill all required fields");
      return;
    }

    const bannerData = {
      ...banner,
      courses: bannerCourse, // Include the selected courses
    };

    if (editingId) {
      await updateDoc(doc(db, "banners", editingId), bannerData);
    } else {
      await addDoc(collection(db, "banners"), bannerData);
    }

    setShowForm(false);
    resetForm();
    getBanners();
  };

  // Edit banner - properly populate all fields
  const handleEdit = (bannerToEdit) => {
    setEditingId(bannerToEdit.id);
    setBannerCourse(bannerToEdit.courses || []);

    const bannerClone = {
      ...bannerToEdit,
      title: bannerToEdit.title || "",
      image: bannerToEdit.image || "",
      category: bannerToEdit.category || "",
      courses: bannerToEdit.courses || [],
    };

    setBanner(bannerClone);
    setShowForm(true);
  };

  // Delete banner
  const deletebanner = async (id) => {
    await handleDelete({
      collection: "banners",
      id,
      onSuccess: getBanners,
    });
    getBanners();
  };

  console.log(banners, "banners");

  const [activeDescriptionId, setActiveDescriptionId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const toggleDescription = (userId) => {
    setActiveDescriptionId(activeDescriptionId === userId ? null : userId);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <Button onClick={toggleForm} className=" bg-secondary ">
          Create New banner
        </Button>
      </div>
      {/* banner Form Modal */}
      <Drawer
        placement="right"
        open={showForm}
        onClose={() => setShowForm(false)}
        className="p-4 overflow-auto"
        size={800}
        overlayProps={{
          className: "backdrop-blur-sm bg-white/30",
        }}
      >
        <Bannerform
          showForm={showForm}
          toggleForm={() => setShowForm(false)}
          editingId={editingId}
          banner={banner}
          courses={courses}
          categories={categories}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setBannerCourse={setBannerCourse}
          bannerCourse={bannerCourse}
        />
      </Drawer>

      {/* <CardDefault /> */}
      <hr />
      <p className="font-semibold my-4">Banner List</p>

      {banners.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No Banners found.</div>
      ) : (
        // <div className="overflow-x-auto rounded-lg border border-gray-200 ">
        //   <table className="min-w-full divide-y divide-gray-200">
        //     <thead className="bg-gray-50">
        //       <tr>
        //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
        //           Banner name
        //         </th>
        //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
        //           Banner Page
        //         </th>
        //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
        //           Banner position
        //         </th>
        //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
        //           Banner active
        //         </th>

        //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
        //           Actions
        //         </th>
        //       </tr>
        //     </thead>
        //     <tbody className="bg-white divide-y divide-gray-200">
        //       {banners.map((banner) => (
        //         <tr
        //           key={banner.id}
        //           className="hover:bg-gray-50 transition-colors"
        //         >
        //           <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
        //             {banner.title}
        //           </td>
        //           <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
        //             {banner.bannerpage}
        //           </td>
        //           <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
        //             {banner.position}
        //           </td>
        //           <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
        //             {banner.active ? "True" : "False"}
        //           </td>

        //           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        //             <div className="flex items-center space-x-2">
        //               <button
        //                 onClick={() => handleEdit(banner)}
        //                 className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
        //                 title="Edit"
        //               >
        //                 <PencilIcon className="w-5 h-5" />
        //               </button>
        //               <button
        //                 onClick={() => deletebanner(banner.id)}
        //                 className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
        //                 title="Delete"
        //               >
        //                 <TrashIcon className="w-5 h-5" />
        //               </button>
        //             </div>
        //           </td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </table>
        // </div>
        <div className="flex items-center border border-accent justify-center">
          <div className="items-center w-full mx-auto bg-white rounded-lg sm:max-w-4xl">
            <div className="mx-auto">
              <div className="overflow-x-auto">
                <div className="flex text-gray-700 justify-between rounded-lg p-4 bg-white w-full items-center space-x-16">
                  <div className="flex items-center">
                    <div className="flex font-medium text-sm rounded-full">
                      <p>
                        Results 1 - {banners.length} of {banners.length}
                      </p>
                    </div>
                  </div>
                  <div>
                    <form>
                      <div className="relative">
                        <select
                          value={rowsPerPage}
                          onChange={(e) =>
                            setRowsPerPage(Number(e.target.value))
                          }
                          className="block appearance-none w-full text-sm bg-gray-100 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 text-sm right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 16L6 10H18L12 16Z"></path>
                          </svg>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-sm font-normal text-gray-600 border-t border-b text-left bg-gray-50">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Page</th>
                      <th className="px-4 py-3">Sequence</th>
                      <th className="px-4 py-3">Active</th>
                      <th className="px-4 py-3">Actions</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-normal text-gray-700">
                    {banners.map((item) => (
                      <Fragment key={item.id}>
                        <tr
                          className="py-10 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
                          onClick={() => toggleDescription(item.id)}
                        >
                          <td className="px-4 py-4">{item.title}</td>
                          <td className="px-4 py-4">{item.bannerpage}</td>
                          <td className="px-4 py-4">{item.index}</td>
                          <td className="px-4 py-4">
                            {item.active ? "True" : "False"}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deletebanner(item.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-white border-accent border rounded-lg p-1 text-center inline-flex items-center">
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  activeDescriptionId === item.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"></path>
                              </svg>
                            </div>
                          </td>
                        </tr>
                        <tr
                          className={`py-4 px-4 border-y border-gray-200 ${
                            activeDescriptionId === item.id ? "" : "hidden"
                          }`}
                        >
                          <td colSpan="6" className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-semibold">Subtype:</p>
                                <p className="">{item.subtype}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Category:</p>
                                <div className="flex gap-2">
                                  {item.category.map((i) => (
                                    <p className="" key={i}>
                                      {i}
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold ">Courses:</p>
                                <div className="flex gap-2">
                                  {item.courses.map((i) => (
                                    <p key={i.id}>{i.title}</p>
                                  ))}
                                </div>
                              </div>
                              <img
                                className="col-span-2 h-[200px]"
                                src={item.image}
                                alt=""
                              />
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerPage;
