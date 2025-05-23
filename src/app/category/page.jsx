"use client";
import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { fetchCategories } from "@/service/categories";
import { db } from "@/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { handleDelete } from "@/service/handleDelete";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Category = () => {
  const [formData, setFormData] = useState({
    category:'',
    image: '',
  });
  const [categories, setCategories] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [search,setSearch] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  var isEmpty = formData.category == '' && formData.image == ''

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (EditId) {
        await updateDoc(doc(db, "categories", EditId), formData);
        console.log("Category updated:", formData);
      } else {
        await addDoc(collection(db, "categories"), formData);
        console.log("Category added:", formData);
      }

      setFormData({
        category: "",
        image: "",
      });
      setEditId(null);
      await getCategories();
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    setFormData({
      category: "",
      image: "",
    });
  };

  const getCategories = async (search) => {
    const res = await fetchCategories(search);
    setCategories(res);
  };

  const deletCategory = async (id) => {
    await handleDelete({
      collection: "categories",
      id,
      onSuccess: getCategories,
    });
    getCategories();
  };

  const handleEdit = (category) => {
    
    setFormData({
      category: category.category,
      image: category.image || "",
    });
    setEditId(category.id);
    
  };

  const handleCancelEdit = () => {
    setFormData({
      category: "",
      image: "",
    });
    setEditId(null);
  };

  useEffect(() => {
   
      getCategories(search.charAt(0).toUpperCase() + search.slice(1));
   
  }, [search]);



  return (
    <div className="">
      <p className="text-xl font-semibold">
        {EditId ? "Edit Category" : "Create Category"}
      </p>
      <br />
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <Input
            label="Category Name"
            placeholder="Category Name"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleInputChange}
            required={true}
          />
          <Input
            label="Category Image URL"
            placeholder="Image URL"
            name="image"
            type="text"
            value={formData.image}
            onChange={handleInputChange}
            required={true}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            disabled={isEmpty}
            type="submit"
            className={`px-4 py-2 ${
              isEmpty
                ? "bg-slate-400 "
                : "bg-black hover:bg-gray-800 transition-colors"
            }text-sm text-white rounded `}
          >
            {EditId ? "Update Category" : "Save Category"}
          </button>
          {EditId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

        <p className="text-xl font-semibold my-4">Category List</p>
      <div className="flex gap-2 mb-4 border-b border-slate-300 py-1">
        <MagnifyingGlassIcon className="w-5 text-slate-400" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-0"
          placeholder="Search Categories"
          type="text"
        />
      </div>

      {categories.length == 0 ? (
        <p className="font-semibold">No Data Found</p>
      ) : (
        <div className=" grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories?.map((i) => (
            <CategoryCard
              key={i.id}
              name={i.category}
              image={i.image}
              onEdit={() => handleEdit(i)}
              onDelete={() => deletCategory(i.id)}
              isEditing={EditId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
