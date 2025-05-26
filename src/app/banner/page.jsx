"use client";
import { useEffect, useState } from "react";

import {
  Drawer,
} from "@material-tailwind/react";
import { fetchCategories } from "@/service/categories";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
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
  const [categories,setCategories] = useState([])
  const [search,setSearch] = useState('')
  const [bannerCourse,setBannerCourse] = useState([])


  const initialbannerState = {
    title: "",
    image:'',
    courses:[],
    category:[]
  };

  const [banner, setBanner] = useState(initialbannerState);

  const getCategories= async ()=>{
     const res = await fetchCategories()
     setCategories(res)
  }

  const getCourses = async ()=>{
    const res =  await fetchCourses()
    setCourses(res)
  }
  const getBanners = async ()=>{
    const res =  await fetchBanners()
    setBanners(res)
  }

  useEffect(()=>{
    getCategories() 
    getBanners()
    getCourses();
  },[])



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
      courses:bannerCourse,
      [name]: type === "checkbox" ? checked : value,
    }));
  };



  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!banner.title || !banner.image ) {
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

  console.log(banners,'banners');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <button
          onClick={toggleForm}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New banner
        </button>
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
        <div className="overflow-x-auto rounded-lg border border-gray-200 ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner activity
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr
                  key={banner.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {banner.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {banner.bannerpage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {banner.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {
                          banner.active ?'True':'False'
                        }
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deletebanner(banner.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
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

export default BannerPage;
