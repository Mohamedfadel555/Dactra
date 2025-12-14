import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import Bar from "./ReviewBar";
import { FaStar, FaRegStar } from "react-icons/fa";
import { BiChevronRight } from "react-icons/bi";

export default function ReviewsDetailsSection({
  NumOfReviews,
  avgRating,
  addFlag = true,
  data,
}) {
  return (
    <div
      className="w-full flex flex-col gap-5 justify-center items-center 
        shadow-[0_4px_25px_rgba(0,0,0,0.08)] rounded-2xl p-6 sm:p-8 bg-white"
    >
      <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4 sm:gap-0">
        <BrandLogo />

        {addFlag ? (
          <Link className="text-[16px] sm:text-[20px] text-[#567CFE] font-bold">
            Add Review+
          </Link>
        ) : (
          <>
            {NumOfReviews !== 0 && (
              <Link className="text-[16px] sm:text-[20px] text-[#567CFE] font-bold">
                <div className="flex justify-center items-center ">
                  See more
                  <BiChevronRight className="text-[20px] sm:text-[30px]" />
                </div>
              </Link>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row w-full justify-between items-center gap-8 md:gap-[100px] mt-4">
        <div className="md:flex-3 flex flex-col justify-between items-center w-full md:w-[300px] lg:w-[400px]">
          {Object.entries(data).map(([key, value]) => (
            <Bar number={key} percent={value} />
          ))}
        </div>

        <div className="flex flex-col justify-center items-center gap-2 md:gap-4">
          <h2 className="text-[60px] sm:text-[80px] md:text-[100px] font-bold">
            {avgRating}
          </h2>
          <div className="flex justify-center items-center gap-1 sm:gap-2">
            {Array.from({ length: Math.ceil(avgRating) }).map((i) => (
              <FaStar key={i} className="text-[#EAB308] text-[18px]" />
            ))}
            {Array.from({ length: 5 - Math.ceil(avgRating) }).map((i) => (
              <FaRegStar key={i} className="text-[#EAB308] text-[18px]" />
            ))}
          </div>
          {NumOfReviews !== 0 ? (
            <p className="text-[#868686] text-[14px] sm:text-[16px] mt-1 sm:mt-2">
              {NumOfReviews + " Reviews"}
            </p>
          ) : (
            <p className="text-red-600 text-[14px] sm:text-[16px] mt-1 sm:mt-2">
              No ratings yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
