import React from 'react'

const CourseCard = ({handleDelete,handleEdit,course}) => {
  return (
    <div
      key={course.id}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.category}</p>
          </div>
          {course.certification && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Certified
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-700 mb-2 line-clamp-3">{course.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {course?.languages?.map((lang) => (
            <span
              key={lang}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {lang?.charAt(0).toUpperCase() + lang.slice(1)}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">₹{course.price}</span>
            <span className="text-sm text-gray-500 ml-2">
              • {course.duration}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard