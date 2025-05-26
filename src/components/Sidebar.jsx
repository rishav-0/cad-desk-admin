// components/Sidebar.js
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full  text-black p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-6">Neeed</h2>
      <nav className="space-y-2">
        <Link
          href="/category"
          className={`block p-2 rounded hover:bg-black hover:text-white transition-colors ${
            pathname === "/category" ? "bg-black text-white" : ""
          }`}
        >
          Course Category
        </Link>
        <Link
          href="/course"
          className={`block p-2 rounded hover:bg-black hover:text-white transition-colors ${
            pathname === "/course" ? "bg-black text-white" : ""
          }`}
        >
          Course
        </Link>
        <Link
          href="/banner"
          className={`block p-2 rounded hover:bg-black hover:text-white transition-colors ${
            pathname === "/banner" ? "bg-black text-white" : ""
          }`}
        >
          Banner
        </Link>
      </nav>
    </div>
  );
}
