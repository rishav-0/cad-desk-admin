const Input = ({
  name,
  placeholder,
  onChange,
  value,
  type,
  label,
  required,
}) => {
  return (
    <div className="my-1 border-b border-gray-300 focus-within:border-black transition-colors w-full">
      <div className="flex">
        <p className="text-sm text-gray-400 transition-colors focus-within:text-black">
          {label}
        </p>
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      <input
        className="w-full outline-0 py-1"
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        value={value}
      />
    </div>
  );
};

export default Input;
