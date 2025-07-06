import { useState } from "react";
import { Icons } from '../common/icons';

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const IconComponent = Icons[icon];                   // The main icon (user, mail, key)
  const EyeOpenIcon = Icons['eyeopen'];                // Password visible icon
  const EyeCloseIcon = Icons['eyeclose'];              // Password hidden icon

  return (
    <div className="relative w-full mb-4">
      
      <input
        name={name}
        type={type === "password" ? (passwordVisible ? "text" : "password") : type}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className="w-full rounded-md p-4 bg-grey pl-12 border border-grey focus:bg-transparent placeholder:text-black"
      />

      {/* Left Icon */}
      {IconComponent && (
        <IconComponent className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
      )}

      {/* Password Visibility Toggle Icon */}
      {type === "password" && (
        <span
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
          onClick={() => setPasswordVisible((prev) => !prev)}
        >
          {passwordVisible ? (
            <EyeOpenIcon className="text-lg" />
          ) : (
            <EyeCloseIcon className="text-lg" />
          )}
        </span>
      )}
    </div>
  );
};

export default InputBox;
