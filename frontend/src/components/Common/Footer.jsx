import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/newww-10.png";
import axios from "axios";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaVoicemail, FaWhatsapp } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        { email }
      );
      setMessage({ type: "success", text: response.data.message });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    }
  };

  return (
    <footer className="border-t border-gray-300 bg-gray-900 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        {/* Newsletter */}
        <div>
          <Link to="/" className="flex items-center text-white mb-4">
            <img src={logo} alt="logo" className="w-16 sm:w-32" />
          </Link>
          <p className="text-gray-500 mb-4">
            Delivering exceptional sticker solutions with quality and unique
            design to make your stickers stand out.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h1 className="text-2xl mb-6">Shop</h1>
          <ul className="space-y-2">
            {["Products", "Stickers", "Mugs", "T-Shirts", "Logos"].map(
              (item) => (
                <li key={item}>
                  <Link to="#" className="hover:text-gray-500 transition-colors">
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-2xl mb-6">Support</h3>
          <ul className="space-y-2">
            {["Contact Us", "About Us", "FAQs", "Features"].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-gray-500 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us & Newsletter */}
        <div>
          <h3 className="text-2xl mb-6">Follow us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <Link to={'https://www.facebook.com/grafica.adv/'} target='_blank'>
              <FaFacebook className='w-6 h-6 text-blue-500 cursor-pointer' />
            </Link>
            <Link to={'https://www.instagram.com/grafica_eg/'} target='_blank'>
              <FaInstagram className='w-6 h-6 text-pink-500 cursor-pointer' />
            </Link>
            <a href='https://wa.me/201010759472' target='_blank' rel='noopener noreferrer'>
              <FaWhatsapp className='w-6 h-6 text-green-400 cursor-pointer' />
            </a>
          </div>
          <p className="mb-8">
            <FiPhoneCall className="inline-block mr-2" />
            <a href='tel:+201202210771' className='text-secColor text-xl'>+201202210771</a>
          </p>
          <div className="flex items-center  mb-8">
            <MdAttachEmail  className="inline-block mr-2" />
            <a
                href={`mailto:aya.magdy.artist@gmail.com`}
                target={"_blank"}
                title="Gmail"
                className='block mb-1 text-white'
                rel="noreferrer"
              >aya.magdy.artist@gmail.com</a>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex gap-2">
            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
              <div className="relative w-full"> <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"> </path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
              </div>
                <input className="block p-3 pl-10 w-full text-sm text-white bg-gray-900 rounded-lg border 
                border-gray-300 sm:rounded-none sm:rounded-l-lg focus: outline-none placeholder:text-white"
                  placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <button
                  type="submit"
                  className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border 
                  bg-blue-500 cursor-pointer border-primary-600 sm:rounded-none sm:rounded-r-lg focus:outline-none">
                  Subscribe
                </button>
          </div>
          </div>
          </form>
          {message.text && (
            <div
              className={`mt-4 p-3 text-sm rounded-lg ${
                message.type === "success"
                  ? "text-white bg-green-500"
                  : "text-red-600 bg-red-100 border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-white text-sm text-center">
          &copy; 2025, Grafica Store. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
