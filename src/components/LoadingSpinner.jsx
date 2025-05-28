"use client";

const LoadingSpinner = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
