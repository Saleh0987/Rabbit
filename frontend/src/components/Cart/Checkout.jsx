import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import CheckoutRightSection from "./CheckoutRightSection";
import { toast } from "sonner";
import { FiLoader } from "react-icons/fi";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [showVodafoneModal, setShowVodafoneModal] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [vodafoneNumber, setVodafoneNumber] = useState("");
  const [loaderCash, setLoaderCash] = useState(false);
  const [loaderWallet, setLoaderWallet] = useState(false);

  const isValidEgyptianNumber = (number) => {
  const egyptianRegex = /^(010|011|012|015)\d{8}$/;
  return egyptianRegex.test(number);
  };

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart?.products?.length) navigate("/");
  }, [cart, navigate]);

  const handleCreateCheckout = async (e, method) => {
    e.preventDefault();
    const selectedMethod = method || paymentMethod;
    if (!selectedMethod) return toast.error("Please select a payment method.");

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: selectedMethod,
          totalPrice: cart.totalPrice,
        })
      ).unwrap();

      if (res?._id) {
        setCheckoutId(res._id);
        return res._id;
      }
    } catch (err) {
      console.error("Error creating checkout:", err);
      toast.error("Failed to create checkout.");
    }
  };

  const handlePaymentSuccess = async (details, checkoutIdParam) => {
    const finalCheckoutId = checkoutIdParam || checkoutId;
    if (!finalCheckoutId) return toast.error("Missing Checkout ID.");

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${finalCheckoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      await handleFinalizeCheckout(finalCheckoutId);
    } catch (error) {
      toast.error("Payment failed.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
    }
  };

  const isFormValid = () => Object.values(shippingAddress).every((val) => val.trim());

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart?.products?.length) return <p>Cart is empty</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <CheckoutForm user={user} shippingAddress={shippingAddress} setShippingAddress={setShippingAddress}
            isValidEgyptianNumber={isValidEgyptianNumber} />

          {/* Checkout Button */}
          {!showPaymentOptions ? (
            <button
              type="submit"
              className={`w-full py-3 rounded 
                ${isFormValid() ? "bg-black text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
              onClick={(e) => {
                if (isFormValid()) {
                  setShowPaymentOptions(true);
                  handleCreateCheckout(e);
                }
              }}
              disabled={!isFormValid()}>
              Continue to Payment
            </button>
          ) : (
            <div className="space-y-4">
                {/* CACH BTN */}
                <button
                className="w-full bg-blue-500 text-white py-3 rounded flex justify-center items-center"
                onClick={async (e) => {
                  e.preventDefault();
                  setLoaderCash(true);
                  setPaymentMethod("Pay on Delivery");
                  try {
                    const newCheckoutId = await handleCreateCheckout(e, "Pay on Delivery");
                    if (newCheckoutId) {
                      await handlePaymentSuccess({ method: "Pay on Delivery" }, newCheckoutId);
                    }
                  } finally {
                    setLoaderCash(false);
                  }
                }}>
                {loaderWallet ?  <FiLoader className="animate-spin text-white text-xl" />   : "Pay on Delivery"}
                </button>
                
                {/* Wallet BTN */}
                <button className="w-full bg-green-500 flex justify-center items-center text-white py-3 rounded"
                  onClick={() => setShowVodafoneModal(true)}>
                  {loaderWallet ? <FiLoader className="animate-spin text-black text-xl" />  : "Electronic Wallet"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Vodafone Cash Modal */}
      {showVodafoneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Wallet Cash Payment</h2>
            <p className="mb-2">
              Transfer to: <span className="font-bold text-xl">+20(01010759472)</span>
            </p>
            <p className="mb-2">
              Order Total: <span className="font-bold text-xl">LE ({cart.totalPrice?.toLocaleString()})</span>
            </p>
            <label className="block text-gray-700 mb-1">Your Wallet Number</label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
              value={vodafoneNumber}
              onChange={(e) => setVodafoneNumber(e.target.value)}/>
              
            <div className="flex justify-end gap-2">
                <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={() => setShowVodafoneModal(false)}>
                  Cancel
                </button>
                <button
                  className={`bg-green-600 w-full flex items-center justify-center text-white py-2 px-4 rounded text-center 
                    ${!isValidEgyptianNumber(vodafoneNumber) ? "bg-red-500 cursor-not-allowed" : "cursor-pointer"}`}
                  
                  onClick={async () => {
                    if (!isValidEgyptianNumber(vodafoneNumber)) {
                      return toast.error("Invalid Egyptian phone number.");
                    }
                    setLoaderWallet(true);
                    setPaymentMethod("Electronic Wallet");
                    try {
                      const newCheckoutId = await handleCreateCheckout({ preventDefault: () => {} }, "Electronic Wallet");
                      if (newCheckoutId) {
                        await axios.put(
                          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${newCheckoutId}/pay`,
                          {
                            paymentStatus: "paid",
                            paymentDetails: { method: "Electronic Wallet", walletNumber: vodafoneNumber },
                          },
                          { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
                        );
                        await handleFinalizeCheckout(newCheckoutId);
                      }
                    } finally {
                      setLoaderWallet(false);
                      setShowVodafoneModal(false);
                    }
                  }}>
                  {loaderWallet ? <FiLoader className="animate-spin text-white text-xl" /> : "Confirm Payment"}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Section */}
      <CheckoutRightSection cart={cart} />
    </div>
  );
};

export default Checkout;
