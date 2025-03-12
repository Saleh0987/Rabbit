import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { question: "How durable are Sticka.eg stickers?", answer: "Our stickers are designed to be highly durable, weather-resistant, and long-lasting." },
  { question: "Can Sticka.eg stickers be used outdoors?", answer: "Yes, our stickers are waterproof and UV resistant, making them perfect for outdoor use." },
  { question: "How easy are Sticka.eg stickers to apply and remove?", answer: "They are easy to apply with a peel-and-stick design and can be removed without leaving residue." },
  { question: "What makes Sticka.eg stickers unique?", answer: "We use high-quality materials and cutting-edge printing technology to ensure vibrant colors and durability." },
  { question: "How long does shipping take for Sticka.eg stickers?", answer: "Shipping usually takes 5-7 business days, depending on your location." }
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto bg-white rounded-3xl shadow py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold">FAQ<span className="text-maincolor">s</span> </h2>
          <p className="text-gray-500 mt-2">Get Informed with our Comprehensive FAQs.</p>

          {/* FAQ Section */}
          <div className="mt-10 bg-gray-200 rounded-xl p-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-300 last:border-none">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between b items-center py-4 text-lg font-medium focus:outline-none">
                  {faq.question}
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}>
                    <FaChevronDown className="text-md bg-maincolor text-white p-1 rounded-full"/>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 pb-4">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center text-gray-600">
            <p>Our customer support is available 24/7.</p>
            <p>Average answer time: <span className="font-medium">1hr</span></p>
          </div>

          {/* Contact Button */}
          <div className="mt-4">
            <button className="bg-maincolor transition-all text-white px-6 py-3 rounded-full text-lg font-medium">
              CONTACT US
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
