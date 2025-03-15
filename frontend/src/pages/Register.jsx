import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from '../assets/register.webp';
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { FiLoader } from "react-icons/fi";

const Register = () => {
const [name, setName] = useState(""); 
const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
  if (user) {
    const handleCart = async () => {
      try {
        if (cart?.products.length > 0 && guestId) {
          await dispatch(mergeCart({ guestId, user }));
        }
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      } catch (error) {
        console.error("Error in mergeCart:", error);
      }
    };

    handleCart();
  }
}, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const resultAction = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successfully:");
      navigate("/"); // Adjust redirect as needed
    } else {
      toast.error("Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
     toast.error("An unexpected error occurred. Please try again later.");
  }
};

 
 return (
   <div className="flex">
     <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
       <form
         onSubmit={handleSubmit}
         className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300  shadow-sm"
       >
         <div className="flex justify-center mb-6">
           <h2 className="text-xl font-medium">Grafica Store</h2>
         </div>
         <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>

         <p className="text-center mb-6">
           Enter your username and password to login.
         </p>

         <div className="mb-4">
           <label className="block text-sm font-semibold mb-2">Name</label>
           <input
             type="text"
             value={name}
             autoComplete="current-name"
             onChange={(e) => setName(e.target.value)}
             placeholder="Enter your Name"
             className="w-full p-2 border border-gray-300 rounded"
           />
         </div>

         <div className="mb-4">
           <label className="block text-sm font-semibold mb-2">Email</label>
           <input
             type="email"
             value={email}
             autoComplete="current-email"
             onChange={(e) => setEmail(e.target.value)}
             placeholder="Enter your email address"
             className="w-full p-2 border border-gray-300  rounded"
           />
         </div>

         <div className="mb-4">
           <label className="block text-sm font-semibold mb-2">Password</label>
           <div className="relative">
             <input
               type={showPassword ? "text" : "password"}
               value={password}
               autoComplete="current-password"
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Enter your password"
               className="w-full p-2 border border-gray-300 rounded"
             />
             <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute inset-y-0 right-0 flex items-center pr-3"
             >
               {showPassword ? (
                 <FaEye className="text-[18px] text-maincolor" />
               ) : (
                 <FaRegEyeSlash className="text-[18px] text-maincolor" />
               )}
             </button>
           </div>
         </div>

         <button
           type="submit"
           className="w-full flex justify-center items-center bg-maincolor text-white p-2 rounded-lg font-semibold hover:bg-secColor transition"
         >
           {loading ? (
             <FiLoader className="animate-spin text-white text-xl" />
           ) : (
             "Sign up"
           )}
         </button>

         <p className="mt-6 text-center text-sm">
           Do you have account?{" "}
           <Link
             to={`/login?redirect=${encodeURIComponent(redirect)}`}
             className="text-blue-500"
           >
             Login
           </Link>
         </p>
       </form>
     </div>

     <div className="hidden md:block w-1/2 bg-gray-800">
       <div className="h-full flex flex-col justify-center items-center">
         <img
           src={register}
           alt="Register to Account"
           className="h-[750px] w-full object-cover"
         />
       </div>
     </div>
   </div>
 );
}

export default Register