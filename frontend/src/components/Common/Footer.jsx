import {FiPhoneCall} from "react-icons/fi";
import {Link} from "react-router-dom";
import {FaFacebook, FaInstagram, FaWhatsapp} from "react-icons/fa";
import {MdAttachEmail} from "react-icons/md";
import axios from "axios";
import {useState} from "react";
import logo from "../../assets/newww-10.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({type: "", text: ""});

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        {email}
      );
      setMessage({type: "success", text: response.data.message});
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setTimeout(() => setMessage({type: "", text: ""}), 2000);
    }
  };

  const links = [
    {
      title: "Shop",
      items: ["Products", "Stickers", "Mugs", "T-Shirts", "Logos"],
    },
    {title: "Support", items: ["Contact Us", "About Us", "FAQs", "Features"]},
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/grafica.adv/",
      icon: <FaFacebook className="text-blue-500 w-6 h-6" />,
    },
    {
      href: "https://www.instagram.com/grafica_eg/",
      icon: <FaInstagram className="text-pink-500 w-6 h-6" />,
    },
    {
      href: "https://wa.me/201010759472",
      icon: <FaWhatsapp className="text-green-400 w-6 h-6" />,
    },
  ];

  return (
    <footer className="border-t border-gray-300 bg-gray-900 text-white py-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <Link
            to="/"
            className="flex items-center mb-4 hover:scale-105 transition-all"
          >
            <img src={logo} alt="logo" className="w-24 sm:w-32" />
          </Link>
          <p className="text-gray-500">
            Delivering exceptional sticker solutions with quality and unique
            design.
          </p>
        </div>

        {links.map(({title, items}) => (
          <div key={title}>
            <h3 className="text-2xl mb-6">{title}</h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <Link to="#" className="hover:text-gray-500 transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-2xl mb-6">Follow us</h3>
          <div className="flex space-x-4 mb-6">
            {socialLinks.map(({href, icon}, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                className="hover:scale-125 transition-all"
                rel="noopener noreferrer"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="mb-8 hover:scale-105 transition-all">
            <FiPhoneCall className="inline-block mr-2" />
            <a href="tel:+201202210771" className="text-xl">
              +201202210771
            </a>
          </p>
          <p className="mb-8 hover:scale-105 transition-all">
            <MdAttachEmail className="inline-block mr-2" />
            <a href="mailto:aya.magdy.artist@gmail.com" className="text-white">
              grafica.adv2022@gmail.com
            </a>
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-4">
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <input
            className="p-3 w-full bg-gray-900 border rounded-lg placeholder-white focus:outline-none"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="relative inline-flex h-12 active:scale-95 transistion overflow-hidden rounded-lg p-[1px] focus:outline-none"
          >
            <span
              className="inline-flex h-full w-full cursor-pointer items-center justify-center 
              rounded-lg bg-maincolor px-7 text-xl font-medium text-white backdrop-blur-3xl gap-2 undefined"
            >
              Subscribe
            </span>
          </button>
        </form>
        {message.text && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
      <div className="mt-4 border-t pt-6 text-center">
        <p className="text-sm">
          &copy; 2025, Grafica Store. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
