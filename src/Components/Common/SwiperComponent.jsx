import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
export default function SwiperComponent({ data, Card, mapProps }) {
  return (
    <div className=" pb-[30px] overflow-hidden w-full max-w-screen-2xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 3, spaceBetween: 32 },
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          el: "#custom-swiper-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        grabCursor={true}
        className="!overflow-visible pb-20"
      >
        {data.map((ele, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: "-100px" }}
              variants={fadeUp}
              className="flex justify-center"
            >
              <Card {...mapProps(ele)} />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        id="custom-swiper-pagination"
        className=" flex justify-center gap-3 mt-10"
      ></div>

      <div className="flex justify-center gap-6 mt-12">
        <button
          type="button"
          className="swiper-button-prev-custom bg-white shadow-xl hover:shadow-2xl w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 z-10"
        >
          <svg
            className="w-7 h-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          className="swiper-button-next-custom bg-white shadow-xl hover:shadow-2xl w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 z-10"
        >
          <svg
            className="w-7 h-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
