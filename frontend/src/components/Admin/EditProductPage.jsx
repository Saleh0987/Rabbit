import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";

import axios from "axios";
import { updateProduct } from "../../redux/slices/adminProductSlice";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
 const [productsData, setProductsData] = useState({
  name: "",
  description: "",
  price: 0,
  countInStock: 0,
  sku: "",
  category: "",
  brand: "",
  sizes: [],
  colors: [],
  collections: "",
  material: "",
  gender: "",
  images: [],
 });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (selectedProduct) {
      setProductsData(selectedProduct);
    }
  }, [selectedProduct]);
  
 const handleChange = (e) => {
  const { name, value } = e.target;
  setProductsData((prevData) => ({ ...prevData, [name]: value }));
 }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { 
          headers: {
            "Content-Type": "multipart/form-data",
          }
        },
      );
      setProductsData((prevData) => ({
        ...prevData,
        images: [...prevData.images, {url: data.imageUrl, altText:""}],
      }))
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  }; 

 const handleSubmit = (e) => {
   e.preventDefault();
   dispatch(updateProduct({ id, productData: productsData }));
   navigate("/admin/products");
 }

  
  if (loading) return <p>Loading ....</p>
  if(error) return <p>Error: {error}</p>
  
  
  return (
   <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
    <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
    <form onSubmit={handleSubmit}> 

     {/* name */}
     <div className="mb-6">
      <label className="block font-semibold mb-2">Product Name</label>
      <input
       type="text"
       name="name"
       value={productsData.name}
       onChange={handleChange}
       className="w-full border border-gray-300 rounded-md p-2"
       required/>
     </div>

     {/* description */}
     <div className="mb-6">
      <label className="block font-semibold mb-2">Description</label>
      <textarea name="description" value={productsData.description}
       className="w-full border border-gray-300 rounded-md p-2"
       rows={4}
       onChange={handleChange}
       required
      />
     </div>

     {/* price */}
      <div className="mb-6">
      <label className="block font-semibold mb-2">Price</label>
      <input
       type="number"
       name="price"
       value={productsData.price}
       onChange={handleChange}
       className="w-full border border-gray-300 rounded-md p-2"
       required/>
     </div>

     {/* count In Stock */}
      <div className="mb-6">
      <label className="block font-semibold mb-2">Count in Stock</label>
      <input
       type="number"
       name="countInStock"
       value={productsData.countInStock}
       onChange={handleChange}
       className="w-full border border-gray-300 rounded-md p-2"
       required/>
     </div>

     {/* sku */}
      <div className="mb-6">
      <label className="block font-semibold mb-2">SKU</label>
      <input
       type="text"
       name="sku"
       value={productsData.sku}
       onChange={handleChange}
       className="w-full border border-gray-300 rounded-md p-2"
       required/>
     </div>

      {/* sizes */}
      <div className="mb-6">
      <label className="block font-semibold mb-2">Size (comma-sparated)</label>
      <input
       type="text"
       name="sizes"
       value={productsData.sizes.join(", ")}
       onChange={(e) => setProductsData({...productsData, sizes: e.target.value.split(",").map((size) => size.trim()),})}
       className="w-full border border-gray-300 rounded-md p-2"
       required/>
     </div>

     {/* colors */}
      <div className="mb-6">
      <label className="block font-semibold mb-2">Colors (comma-sparated)</label>
      <input
       type="text"
       name="colors"
       value={productsData.colors.join(", ")}
       onChange={(e) => setProductsData({...productsData, colors: e.target.value.split(",").map((color) => color.trim()),})}
       className="w-full border border-gray-300 rounded-md p-2"
       required/>
     </div>

     {/* image upload */}
     <div className="mb-6">
      <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100 cursor-pointer"/>
          {uploading && <p>Uploading...</p>}
      <div className="flex gap-4 mt-4">
       {productsData.images.map((image, index) => (
        <div key={index}>
         <img src={image.url} alt={image.altText || "Product Image"}
         className="w-20 h-20 object-cover rounded-md shadow-md"/>
         </div>
       ))}
      </div>
     </div>
     
     <button type="submit"
     className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
      Update Product
     </button>


     
    </form>
    </div>
  )
}

export default EditProductPage