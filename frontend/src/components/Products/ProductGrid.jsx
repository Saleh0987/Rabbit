import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import {BiLoaderAlt, BiShoppingBag} from "react-icons/bi";
import { toast } from 'sonner';
import AOS from "aos";
import "aos/dist/aos.css"

const ProductGrid = ({ products, loading, error }) => {
  const truncateName = (name) => {
  return name.split(" ").slice(0, 3).join(" ") + "...";
};

  if (loading) return (
    <div className='flex items-center justify-center h-[100vh]'>
      <BiLoaderAlt  className="animate-spin text-[100px] text-blue-900" />
    </div>
  );

    if (error) return toast.error(error.message);
  useEffect(() => {
      AOS.init({ duration: 1000, mirror: true }); // Continuous animations
  }, []);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <Link
          key={index}
          to={`/products/${product._id}`}
          className="block"
          data-aos="fade-up"
        >
          <div className="bg-white rounded-lg shadow relative  group">
            <div className="w-full h-[300px] mb-4">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover shadow rounded-tr-lg rounded-tl-lg"
              />
            </div>

            <p className="absolute top-2 left-2 text-white font-bold bg-red-600 text-md py-.5 px-2 rounded-md">
              Top
            </p>

            <div className="bg-white  rounded-lg p-4 text-black">
              <div className="flex items-center justify-between">
                <div className="">
                  <h4 className="font-bold">{truncateName(product.name)}</h4>
                  <p className="mt-1 text-md text-maincolor">
                    LE {product.price}
                  </p>
                </div>
                <div>
                  <button
                    className="px-4 py-1.5 flex items-center space-x-2 rounded-md text-white 
                      bg-gradient-to-r from-[#7e60bf] to-[#433878] hover:from-[#433878] hover:to-[#7e60bf]
                      transition-all duration-300 transform hover:scale-110 hover:rotate-2 shadow-lg hover:shadow-indigo-500/50 group"
                  >
                    <span className="font-semibold tracking-wide">Buy</span>

                    <span className="animate-pulse group-hover:animate-ping">
                      <BiShoppingBag className="text-[22px]" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductGrid