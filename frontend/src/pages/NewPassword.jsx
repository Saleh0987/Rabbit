import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoReloadCircle } from 'react-icons/io5';
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";

const NewPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  // Retrieve email from localStorage
  const email = localStorage.getItem('resetEmail');


  // Formik for validation and form handling
  const formik = useFormik({
    initialValues: {
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: values.password, 
          }),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success(result.message); 
          localStorage.removeItem('resetEmail'); 
          navigate("/login"); 
        } else {
          toast.success(result.message || "Failed to update password.");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("Server error. Please try again.");
      }
      setLoading(false);
    },
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);

  return (
    <div className="nike-container sm:py-4 min-h-[70vh] sm:h-auto flex items-center justify-center">
      <div className="bg-white rounded-md p-4 w-[60%] sm:nike-container lg:w-[80%] shadow-2xl">
        <h1 className="text-gray-800 font-bold text-center text-2xl mb-8">New Password</h1>
        <form onSubmit={formik.handleSubmit} className="w-[80%] sm:w-[100%] mx-auto">
          {/* Password Field */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <RiLockPasswordFill className="text-[18px] text-black" />
            <input
              id="password"
              autoComplete="new-password"
              className="pl-2 w-full outline-none border-none text-black"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div onClick={togglePasswordVisibility} className="cursor-pointer">
              {showPassword ? <FaEye className="text-[18px] text-black" /> : <FaRegEyeSlash className="text-[18px] text-black" />}
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mb-2">{formik.errors.password}</div>
          )}

          {/* Confirm Password Field */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <IoReloadCircle className="text-[18px]" />
            <input
              autoComplete="new-password"
              id="rePassword"
              className="pl-2 w-full outline-none border-none"
              type={showRePassword ? "text" : "password"}
              name="rePassword"
              placeholder="Confirm Password"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div onClick={toggleRePasswordVisibility} className="cursor-pointer text-black">
              {showRePassword ? <FaEye className="text-[18px]" /> : <FaRegEyeSlash className="text-[18px]" />}
            </div>
          </div>
          {formik.touched.rePassword && formik.errors.rePassword && (
            <div className="text-red-500 text-sm mb-2">{formik.errors.rePassword}</div>
          )}

          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 transition-all duration-500 text-white font-semibold mb-2"
            disabled={loading}
          >
            {loading ? <FiLoader className="inline-block animate-spin text-white text-xl" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
