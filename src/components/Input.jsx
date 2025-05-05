

const Input = ({ name, placeholder, onChange, type, label,required }) => {
  return (
    <div className="my-1 border-b border-gray-300 focus-within:border-black transition-colors">
      <p className="text-sm text-gray-400 focus-within:text-black">{label}</p>
      <input
        className="w-full outline-0 py-1"
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Input;
