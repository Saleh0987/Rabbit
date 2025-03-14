import {
  HiArrowPathRoundedSquare,
  HiShoppingBag,
  HiOutlineCreditCard,
} from "react-icons/hi2";

const features = [
  {
    Icon: HiShoppingBag,
    title: "FREE SHIPPING",
    description: "On all orders over 500.00 EGP",
  },
  {
    Icon: HiArrowPathRoundedSquare,
    title: "45 DAYS RETURN",
    description: "Money back guarantee",
  },
  {
    Icon: HiOutlineCreditCard,
    title: "SECURE CHECKOUT",
    description: "100% secured checkout process",
  },
];

const FeaturesSection = () => (
  <section className="py-16 px-4">
    <div className="container mx-auto bg-white rounded-3xl text-center shadow py-6">
      <h2 className="text-4xl font-semibold">
        Our <span className="text-maincolor">Services</span>
      </h2>
      <p className="text-gray-500 mt-2">Get Informed with our Services.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {features.map(({Icon, title, description}, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 group hover:scale-105 transition-all shadow-2xl">
            <div className="p-4 rounded-full mb-4 transform transition-transform duration-500 group-hover:rotate-360">
              <Icon className="text-[40px] text-maincolor" />
            </div>
            <h2 className="tracking-tighter mb-2">{title}</h2>
            <p className="text-gray-600 text-sm tracking-tighter">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
