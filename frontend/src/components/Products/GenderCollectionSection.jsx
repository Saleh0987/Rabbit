import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Correct imports
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'swiper/swiper-bundle.css';

import mensCollectionImage from '../../assets/mens-collection.webp';
import womensCollectionImage from '../../assets/graf.jpg';

// Sample collections
const additionalCollections = [
  {
    id: 1,
    image: womensCollectionImage,
    title: "Sticker's Collection",
    link: '/collection/all?category=Stickers',
  },
  {
    id: 2,
    image: mensCollectionImage,
    title: "Men's Collection",
    link: '/collection/all?gender=Men',
  },
  {
    id: 3,
    image: womensCollectionImage,
    title: "Sticker's Collection",
    link: '/collection/all?category=Stickers',
  },
  {
    id: 4,
    image: mensCollectionImage,
    title: "Men's Collection",
    link: '/collection/all?gender=Men',
  },
];

const GenderCollectionSection = () => {
  useEffect(() => {
    AOS.init({
        duration: 1000, 
        offset: 50, 
        mirror: true, 
        });
  }, []);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto bg-white  rounded-xl shadow py-8 text-center" data-aos="fade-up">
        <h2 className="text-4xl font-semibold mb-4">Explore Our <span className="text-maincolor">Collections</span> </h2>
         <p className="text-lg text-gray-600 mb-8" data-aos="fade-up">
          Discover the latest styles straight off the runway, <br />
          freshly added to keep your wardrobe on the cutting edge of fashion.
        </p>
        <div className="mt-10 p-4">
          <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: '.swiper-pagination', 
          }}
          breakpoints={{
            524: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}>
          {additionalCollections.map((collection) => (
            <SwiperSlide key={collection.id} className='cursor-pointer'>
              <div
                className="relative flex-1"
                data-aos="zoom-in" >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                />
                <div
                  className="absolute bottom-8 left-8 bg-white/90 p-4 rounded-md shadow"
                  data-aos="fade-up" >
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {collection.title}
                  </h2>
                  <Link
                    to={collection.link}
                    className="text-gray-900 underline hover:text-maincolor transition-all">
                    Shop Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
        </div>
    </section>
  );
};

export default GenderCollectionSection;
