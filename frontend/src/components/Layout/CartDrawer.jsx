import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
    toggleCartDrawer();
  };

  return (
    <>
      {/* Cart Drawer with spacing */}
      <div
        className={`fixed bottom-4 right-4 w-[80%] sm:w-1/2 md:w-[30rem] h-[600px] rounded-xl bg-white 
          shadow-lg transform transition-all duration-300 flex flex-col z-50
        ${drawerOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}`}>
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleCartDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600 cursor-pointer" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cart && cart?.products?.length > 0 ? (
            <CartContents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <p>Your Cart is empty.</p>
          )}
        </div>

        {/* Checkout Button */}
        <div className="p-4 bg-white rounded-xl">
          {cart && cart?.products?.length > 0 && (
            <>
              <button
                onClick={handleCheckout}
                className="w-full bg-maincolor text-white py-3 cursor-pointer rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Checkout
              </button>
              <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
                Shipping, taxes, and discount codes calculated at checkout.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
