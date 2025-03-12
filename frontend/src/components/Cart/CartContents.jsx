import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";
import { toast } from "sonner";
import {BiLoaderAlt} from "react-icons/bi";

const CartContents = ({cart, userId, guestId}) => {
  const dispatch = useDispatch();
  const {loading, error,  } = useSelector((state) => state.products);
  
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
      if (delta > 0) {
      toast.success("Increased quantity!");
    } else {
      toast.info("Decreased quantity.");
    }
  } else {
    toast.error("Quantity cannot be less than 1.");
  }
  };

  const handleRemoveFromCart = async (productId, size, color) => {
   await dispatch(removeFromCart({ productId, guestId, userId, size, color }));
    toast.success("Product Removed")
  }

    const truncateName = (name) => {
      return name.split(" ").slice(0, 4).join(" ") + "...";
};


  if (loading) return (
      <div className='flex items-center justify-center h-[100vh]'>
        <BiLoaderAlt  className="animate-spin text-[100px] text-blue-900" />
      </div>
    );

  return (
   <div>
    {cart.products.map((product, index) => (
      <div key={index} className="flex items-start justify-between py-4 border-b shadow-md bg-gray-100/50 px-1 rounded-md border-gray-200">
       <div className="flex items-start">
        <img src={product.image} alt={product.name} className="w-20 h-24 shadow-md object-center mr-4 rounded"/>
      
       <div>
        <h3>{truncateName(product.name)}</h3>
        {product.size && product.color &&(<p className="text-sm text-gray-500">
         size: {product.size} | color: {product.color}
        </p>)}
        <div className="flex items-center mt-2">
              <button onClick={() => handleAddToCart(product.productId, -1,
                product.quantity,
                product.size,
                product.color
              )}
                className="border border-gray-200 rounded px-2 py-1 text-xl font-medium cursor-pointer">-</button>
              <span className="mx-4">{product.quantity}</span>
              <button onClick={() => handleAddToCart(product.productId, 1,
                product.quantity,
                product.size,
                product.color
              )}
                className="border border-gray-200 rounded px-2 py-1 text-xl font-medium cursor-pointer">+</button>
        </div>
       </div>
      </div>
      
      <div className="flex flex-col items-center gap-5">
       <p className="font-medium">LE {product.price.toLocaleString()} </p>
          <button
            onClick={() =>
              handleRemoveFromCart(
                product.productId,
                product.size,
                product.color
              )}
            className="cursor-pointer">
        <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600"/>
       </button>
      </div>

      </div>
     ))}
    </div>
  )
}

export default CartContents