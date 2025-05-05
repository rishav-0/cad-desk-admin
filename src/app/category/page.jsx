"use client"; // Required for useState in Next.js App Router

import Input from '@/components/Input';
import React, { useState } from 'react';

const Category = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    category: '',
    image: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically call your API
      console.log('Data to be submitted:', formData);
      
      // Example API call (uncomment when you have your endpoint)
      // const response = await fetch('/api/categories', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (response.ok) {
      //   alert('Category created successfully!');
      //   // Reset form after successful submission
      //   setFormData({ category: '', image: '' });
      // }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className=''>
      <p className="text-xl font-semibold">Create Category</p>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-4">
          <Input 
            label='Category Name' 
            placeholder='Category Name' 
            name='category' 
            type='text'
            value={formData.category}
            onChange={handleInputChange}
            required={true}
          />
          <Input 
            label='Category Image URL' 
            placeholder='Image URL' 
            name='image' 
            type='text'
            value={formData.image}
            onChange={handleInputChange}
          
          />
        </div>
        <button 
          type="submit" 
          className="mt-4 px-4 py-2 bg-black text-sm text-white rounded hover:bg-gray-600 transition-colors"
        >
          Save Category
        </button>
      </form>
    </div>
  );
}

export default Category;