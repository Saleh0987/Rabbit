import {useEffect, useRef, useState} from "react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {Link} from "react-router-dom";
import axios from "axios";
import {BiShoppingBag} from "react-icons/bi";
import AOS from "aos";
import "aos/dist/aos.css";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 500,
      offset: 50,
      mirror: true,
    });
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({left: scrollAmount, behaviour: "smooth"});
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  const truncateName = (name) => {
    return name.split(" ").slice(0, 3).join(" ") + "...";
  };

  return (
    <section className="py-16 px-4 lg:px-0" data-aos="fade-up">
      <div
        className={`container mx-auto text-center mb-10 relative   bg-white rounded-3xl shadow py-6`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-down">
            Explore <span className="text-maincolor">New Arrivals</span>{" "}
          </h2>

          <p className="text-lg text-gray-600 mb-8" data-aos="fade-up">
            Discover the latest styles straight off the runway, <br />
            freshly added to keep your wardrobe on the cutting edge of fashion.
          </p>

          {/* scroll btns */}
          <div className="flex justify-end my-4 space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded border 
       ${
         canScrollLeft
           ? "bg-white text-black cursor-pointer"
           : "bg-gray-200 text-gray-400 cursor-not-allowed"
       }`}
            >
              <FiChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded border 
       ${
         canScrollRight
           ? "bg-white text-black cursor-pointer"
           : "bg-gray-200 text-gray-400 cursor-not-allowed"
       }`}
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div>
        </div>

        {/* scrollable content  */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          ref={scrollRef}
          className={`container mx-auto overflow-x-hidden flex space-x-6 relative
     ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {newArrivals.map((product) => (
            <div
              data-aos="zoom-in"
              key={product._id}
              className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] rounded-md relative shadow-md"
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                draggable="false"
                className="w-full h-[300px] object-cover rounded-tr-md rounded-tl-md shadow-md"
              />

              <p className="absolute top-2 left-2 text-white font-bold bg-red-600 text-md py-.5 px-1 rounded-md">
                New
              </p>

              <Link
                to={`/products/${product._id}`}
                className="flex items-center p-2 bg-white justify-between rounded-br-md rounded-bl-md"
              >
                <div className="">
                  <h4 className="font-bold">{truncateName(product.name)}</h4>
                  <p className="mt-1 text-md text-maincolor text-start">
                    LE{" "}
                    <span className="text-red-600 font-bold">
                      {product.price}
                    </span>
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
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
