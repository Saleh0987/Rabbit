import { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector} from "react-redux"
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
import Aos from "aos";
import 'aos/dist/aos.css'; 
import FAQs from "../components/Common/FAQs";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    }
      fetchBestSeller()
  }, [dispatch])

 useEffect(() => {
  const initAOS = async () => {
    const AosModule = await import("aos");
    if (AosModule) {
      Aos.init({
        duration: 1000,
        easing: "ease",
        once: false,
        anchorPlacement: "top-center",
      });
    }
  };
  initAOS();
}, []);

  return (
   <div>
      <Hero />
      
  
      <GenderCollectionSection />
      
      <NewArrivals />
      
      {/* Best seller */}
      <h2 className="text-4xl font-semibold mb-4 text-center">
        Explore Our <span className="text-maincolor">Best Products</span>
      </h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (<p className="text-center">Loading best seller product ....</p>)}

      <div className="container mx-auto my-4 p-8 lg:p-0">

        <h2 className="text-4xl font-semibold mb-8 text-center">
        Explore Our <span className="text-maincolor">Top</span> Products
      </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />
      <FAQs />
    </div>
  )
}

export default Home