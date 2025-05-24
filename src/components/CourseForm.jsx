// CourseForm.jsx
import React from "react";
import Input from "./Input";
import { Button, IconButton } from "@material-tailwind/react";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

const CourseForm = ({
  showForm,
  toggleForm,
  editingId,
  course,
  categories,
  handleChange,
  handleSubmit,
  handleLanguageChange,
  updateTocItem,
  removeTocItem,
  addTocItem,
  updateResource,
  removeResource,
  addResource,
  updateMaterial,
  removeMaterial,
  addMaterial,
}) => {
  if (!showForm) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl  p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Course" : "Create New Course"}
        </h2>
        <button
          onClick={toggleForm}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Course Title"
            placeholder="Enter course title"
            name="title"
            type="text"
            value={course.title}
            onChange={handleChange}
            required={true}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={course.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Price"
            placeholder="Enter course price"
            name="price"
            type="number"
            value={course.price}
            onChange={handleChange}
          />

          <Input
            label="Number of Lessons"
            placeholder="Enter number of lessons"
            name="lessons"
            type="number"
            value={course.lessons}
            onChange={handleChange}
            required
          />

          <Input
            label="Students Enrolled"
            placeholder="Enter number of students"
            name="students"
            type="number"
            value={course.students}
            onChange={handleChange}
          />

          <Input
            label="Duration"
            placeholder="e.g., 6 weeks"
            name="duration"
            type="text"
            value={course.duration}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Difficulty Level <span className="text-red">*</span>
            </label>
            <select
              name="difficulty"
              value={course.difficulty}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Beginner">Beginner</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="certification"
              checked={course.certification}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm gap-1 flex font-medium">
              Offers Certification
              {/* <span className="text-red-500">*</span> */}
            </label>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Languages <span className="text-red">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {["English", "Hindi", "Spanish", "French", "German"].map((lang) => (
              <label key={lang} className="flex items-center">
                <input
                  type="checkbox"
                  value={lang.toLowerCase()}
                  checked={course.languages.includes(lang.toLowerCase())}
                  onChange={handleLanguageChange}
                  className="mr-2"
                />
                {lang}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Table of Contents */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-3">Table of Contents</h3>
            <IconButton size="sm" variant="outlined" onClick={addTocItem}>
              <PlusIcon className="w-6" />
            </IconButton>
          </div>
          {course.tableOfContents.map((item, index) => (
            <div key={index} className="mb-4 p-3  rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <Input
                  label="Section Title"
                  placeholder="Enter section title"
                  value={item.title}
                  onChange={(e) =>
                    updateTocItem(index, "title", e.target.value)
                  }
                  required={true}
                />
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Section Detail
                  </label>
                  <textarea
                    value={item.detail}
                    onChange={(e) =>
                      updateTocItem(index, "detail", e.target.value)
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeTocItem(index)}
                className="text-red-500 text-sm font-medium"
              >
                Remove Section
              </button>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-3">Add Rescources</h3>
            <IconButton size="sm" variant="outlined" onClick={addResource}>
              <PlusIcon className="w-6" />
            </IconButton>
          </div>
          {course.additionalResources.map((resource, index) => (
            <div key={index} className="mb-4 p-3  rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <Input
                  label="Resource Title"
                  placeholder="Enter resource title"
                  value={resource.title}
                  onChange={(e) =>
                    updateResource(index, "title", e.target.value)
                  }
                  required={true}
                />
                <Input
                  label="Resource Link"
                  placeholder="Enter URL"
                  type="url"
                  value={resource.link}
                  onChange={(e) =>
                    updateResource(index, "link", e.target.value)
                  }
                  required={true}
                />
              </div>
              <button
                type="button"
                onClick={() => removeResource(index)}
                className="text-red-500 text-sm font-medium"
              >
                Remove Resource
              </button>
            </div>
          ))}
        </div>

        {/* Materials */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-3">Materials</h3>
            <IconButton size="sm" variant="outlined" onClick={addMaterial}>
              <PlusIcon className="w-6" />
            </IconButton>
          </div>
          {course.materials.map((material, index) => (
            <div key={index} className="mb-4 p-3 rounded-lg">
              <Input
                label={`Material ${index + 1}`}
                placeholder="Enter material required"
                value={material}
                onChange={(e) => updateMaterial(index, e.target.value)}
                required={true}
              />
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="text-red-500 text-sm font-medium"
              >
                Remove Material
              </button>
            </div>
          ))}
         
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Prerequisites
          </label>
          <textarea
            name="prerequisites"
            value={course.prerequisites}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Assignment Description
          </label>
          <textarea
            name="assignment"
            value={course.assignment}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={toggleForm}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {editingId ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
