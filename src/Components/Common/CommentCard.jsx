import { FaRegStar, FaStar } from "react-icons/fa";
export default function CommentCard({ name, photo, heading, body, starsNo }) {
  return (
    <div className="flex flex-col w-[310px] shadow-[0_3px_10px_rgba(0,0,0,0.08),0_6px_20px_rgba(0,0,0,0.06)] p-4 rounded-[20px] h-[280px] gap-[18px]">
      <div className="flex  items-center gap-[10px]">
        <img
          loading="lazy"
          alt="profile photo"
          src={photo}
          className="size-[60px] rounded-full"
        />
        <div className="flex flex-col justify-center ">
          <p className="font-bold text-[20px]">{name}</p>
          <div className="flex justify-center items-center gap-[5px]">
            {Array.from({ length: starsNo }).map((star, i) => (
              <FaStar key={i} className="text-[#EAB308] text-[18px]" />
            ))}
            {Array.from({ length: 5 - starsNo }).map((star, i) => (
              <FaRegStar key={i} className="text-[#EAB308] text-[18px]" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[20px] font-bold">{heading}</p>
      <p>{body}</p>
    </div>
  );
}
