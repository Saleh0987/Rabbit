import { useEffect, useState } from "react";

const content = [
  "Free shipping on orders over 500 EGP!",
  "New arrivals are here—Shop now!",
  "Get 20% off on your first order!",
  "Don't miss out on exclusive deals!",
];

const Topbar = () => {
  const repeatedContent = Array(100).fill(content).flat();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection
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
    <div
      className={`topbar ${
        isScrolled ? "fixed top-0 w-full bg-white shadow-md z-50" : "relative bg-transparent"
      } transition-all duration-300`}>
      <div className="marquee whitespace-nowrap overflow-hidden">
        {repeatedContent.map((item, index) => (
          <span key={index} className="px-2">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Topbar;
