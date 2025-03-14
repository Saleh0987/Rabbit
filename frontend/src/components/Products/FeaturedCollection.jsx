import { Link } from "react-router-dom";
import featured from '../../assets/dlv.png';
import { RiEBike2Fill } from 'react-icons/ri';
import { BsDoorOpen } from 'react-icons/bs';
import {FaCog, FaRunning, FaSpinner} from "react-icons/fa";
import { BiCycling } from "react-icons/bi";
const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-white 
    rounded-3xl shadow"
      >
        {/* Left Content */}
        <div
          className="lg:w-1/2 p-8 text-center lg:text-left"
          data-aos="fade-up"
          data-aos-anchor-placement="top-center"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            yilaaa bynaaaaaa
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Your <span className="text-maincolor">Favorite Stickers</span> On
            The Way
          </h2>
          <p className="text-md text-gray-600 mb-6">
            Enjoy Hassle-Free Shopping with Free Shipping on Orders Over 500EGP.{" "}
            <br />
            Customer Service, Reach Out Anytime for Prompt Assistance via Email
            and Social Media Channels.
          </p>

          <div className="flex items-center space-x-3 mt-[2rem]">
            <RiEBike2Fill className="w-[2rem] h-[2rem] text-maincolor animate-pulse" />
            <h1 className="text-[18px] text-black font-medium">
              Free shipping from <span className="text-maincolor">500 EGP</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3 mt-[2rem] mb-10">
            <BsDoorOpen className="w-[2rem] h-[2rem] text-maincolor animate-pulse" />
            <h1 className="text-[18px] text-black font-medium">
              Delivery on your Doorstep
            </h1>
          </div>
          <Link to="/collection/all" className="">
            <button class="relative inline-flex h-12 active:scale-95 transistion overflow-hidden rounded-lg p-[1px] focus:outline-none">
              <span
                class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
               bg-[conic-gradient(from_90deg_at_50%_50%,#FFD700_0%,#FFA500_50%,#000000_100%)]"
              ></span>
              <span
                class="inline-flex h-full w-full cursor-pointer items-center justify-center 
              rounded-lg bg-maincolor px-7 text-xl font-medium text-white backdrop-blur-3xl gap-2 undefined">
                Shop Now
                <BiCycling className="animate-ping" />
              </span>
            </button>
          </Link>
        </div>

        {/* Right Content */}
        <div
          className="lg:w-1/2"
          data-aos="fade-down"
          data-aos-anchor-placement="top-center"
        >
          <img
            src={featured}
            alt="Featured Collection"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection