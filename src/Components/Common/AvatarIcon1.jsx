import { IoPersonSharp } from "react-icons/io5";
import { useUserImage } from "../../hooks/useUserImage";
export default function AvatarIcon({
  user,
  /** When false, only the circle is shown (feed cards already render the name beside). */
  showLabel = true,
  handle,
  ref,
  className,
  size = "40",
}) {
  const { data: sessionUserImage } = useUserImage();
  const fromProfile =
    user?.imageUrl ||
    user?.profileImageUrl ||
    user?.imageUrl1 ||
    user?.image ||
    user?.avatarUrl ||
    user?.profilePictureUrl ||
    "";
  // Only use the logged-in user's image when no `user` (e.g. compose box, header without prop).
  const fromSession =
    user == null
      ? sessionUserImage?.imageUrl1 || sessionUserImage?.imageUrl || ""
      : "";
  const imageUrl = fromProfile || fromSession || "";
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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="User avatar"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "User",
              )}&background=316BE8&color=fff`;
            }}
            className="w-full h-full object-contain bg-white"
          />
        ) : (
          <IoPersonSharp
            style={{
              width: `${size - 10}px`,
              height: `${size - 10}px`,
              bottom: `${-size / 10}px`,
            }}
            className="absolute  left-1/2 translate-x-[-50%] text-white "
          />
        )}
      </div>
      {user && showLabel && (
        <p className="font-semibold truncate">
          {user?.firstName} {user?.lastName}
        </p>
      )}
    </div>
  );
}
