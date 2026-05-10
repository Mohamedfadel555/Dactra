import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeartbeat,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaSearch,
  FaFilter,
  FaUserMd,
  FaFlask,
  FaXRay,
  FaTimes,
  FaCalendarAlt,
  FaChevronDown,
  FaBell,
  FaHome,
  FaBookmark,
  FaUser,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { RiMicroscopeFill } from "react-icons/ri";
import { useGetFavorites } from "../../hooks/useGetFavorites";
import { useNavigate } from "react-router-dom";
import { useFavourite } from "../../hooks/useFavourite";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { type: 1, label: "Doctors", icon: FaUserMd },
  { type: 2, label: "Medical Providers", icon: FaFlask },
];

const PROVIDER_TYPE_META = {
  0: {
    label: "Lab",
    icon: RiMicroscopeFill,
    color: "bg-cyan-50 text-cyan-600",
  },
  1: {
    label: "Radiology",
    icon: FaXRay,
    color: "bg-indigo-50 text-indigo-600",
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.93, y: -10, transition: { duration: 0.22 } },
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      className="w-4 h-4 border-2 border-slate-200 border-t-blue-400 rounded-full inline-block"
    />
  );
}

// ─── LoadMore ─────────────────────────────────────────────────────────────────
function LoadMoreButton({ onClick, loading }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 rounded-xl border border-blue-100 bg-white text-sm text-blue-400 font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loading ? <Spinner /> : "Load more"}
    </motion.button>
  );
}

// ─── FavoriteCard ─────────────────────────────────────────────────────────────
function FavoriteCard({ item, activeType, onSelect, onToggle, isFav }) {
  const isDoctor = activeType === 1;
  const providerMeta = !isDoctor ? PROVIDER_TYPE_META[item.type] : null;
  const ProviderIcon = providerMeta?.icon;
  const navigate = useNavigate();
  const profileImage = item.profileImageUrl || item.imageUrl;
  console.log(item);

  return (
    <motion.div
      variants={cardVariants}
      layout
      exit="exit"
      onClick={() =>
        isDoctor
          ? navigate(`/doctor/profile/${item.id}`)
          : navigate(`/service-providers/${item.id}`)
      }
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(59,130,246,0.13)" }}
      className="bg-white rounded-3xl border border-blue-50 shadow-sm overflow-hidden cursor-pointer"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-blue-700" />

      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt={"profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">
                {item.name?.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-blue-900 font-bold text-sm leading-tight truncate">
                  {item.name}
                </h3>
                <p className="text-blue-400 text-xs mt-0.5 truncate">
                  {item.address || "—"}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(item.id);
                }}
                className="flex-shrink-0 mt-0.5"
              >
                <motion.div
                  animate={{ scale: isFav ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isFav ? (
                    <FaHeart className="text-red-400 text-xl drop-shadow-sm" />
                  ) : (
                    <FaRegHeart className="text-blue-200 text-xl" />
                  )}
                </motion.div>
              </motion.button>
            </div>

            {/* Type badge + Rating */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {isDoctor ? (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">
                  <FaUserMd className="text-xs" /> Doctor
                </span>
              ) : providerMeta ? (
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${providerMeta.color}`}
                >
                  <ProviderIcon className="text-xs" /> {providerMeta.label}
                </span>
              ) : null}

              {(item.rating != null || item.averageRating != null) && (
                <div className="flex items-center gap-1">
                  <FaStar className="text-amber-400 text-xs" />
                  <span className="text-blue-800 font-bold text-xs">
                    {isDoctor ? item.averageRating : item.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() =>
              isDoctor ? navigate(`/doctor/profile/${item.id}`) : navigate()
            }
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm shadow-blue-200 hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <FaCalendarAlt /> {isDoctor ? "Book Appointment" : "View Details"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MedicalFavorites() {
  const [activeType, setActiveType] = useState(1);
  const [selected, setSelected] = useState(null);
  const [localUnfaved, setLocalUnfaved] = useState([]);
  const { mutate: toggleFav } = useFavourite();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFavorites(activeType);

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // locally track unfavorited items until next refetch
  const items = allItems.filter((i) => !localUnfaved.includes(i.id));

  const handleToggle = (id) => {
    setLocalUnfaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

    toggleFav(id, {
      onError: () => {
        setLocalUnfaved((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
      },
    });
  };

  const isFav = (id) => !localUnfaved.includes(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white font-sans pt-[60px]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-sky-200 rounded-full opacity-30 blur-2xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-50 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-28">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mt-5 mb-6 p-1 bg-gray-100 rounded-2xl"
        >
          {TABS.map((tab) => {
            const isActive = activeType === tab.type;
            const Icon = tab.icon;
            return (
              <button
                key={tab.type}
                onClick={() => {
                  setActiveType(tab.type);
                  setLocalUnfaved([]);
                }}
                className={`relative flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-xl text-[13px] font-semibold transition-colors duration-200 cursor-pointer
                  ${isActive ? "bg-blue-500 text-white shadow" : "text-blue-400 hover:bg-blue-50"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-xl bg-blue-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon size={13} /> {tab.label}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-blue-400">{items.length} results</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="text-center py-20 text-rose-400 text-sm">
            Failed to load favorites.
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-4">
                  <FaRegHeart className="text-blue-200 text-3xl" />
                </div>
                <p className="text-blue-300 font-semibold text-lg">
                  No favorites yet
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  Start adding doctors and labs to your favorites
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {items.map((item) => (
                  <FavoriteCard
                    key={item.id}
                    item={item}
                    activeType={activeType}
                    onSelect={setSelected}
                    onToggle={handleToggle}
                    isFav={isFav(item.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {hasNextPage && (
          <div className="mt-4">
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
