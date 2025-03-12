import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from '../assets/login.webp';
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, mergeCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart); 
  const [showPassword, setShowPassword] = useState(false);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    let isMounted = true;

    if (user) {
      const manageCart = async () => {
        try {
          if (isMounted) {
            if (cart?.products.length > 0 && guestId) {
              await dispatch(mergeCart({ guestId, user }));
            }
            if (isMounted) {
              navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error during cart operations: ", error);
          }
        }
      };

      manageCart();
    }

    return () => {
      isMounted = false; 
    };
  }, [user, guestId, cart?.products.length, navigate, isCheckoutRedirect, dispatch]);

 
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Login successful");
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Unexpected error: ", error);
    toast.error("An unexpected error occurred.");
  }
};

 
 return ( 
 <div className="flex"> 
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12"> 
   
   <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300  shadow-sm">
    
      <div className="flex justify-center mb-6"> 
      <h2 className="text-xl font-medium">Rabbit</h2> 
      </div> 
      <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2> 
      
      <p className="text-center mb-6"> 
      Enter your username and password to login.
    </p> 

    <div className="mb-4">
     <label className="block text-sm font-semibold mb-2" >Email</label>
      <input
       type="email"
       value={email}
       autoComplete="current-email"
       onChange={(e) => setEmail(e.target.value)}
       placeholder="Enter your email address"
       className="w-full p-2 border border-gray-300  rounded"/>
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
            {showPassword ? <FaEye className="text-[18px] text-black" /> : <FaRegEyeSlash className="text-[18px] text-black" />}
          </button>
        </div>
      </div>


     <button type="submit"
     className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition">
       Sign In
         </button>
         
        <p className="mt-6 text-center text-sm">
      <Link to={`/reset-password`}
       className="text-blue-500">
        Forget{" "} Password
      </Link>
     </p>

     <p className="mt-6 text-center text-sm">
      Don't have an account? {" "}
      <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}
       className="text-blue-500">
        Register
      </Link>
     </p>
      </form> 
   </div>
   
    <div className="hidden md:block w-1/2 bg-gray-800">
      <div className="h-full flex flex-col justify-center items-center">
       <img src={login} alt="Login to Account" className="h-[750px] w-full object-cover"/>
       </div>
     </div>
     


   </div> 
);
}

export default Login