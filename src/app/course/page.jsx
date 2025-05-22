"use client";
import { useState } from "react";
import Input from "@/components/Input";
import { category } from "@/utils";
import CourseCard from "@/components/CourseCard";
import CourseForm from "@/components/CourseForm";

const CoursesPage = () => {
  // States
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const initialCourseState = {
    title: "",
    description: "",
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
  const categories = category;

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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!course.title || !course.description || !course.category) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      setCourses(
        courses.map((c) =>
          c.id === editingId ? { ...course, id: editingId } : c
        )
      );
    } else {
      setCourses([...courses, { ...course, id: Date.now().toString() }]);
    }

    setShowForm(false);
    resetForm();
  };

  // Edit course - properly populate all fields
  const handleEdit = (courseToEdit) => {
    setEditingId(courseToEdit.id);

    // Create a complete clone of the course object to ensure all nested arrays are properly copied
    const courseClone = {
      ...courseToEdit,
      // Ensure each property is properly initialized
      title: courseToEdit.title || "",
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
    console.log("Editing course:", courseClone);
  };

  // Delete course
  const handleDelete = (courseToDelete) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== courseToDelete.id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          onClick={toggleForm}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Course
        </button>
      </div>

      {/* Course Form Modal */}
      <CourseForm
        showForm={showForm}
        toggleForm={toggleForm}
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

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            course={course}
            key={course.id}
            handleDelete={() => handleDelete(course)}
            handleEdit={() => handleEdit(course)}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No courses found. Create your first course!
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
