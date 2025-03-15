import {useEffect, useState} from "react";
import {toast} from "sonner";
import ProductGrid from "./ProductGrid";
import {useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import {addToCart} from "../../redux/slices/cartSlice";
import {BiLoaderAlt, BiShoppingBag} from "react-icons/bi";
import {FiLoader} from "react-icons/fi";
import {FaCartPlus, FaPlusCircle} from "react-icons/fa";

import AOS from "aos";
import "aos/dist/aos.css";

const ProductDetails = ({productId}) => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const {selectedProduct, loading, error, similarProducts} = useSelector(
    (state) => state.products
  );
  const {user, guestId} = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const productfetchId = productId || id;

  useEffect(() => {
    AOS.init({
      duration: 500,
      offset: 50,
      mirror: true,
    });
    if (productfetchId) {
      dispatch(fetchProductDetails(productfetchId));
      dispatch(fetchSimilarProducts({id: productfetchId}));
    }
  }, [dispatch, productfetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    const needsSize = selectedProduct?.sizes?.length > 0; // Check if sizes exist
    const needsColor = selectedProduct?.colors?.length > 0; // Check if colors exist

    // If a size or color is required but not selected, show an error
    if ((needsSize && !selectedSize) || (needsColor && !selectedColor)) {
      toast.error(
        "Please select the required options before adding to the cart.",
        {
          duration: 1000,
        }
      );
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productfetchId,
        quantity,
        size: needsSize ? selectedSize : null,
        color: needsColor ? selectedColor : null,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <BiLoaderAlt className="animate-spin text-[100px] text-blue-900" />
      </div>
    );
  if (error) return toast.error(error.message);

  return (
    <div className="p-6">
      {selectedProduct && (
        <div
          className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow"
          data-aos="fade-up"
        >
          <div className="flex flex-col md:flex-row">
            {/* left thumbnails */}
            <div
              className="hidden md:flex flex-col space-y-4 mr-6"
              data-aos="fade-down"
            >
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => setMainImage(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border 
          ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2" data-aos="zoom-in">
              <div className="mb-4">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt="Main product"
                    className="w-full h-auto object-cover shadow-md rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Mobile Thumbnails */}
            <div
              className="md:hidden flex overflow-x-scroll space-x-4 mb-4"
              data-aos="fade-up"
            >
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => setMainImage(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border 
          ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                />
              ))}
            </div>

            {/* Right Side */}
            <div className="md:w-1/2 md:ml-10" data-aos="fade-up">
              <h1
                className="text-2xl md:text-3xl font-semibold mb-4"
                data-aos="fade-down"
              >
                {selectedProduct.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <p className="text-xl text-gray-500 ">
                  LE {selectedProduct.price}
                </p>
                {selectedProduct.discountPrice > 0 && (
                  <p className="text-md text-black bg-yellow-300 px-1 py-0.5 rounded-md">
                    SAVE <s>LE {`${selectedProduct.discountPrice}`} </s>
                  </p>
                )}
              </div>

              <p
                className="text-gray-600 text-[16px] mb-4"
                data-aos="fade-down"
              >
                {selectedProduct.description}
              </p>

              {selectedProduct.colors.length > 0 && (
                <div className="mb-4" data-aos="fade-up">
                  <p className="text-gray-700">Color:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProduct?.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border
                       ${
                         selectedColor === color
                           ? "border-4 border-black scale-130 transition-all"
                           : "border-gray-300"
                       }`}
                        style={{
                          backgroundColor: color.toLocaleLowerCase(),
                          filter: "brightness(0.5)",
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.sizes.length > 0 && (
                <div className="mb-4" data-aos="fade-up">
                  <p className="text-gray-700">Size:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded border border-gray-300 transition-all
                    ${selectedSize === size ? "bg-black text-white" : ""}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6 " data-aos="fade-up">
                <p className="text-gray-700">Quantity:</p>
                <div
                  className="flex items-center space-x-4 mt-2 bg-white shadow-md border 
                  border-gray-300 rounded-full w-fit px-4 py-1 "
                >
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-2 py-1  rounded text-xl"
                  >
                    {loading ? (
                      <BiLoaderAlt className="animate-spin text-[24px]" />
                    ) : (
                      "-"
                    )}
                  </button>
                  <span className="text-xl">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-2 py-1  rounded text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className="px-4 py-1.5 flex items-center justify-center text-xl space-x-2 rounded-md text-white  w-full mb-4
                bg-gradient-to-r from-[#7e60bf] to-[#433878] hover:from-[#433878] hover:to-[#7e60bf]
                transition-all duration-300 transform hover:scale-110 hover:rotate-2 shadow-lg hover:shadow-indigo-500/50 group"
              >
                {isButtonDisabled ? (
                  <FiLoader className="inline-block animate-spin text-white text-xl" />
                ) : (
                  <>
                    <span className="font-semibold tracking-wide">
                      Add to Cart
                    </span>
                    <span className="animate-pulse group-hover:animate-ping">
                      <BiShoppingBag className="text-[22px]" />
                    </span>
                  </>
                )}
              </button>

              <div className="mt-10 text-gray-700" data-aos="fade-up">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Matreial</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {!isHomePage && similarProducts?.length > 0 && (
            <div className="mt-20" data-aos="fade-up">
              <h2 className="text-2xl text-center font-medium mb-4">
                You May Also Like
              </h2>
              <ProductGrid
                products={similarProducts}
                loading={loading}
                error={error}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
