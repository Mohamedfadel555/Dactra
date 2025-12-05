import { IoPersonSharp } from "react-icons/io5";
export default function AvatarIcon({
  user,
  handle,
  ref,
  className,
  size = "40",
}) {
  return (
    <div className={`${className && className}  flex items-center gap-3`}>
      <div
        ref={ref}
        onClick={handle}
        className={`${
          !user && "cursor-pointer"
        }  overflow-hidden  rounded-full bg-gray-200 border-2 border-blue-500 flex relative `}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <IoPersonSharp
          style={{
            width: `${size - 10}px`,
            height: `${size - 10}px`,
            bottom: `${-size / 10}px`,
          }}
          className="absolute  left-1/2 translate-x-[-50%] text-white "
        />
      </div>
      {user && (
        <p className="font-semibold truncate">
          {user?.firstName} {user?.lastName}
        </p>
      )}
    </div>
  );
}
