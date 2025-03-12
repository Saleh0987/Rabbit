import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { createProduct } from "../../redux/slices/adminProductSlice";

const CreateProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);
 const [productsData, setProductsData] = useState({
  name: "",
  description: "",
  price: 0,
  discountPrice: 0, // New field
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
  isFeatured: false, // New field
  isPublished: false, // New field
  tags: [], // New field
  dimensions: { length: 0, width: 0, height: 0 }, // New field
});


  const [uploading, setUploading] = useState(false);


  
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
        images: [...prevData.images, {url: data.imageUrl, altText: `Image of ${productsData.name}`,}],
      }))
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  }; 

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await dispatch(createProduct(productsData)).unwrap();
    navigate("/admin/products");
  } catch (error) {
    console.error("Product creation failed:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Product creation failed.");
  }
};

  if (loading) return <p>Loading ....</p>
  if (error) return <p className="text-red-500">Error: {error}</p>;

  
  
  return (
   <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
    <h2 className="text-3xl font-bold mb-6">Create Product</h2>
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
    
    {/* material */}
     <div className="mb-6">
      <label className="block font-semibold mb-2">Material</label>
      <input
       type="text"
       name="material"
       value={productsData.material}
       onChange={handleChange}
       className="w-full border border-gray-300 rounded-md p-2"
       required/>
      </div>
        
        {/* brand */}
     <div className="mb-6">
      <label className="block font-semibold mb-2">Brand</label>
      <input
       type="text"
       name="brand"
       value={productsData.brand}
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
        
      {/* category */}
      <div className="mb-6">
      <label className="block font-semibold mb-2">Category</label>
      <input
        type="text"
        name="category"
        value={productsData.category}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2"
        required
      />
    </div>

        {/* collections */}
    <div className="mb-6">
      <label className="block font-semibold mb-2">Collections</label>
      <input
        type="text"
        name="collections"
        value={productsData.collections}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2"
        required/>
    </div>
        
        {/* gender */}
        <div className="mb-6">
        <label className="block font-semibold mb-2">Gender</label>
        <select
          name="gender"
          value={productsData.gender}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Select Gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
        </select>
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
 
        {/* discountPrice */}
     <div className="mb-6">
    <label className="block font-semibold mb-2">Discount Price</label>
    <input
      type="number"
      name="discountPrice"
      value={productsData.discountPrice}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-md p-2"
    />
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
       />
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
       />
     </div>

        {/* isFeatured */}
     <div className="mb-6 flex gap-4 items-center">
  <label className="block font-semibold">Featured</label>
  <input
    type="checkbox"
    name="isFeatured"
    checked={productsData.isFeatured}
    onChange={(e) => setProductsData({ ...productsData, isFeatured: e.target.checked })}
  />
  <label className="block font-semibold ml-4">Published</label>
  <input
    type="checkbox"
    name="isPublished"
    checked={productsData.isPublished}
    onChange={(e) => setProductsData({ ...productsData, isPublished: e.target.checked })}
  />
        </div>
        
     {/* tags */}
      <div className="mb-6">
  <label className="block font-semibold mb-2">Tags (comma-separated)</label>
  <input
    type="text"
    name="tags"
    value={productsData.tags.join(", ")}
    onChange={(e) =>
      setProductsData({
        ...productsData,
        tags: e.target.value.split(",").map((tag) => tag.trim()),
      })
    }
    className="w-full border border-gray-300 rounded-md p-2"
    required
  />
     </div>
     
    {/* length */}
    <div className="mb-6 grid grid-cols-3 gap-4">
      <div>
        <label className="block font-semibold mb-2">Length</label>
        <input
          type="number"
          name="length"
          value={productsData.dimensions?.length || ""}
          onChange={(e) =>
            setProductsData({
              ...productsData,
              dimensions: { ...productsData.dimensions, length: e.target.value },
            })
          }
          className="w-full border border-gray-300 rounded-md p-2"
          
        />
      </div>
      <div>
        <label className="block font-semibold mb-2">Width</label>
        <input
          type="number"
          name="width"
          value={productsData.dimensions?.width || ""}
          onChange={(e) =>
            setProductsData({
              ...productsData,
              dimensions: { ...productsData.dimensions, width: e.target.value },
            })
          }
          className="w-full border border-gray-300 rounded-md p-2"
          
        />
      </div>
      <div>
        <label className="block font-semibold mb-2">Height</label>
        <input
          type="number"
          name="height"
          value={productsData.dimensions?.height || ""}
          onChange={(e) =>
            setProductsData({
              ...productsData,
              dimensions: { ...productsData.dimensions, height: e.target.value },
            })
          }
          className="w-full border border-gray-300 rounded-md p-2"
          
        />
      </div>
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
      Create Product
     </button>
     
    </form>
    </div>
  )
}

export default CreateProductPage