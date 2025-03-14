import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomLeft, HiBars3BottomRight } from 'react-icons/hi2';
import CartDrawer from "../Layout/CartDrawer";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import logo from "../../assets/newww-05.png";
import Searchbar from "./SearchBar/Searchbar";


const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // For scroll state
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`${
          isScrolled
            ? "fixed top-[3rem] w-full bg-white shadow-md z-40"
            : "relative bg-transparent"
          } transition-all duration-300`}>
        
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Nav Drawer Toggle */}
          <button onClick={toggleNavDrawer}>
            <HiBars3BottomLeft className="h-6 w-6 sm:w-8 sm:h-8  text-maincolor" />
          </button>

          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="logo"
                className="w-[8rem] h-[4rem] sm:w-[12rem] sm:h-[5rem]"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden space-x-6">
            <Link
              to="/collection/all"
              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Shop
            </Link>
            <Link
              to="/collection/all?category=Stickers"
              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Stickers
            </Link>
            <Link
              to="/collection/all?category=Mugs"
              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Mugs
            </Link>
            <Link
              to="/collection/all?category=T-Shirts"
              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              T-Shirts
            </Link>
            <Link
              to="/collection/all?category=logos"
              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Logos
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="block bg-maincolor p-1 px-2 rounded text-sm text-white">
                Admin
              </Link>
            )}
            <Link className="hover:text-black" to="/profile">
              <HiOutlineUser className="h-6 w-6 sm:w-8 sm:h-8 text-maincolor" />
            </Link>
            <button
              onClick={toggleCartDrawer}
              className="relative hover:text-black cursor-pointer">
              <HiOutlineShoppingBag className="h-6 w-6 sm:w-8 sm:h-8 text-maincolor" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5">
                  {cartItemCount}
                </span>
              )}
            </button>
            <div className="overflow-hidden">
              <Searchbar />
            </div>

          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Nav */}
      <div
  className={`fixed bottom-4 left-4 w-3/4 sm:w-1/2 md:w-[20rem] h-[600px] rounded-xl blur-effect-theme 
    shadow-lg transform transition-all duration-300 flex flex-col z-50
    ${
      navDrawerOpen
        ? "translate-y-0 opacity-100 scale-100 pointer-events-auto visible"
        : "translate-y-full opacity-0 scale-95 pointer-events-none invisible"
    }`}
>
  <div className="flex justify-start p-4">
    <button
      onClick={toggleNavDrawer}
      className="cursor-pointer border border-purple-500 p-1 rounded-full">
      <IoMdClose className="h-6 w-6 text-gray-600 hover:h-8 hover:w-8 transition-all" />
    </button>
  </div>

  <div className="p-8">
    <h2 className="text-2xl font-semibold mb-4">Menu</h2>
    <nav className="space-y-4">
      <Link
        to="/collection/all"
        onClick={toggleNavDrawer}
        className="block text-gray-600 hover:text-black text-xl"
      >
        Shop
      </Link>
      <Link
        to="/collection/all?category=Stickers"
        onClick={toggleNavDrawer}
        className="block text-gray-600 hover:text-black text-xl"
      >
        Stickers
      </Link>
      <Link
        to="/collection/all?category=Mugs"
        onClick={toggleNavDrawer}
        className="block text-gray-600 hover:text-black text-xl"
      >
        Mugs
      </Link>
      <Link
        to="/collection/all?category=T-Shirts"
        onClick={toggleNavDrawer}
        className="block text-gray-600 hover:text-black text-xl"
      >
        T-Shirts
      </Link>
      <Link
        to="/collection/all?category=logos"
        onClick={toggleNavDrawer}
        className="block text-gray-600 hover:text-black text-xl"
      >
        Logos
      </Link>
    </nav>
  </div>
</div>

    </>
  );
};

export default Navbar;
