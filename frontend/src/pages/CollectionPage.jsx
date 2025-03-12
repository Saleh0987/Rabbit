import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "./SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);
 
 const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
 }

 const handleClickOutside = (e) => {
  if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
   setIsSidebarOpen(false);
  }
 }
  
  useEffect(() => {
   document.addEventListener("mousedown", handleClickOutside);
   return () => {
    document.removeEventListener("mousedown", handleClickOutside);
   }
  }, [])
  


  return (
   <div className="flex flex-col lg:flex-row">
      
    {/* Filter Sidebar */}
    <div ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 
     left-0 w-[50%] md:w-[30%] shadow-md bg-white
    overflow-y-auto transition-transform duration-300 `}>
     <FilterSidebar />
    </div>

    <div className="flex-grow p-4">
       <h2 className="text-2xl uppercase mb-4 ml-4">
      {queryParams.category || queryParams.gender ? (
        <>
          <span className="font-bold">
            {queryParams.category || queryParams.gender}
          </span>{" "}
          Collection
        </>
      ) : (
        ""
      )}
    </h2>


        <div className="flex justify-end items-center gap-4">
          {/* sort options */}
        <SortOptions />
        <button onClick={toggleSidebar}
        className="border border-gray-300 rounded-md mb-4 py-1 px-4 flex justify-center items-center">
       <FaFilter className="mr-2"/> Filters
    </button>
     </div>

        {products.length > 0 ?
          <ProductGrid products={products} loading={loading} error={error} />
          : <div className="min-h-[100vh]">
            <h2 className="text-2xl text-center mb-4 ml-4">No products found.</h2>
            </div>
            }
     {/* products grid */}

    </div>
    

    </div>
  )
}

export default CollectionPage