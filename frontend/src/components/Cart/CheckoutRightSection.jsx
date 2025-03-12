import React, { useState } from 'react'

const CheckoutRightSection = ({ cart }) => {
  const [shipping, setShipping] = useState(100);

  return (
    <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-lg mb-4">Order Summary</h2>
        <div className="border-t border-gray-300 py-4 mb-4">
          
          {cart.products.map((product, index) => (
            <div key={index}
              className="flex items-start justify-between py-2 border-b border-gray-300">
              <div className="flex items-start">
                <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4"/>
              <div>
              <h3 className="text-md">{product.name}</h3>
              <p className="text-gray-500">Size: {product.size}</p>
              <p className="text-gray-500">Color: {product.color}</p>
              </div>
              </div>
              <div className="flex flex-col gap-8">
                <p className="text-xl">{product.price?.toLocaleString()} LE</p>
              <p className="text-gray-500">Quantity: {product.quantity}</p>

              </div>
            </div>
          ))}

        </div>

        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>{cart.totalPrice?.toLocaleString()} LE</p>
        </div>

         <div className="flex justify-between items-center text-lg ">
          <p>Shipping</p>
        <p>{cart.totalPrice > 90 ? "free" : "100 LE"}</p>
        </div>

        <div className="flex justify-between items-center text-lg mt-4 border-t border-gray-300 pt-4">
  <p>Total</p>
  <p>{(cart.totalPrice || 0) + (cart.totalPrice > 90 ? 0 : shipping)} LE</p>
</div>


      </div>
  )
}

export default CheckoutRightSection