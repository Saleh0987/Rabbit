
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import CheckoutRightSection from "./CheckoutRightSection";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [checkoutId, setCheckoutId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false); 
  const [showVodafoneModal, setShowVodafoneModal] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [vodafoneNumber, setVodafoneNumber] = useState("");


  const [shippingAddress, setShippingAddress] = useState({ 
     firstName: '', 
     lastName: '', 
     address: '',
     city: '', 
     postalCode: '', 
     country: "", 
     phone: "", 
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);
 
  const handleCreateCheckout = async (e, method) => {
  e.preventDefault();
  const selectedMethod = method || paymentMethod;

  if (!selectedMethod) {
    toast.error("Please select a payment method.");
    return;
  }

  try {
    setIsAnimating(true);
    const res = await dispatch(createCheckout({
      checkoutItems: cart.products,
      shippingAddress,
      paymentMethod: selectedMethod,
      totalPrice: cart.totalPrice,
    })).unwrap(); // Use unwrap() to handle any errors properly

    if (res && res._id) {
      setCheckoutId(res._id);
      return res._id;
    } else {
      console.error("Checkout creation failed. No checkout ID returned.");
    }
  } catch (err) {
    console.error("Error creating checkout:", err);
    toast.error("Failed to create checkout. Please try again.");
  } finally {
    setIsAnimating(false);
  }
};

const handlePaymentSuccess = async (details, checkoutIdParam) => {
  const finalCheckoutId = checkoutIdParam || checkoutId;

  if (!finalCheckoutId) {
    console.error("Cannot process payment: Checkout ID is missing.");
    toast.error("Unable to process payment. Missing Checkout ID.");
    return;
  }

  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${finalCheckoutId}/pay`,
      { paymentStatus: "paid", paymentDetails: details },
      { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
    );
    await handleFinalizeCheckout(finalCheckoutId);
  } catch (error) {
    console.error("Payment failed:", error);
    toast.error("Payment failed. Please try again.");
  }
};


  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, },
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
    }
  };

  const isFormValid = () => {
  return Object.values(shippingAddress).every((value) => value.trim() !== "");
};


  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Cart is empty</p>;
  }
  
  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
    {/* left section */}
    <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <form onSubmit={handleCreateCheckout}>
            <CheckoutForm
              user={user}
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}/>

              {!showPaymentOptions ? (
                <button type="submit"
                className={`w-full py-3 rounded ${isFormValid() ? "bg-black text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                onClick={(e) => {
                if (isFormValid()) {
                  setShowPaymentOptions(true);
                  handleCreateCheckout(e);
                }
              }}
              disabled={!isFormValid()}>Continue to Payment</button>
                ) : (
            <div className="space-y-4">
               <button
              className={`w-full bg-blue-500 text-white py-3 rounded transition transform ${isAnimating ? "animate-bounce" : ""}`}
              onClick={async (e) => {
                e.preventDefault(); 

                setPaymentMethod("Pay on Delivery");

                try {
                  const newCheckoutId = await handleCreateCheckout(e, "Pay on Delivery");
                  if (newCheckoutId) {
                    await handlePaymentSuccess({ method: "Pay on Delivery" }, newCheckoutId); 
                  } else {
                    console.error("Checkout ID is not set.");
                  }
                } catch (err) {
                  console.error("Error processing payment:", err);
                }
              }}>
              Pay on Delivery
            </button>
                  <button
                  className={`w-full bg-green-500 text-white py-3 rounded transition transform ${isAnimating ? "animate-bounce" : ""}`}
                  onClick={() => {
                  setShowVodafoneModal(true);
                }}>
                Electronic Wallet
              </button>

        </div>
        )}
      </form>
    </div>

    {/* Vodafone Cash Modal */}
    {showVodafoneModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Vodafone Cash Payment</h2>
          <p className="mb-2">Transfer to: <span className="font-bold">+2001112770880</span></p>
          <p className="mb-2">Order Total: <span className="font-bold">${cart.totalPrice?.toLocaleString()}</span></p>
          <label className="block text-gray-700 mb-1">Your Vodafone Number</label>
          <input type="tel" className="w-full p-2 border border-gray-300 rounded mb-4"required
          value={vodafoneNumber}
          onChange={(e) => setVodafoneNumber(e.target.value)} />
          <div className="flex justify-end gap-2">
            <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={() => setShowVodafoneModal(false)}>Cancel</button>
            <button
            className="bg-green-600 text-white py-2 px-4 rounded"
            onClick={async () => {
              if (!vodafoneNumber.trim()) {
                toast.error("Please enter your Vodafone number.");
                return;
              }

              setPaymentMethod("Electronic Wallet");

              try {
                const newCheckoutId = await handleCreateCheckout(
                  { preventDefault: () => {} }, // Fake event to prevent form submission
                  "Electronic Wallet"
                );

                if (newCheckoutId) {
                  await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${newCheckoutId}/pay`,
                    {
                      paymentStatus: "paid",
                      paymentDetails: {
                        method: "Electronic Wallet",
                        walletNumber: vodafoneNumber,
                      },
                    },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
                  );

                  await handleFinalizeCheckout(newCheckoutId);
                }
              } catch (err) {
                console.error("Error processing wallet payment:", err);
              } finally {
                setShowVodafoneModal(false);
              }
            }}
          >
            Confirm Payment
          </button>

          </div>
        </div>
      </div>
    )}

    {/* right section */}
    <CheckoutRightSection cart={cart} />
  </div>
  );
};

export default Checkout;
