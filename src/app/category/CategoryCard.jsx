import React from 'react'
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const CategoryCard = ({name, onEdit, onDelete,image , isEditing}) => {
  return (
    <div className="border border-slate-300 rounded-sm p-2 flex gap-2 justify-between items-center bg-white">
      <div className="flex gap-2 items-center">
      <img className="h-12  rounded-sm" src={image} alt="" />
        <p className="">{name}</p>

      </div>
      <div className="flex justify-between items-center  rounded-sm">
        {!isEditing && (
          <div className="flex items-center gap-2 justify-between">
            <PencilIcon
              onClick={onEdit}
              className="w-5 h-5 cursor-pointer text-blue-500"
            />
            <TrashIcon
              onClick={onDelete}
              className="w-5 h-5 cursor-pointer text-red-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryCard