"use client";

import { Drawer } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const RightDrawer = ({ open, onClose, title, children, size = "md" }) => {
  return (
    <Drawer
      placement="right"
      open={open}
      onClose={onClose}
      size={size}
      className="p-4"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-y-auto">{children}</div>
    </Drawer>
  );
};

export default RightDrawer;
