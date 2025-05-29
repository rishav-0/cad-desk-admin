import React, { useState } from "react";

import { Button, Drawer } from "@material-tailwind/react";

import Input from "@/components/Input";
import Select from "react-select";

const Bannerform = ({
  showForm,
  toggleForm,
  editingId,
  courses,
  categories,
  handleChange,
  handleSubmit,
  banner,
  setBannerCourse,
  bannerCourse,
}) => {
  if (!showForm) return null;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [selectCourse, setSelectCourse] = useState(bannerCourse || []);
  const type = [1, 2, 3, 4, 5, 6, 7, 8];
  const page = ["Home", "Detail", "Listing"];
  const [selectedCategories, setSelectedCategories] = useState(
    banner.category
      ? banner.category.map((cat) => ({ label: cat, value: cat }))
      : []
  );

  const handleSelect = (course) => {
    setSelectCourse((prev) => {
      const alreadySelected = prev.find((c) => c.id === course.id);
      if (alreadySelected) {
        return prev.filter((c) => c.id !== course.id); // Deselect
      } else {
        return [...prev, course]; // Add new
      }
    });

    setBannerCourse(selectCourse);
  };

  const handleConfirmSelection = () => {
    setBannerCourse(selectCourse);
    handleOpen();
  };

  return (
    <div className="bg-white rounded-lg  w-full max-w-4xl  p-6">
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
            label="Banner Title"
            placeholder="Enter banner title"
            name="title"
            type="text"
            value={banner.title}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Banner Image"
            placeholder="Enter banner image URL"
            name="image"
            type="url"
            value={banner.image}
            onChange={handleChange}
            required={true}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Categories <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              options={categories.map((cat) => ({
                label: cat.category,
                value: cat.category,
              }))}
              value={selectedCategories}
              onChange={(selected) => {
                setSelectedCategories(selected);
                const selectedValues = selected.map((opt) => opt.value);

                // Update banner categories
                handleChange({
                  target: { name: "category", value: selectedValues },
                });

                // If categories are selected
                if (selectedValues.length > 0) {
                  // Get all courses that match the selected categories
                  const matchingCourses = courses.filter((course) =>
                    selectedValues.includes(course.category)
                  );

                  // If no courses are currently selected, auto-select all matching courses
                  if (selectCourse.length === 0) {
                    setSelectCourse(matchingCourses);
                    setBannerCourse(matchingCourses);
                  } else {
                    // Remove courses that no longer match any selected category
                    // and add any new matching courses that weren't previously selected
                    const currentlySelectedIds = selectCourse.map(
                      (course) => course.id
                    );
                    const filtered = selectCourse.filter((course) =>
                      selectedValues.includes(course.category)
                    );

                    // Add any matching courses that weren't already selected
                    const newMatchingCourses = matchingCourses.filter(
                      (course) => !currentlySelectedIds.includes(course.id)
                    );

                    const updatedSelection = [
                      ...filtered,
                      ...newMatchingCourses,
                    ];
                    setSelectCourse(updatedSelection);
                    setBannerCourse(updatedSelection);
                  }
                } else {
                  // If no categories selected, clear courses
                  setSelectCourse([]);
                  setBannerCourse([]);
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Sub type <span className="text-red-500">*</span>
            </label>
            <select
              name="subtype"
              value={banner.subtype}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Sub type</option>
              {type.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Banner Page <span className="text-red-500">*</span>
            </label>
            <select
              name="bannerpage"
              value={banner.bannerpage}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Banner page</option>
              {page.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Banner position <span className="text-red-500">*</span>
            </label>
            <select
              name="position"
              value={banner.position}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Banner position</option>
              {["Top", "Bottom"].map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Banner index"
            placeholder="Enter banner index"
            name="index"
            type="text"
            value={banner.index}
            onChange={handleChange}
            required={true}
          />

          <div className="col-span-2">
            <Button onClick={handleOpen} variant="outlined" size="sm">
              Select Courses
            </Button>
            <div className="flex gap-2 py-2 flex-wrap">
              {bannerCourse.map((i) => (
                <p key={i.id} className="text-sm border rounded-sm px-2">
                  {i.title}
                </p>
              ))}
            </div>
          </div>

          <Drawer
            open={open}
            onClose={handleOpen}
            placement="right"
            size={600}
            className="p-4"
            overlayProps={{
              className: "backdrop-blur-sm bg-white/30",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Courses</h2>
              <button
                onClick={handleOpen}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh] border rounded">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2">Select</th>
                    <th className="px-4 py-2">Course Title</th>
                  </tr>
                </thead>
                <tbody>
                  {courses
                    .filter(
                      (i) =>
                        selectedCategories.length === 0 ||
                        selectedCategories.some(
                          (cat) => cat.value === i.category
                        )
                    )
                    .map((i) => {
                      const isSelected = selectCourse.find(
                        (c) => c.id === i.id
                      );
                      return (
                        <tr
                          key={i.id}
                          className={`border-b hover:bg-gray-50 ${
                            isSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={!!isSelected}
                              onChange={() => handleSelect(i)}
                              className="accent-green-600"
                            />
                          </td>
                          <td className="px-4 py-2">{i.title}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outlined" color="black" onClick={handleOpen}>
                Cancel
              </Button>
              <Button color="green" onClick={handleConfirmSelection}>
                Confirm
              </Button>
            </div>
          </Drawer>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={banner.active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm gap-1 flex font-medium">Enable</label>
          </div>
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
            {editingId ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Bannerform;
