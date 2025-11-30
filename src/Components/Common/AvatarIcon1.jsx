import { IoPersonSharp } from "react-icons/io5";
export default function AvatarIcon({ user, handle, ref, className }) {
  return (
    <div className={`${className && className}  flex items-center gap-3`}>
      <div
        ref={ref}
        onClick={handle}
        className={`${
          !user && "cursor-pointer"
        } size-[40px] overflow-hidden  rounded-full bg-gray-200 border-2 border-blue-500 flex relative `}
      >
        <IoPersonSharp className="size-[30px] absolute bottom-[-2px] left-1/2 translate-x-[-50%] text-white " />
      </div>
      {user && (
        <p className="font-semibold truncate">
          {user?.firstName} {user?.lastName}
        </p>
      )}
    </div>
  );
}
