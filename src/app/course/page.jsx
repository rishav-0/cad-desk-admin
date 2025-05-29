"use client";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import CourseForm from "@/components/CourseForm";
import { fetchCategories } from "@/service/categories";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { fetchCourses } from "@/service/courses";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { handleDelete } from "@/service/handleDelete";
import Link from "next/link";

const CoursesPage = () => {
  // States
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [detailId, setDetailId] = useState("");

  console.log(detailId, "id");

  const handleDetail = (detailId) => {
    setDetailId(detailId);
  };

  const initialCourseState = {
    title: "",
    description: "",
    image:'',
    price: "",
    lessons: "",
    students: "",
    duration: "",
    certification: false,
    difficulty: "moderate",
    languages: [],
    tableOfContents: [],
    additionalResources: [],
    materials: [],
    prerequisites: "",
    assignment: "",
    category: "",
  };

  const [course, setCourse] = useState(initialCourseState);

  const getCategories = async () => {
    const res = await fetchCategories();
    setCategories(res);
  };

  const getCourses = async () => {
    const res = await fetchCourses();
    setCourses(res);
  };

  useEffect(() => {
    getCategories();
    getCourses();
  }, []);

  // Reset form
  const resetForm = () => {
    setCourse(initialCourseState);
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
    setCourse((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle language selection
  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;
    setCourse((prev) => {
      const languages = checked
        ? [...prev.languages, value]
        : prev.languages.filter((lang) => lang !== value);
      return { ...prev, languages };
    });
  };

  // Table of Contents functions
  const addTocItem = () => {
    setCourse((prev) => ({
      ...prev,
      tableOfContents: [...prev.tableOfContents, { title: "", detail: "" }],
    }));
  };

  const removeTocItem = (index) => {
    setCourse((prev) => ({
      ...prev,
      tableOfContents: prev.tableOfContents.filter((_, i) => i !== index),
    }));
  };

  const updateTocItem = (index, field, value) => {
    setCourse((prev) => {
      const updatedToc = [...prev.tableOfContents];
      updatedToc[index][field] = value;
      return { ...prev, tableOfContents: updatedToc };
    });
  };

  // Additional Resources functions
  const addResource = () => {
    setCourse((prev) => ({
      ...prev,
      additionalResources: [
        ...prev.additionalResources,
        { title: "", link: "" },
      ],
    }));
  };

  const removeResource = (index) => {
    setCourse((prev) => ({
      ...prev,
      additionalResources: prev.additionalResources.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateResource = (index, field, value) => {
    setCourse((prev) => {
      const updatedResources = [...prev.additionalResources];
      updatedResources[index][field] = value;
      return { ...prev, additionalResources: updatedResources };
    });
  };

  // Materials functions
  const addMaterial = () => {
    setCourse((prev) => ({
      ...prev,
      materials: [...prev.materials, ""],
    }));
  };

  const removeMaterial = (index) => {
    setCourse((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const updateMaterial = (index, value) => {
    setCourse((prev) => {
      const updatedMaterials = [...prev.materials];
      updatedMaterials[index] = value;
      return { ...prev, materials: updatedMaterials };
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.title || !course.description || !course.category || !course.image) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      await updateDoc(doc(db, "courses", editingId), course);
    } else {
      await addDoc(collection(db, "courses"), course);
    }

    setShowForm(false);
    resetForm();
    getCourses();
  };

  // Edit course - properly populate all fields
  const handleEdit = (courseToEdit) => {
    setEditingId(courseToEdit.id);

    // Create a complete clone of the course object to ensure all nested arrays are properly copied
    const courseClone = {
      ...courseToEdit,
      // Ensure each property is properly initialized
      title: courseToEdit.title || "",
      image:courseToEdit.image || "",
      description: courseToEdit.description || "",
      price: courseToEdit.price || "",
      lessons: courseToEdit.lessons || "",
      students: courseToEdit.students || "",
      duration: courseToEdit.duration || "",
      certification: Boolean(courseToEdit.certification),
      difficulty: courseToEdit.difficulty || "moderate",
      category: courseToEdit.category || "",
      prerequisites: courseToEdit.prerequisites || "",
      assignment: courseToEdit.assignment || "",
      // Ensure arrays are properly cloned
      languages: Array.isArray(courseToEdit.languages)
        ? [...courseToEdit.languages]
        : [],
      tableOfContents: Array.isArray(courseToEdit.tableOfContents)
        ? courseToEdit.tableOfContents.map((item) => ({ ...item }))
        : [],
      additionalResources: Array.isArray(courseToEdit.additionalResources)
        ? courseToEdit.additionalResources.map((res) => ({ ...res }))
        : [],
      materials: Array.isArray(courseToEdit.materials)
        ? [...courseToEdit.materials]
        : [],
    };

    setCourse(courseClone);
    setShowForm(true);

    // Debug log
    // console.log("Editing course:", courseClone);
  };

  // Delete course
  const deleteCourse = async (id) => {
    await handleDelete({
      collection: "courses",
      id,
      onSuccess: getCourses,
    });
    getCourses();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Course Management</h1>

        <Button onClick={toggleForm} className="bg-secondary">
          Create new course
        </Button>
      </div>
      {/* Course Form Modal */}
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
        {/* <div className="mb-4 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            {editingId ? "Edit Course" : "Create Course"}
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowForm(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div> */}

        <CourseForm
          showForm={showForm}
          toggleForm={() => setShowForm(false)}
          editingId={editingId}
          course={course}
          categories={categories}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleLanguageChange={handleLanguageChange}
          updateTocItem={updateTocItem}
          removeTocItem={removeTocItem}
          addTocItem={addTocItem}
          updateResource={updateResource}
          removeResource={removeResource}
          addResource={addResource}
          updateMaterial={updateMaterial}
          removeMaterial={removeMaterial}
          addMaterial={addMaterial}
        />
      </Drawer>

      {/* <CardDefault /> */}
      <hr />
      <p className="font-semibold my-4">Course List</p>

      {courses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No courses found.</div>
      ) : (
        <div className="overflow-x-auto border border-accent ">
          <table className="min-w-full divide-y divide-accent">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Course name
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Certification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className=" line-clamp-2 text-sm text-gray-900">
                        {course.title}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className=" text-sm ">{course.category}</span>
                  </td>
                  <td className="px-6 text-sm py-4 whitespace-nowrap">
                    {course.certification ? (
                      <span className="  rounded-full ">Yes</span>
                    ) : (
                      <span className="  rounded-full">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm rounded-full`}>{course.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
                    <Menu>
                      <MenuHandler>
                        <i className="fas text-xl cursor-pointer fa-ellipsis"></i>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem
                          onClick={() => handleEdit(course)}
                          className="text-blue-500"
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-500"
                        >
                          Delete
                        </MenuItem>
                        <Link href={`/detail/${course.id}`} passHref>
                          <MenuItem>Details</MenuItem>
                        </Link>
                      </MenuList>
                    </Menu>
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

export default CoursesPage;
