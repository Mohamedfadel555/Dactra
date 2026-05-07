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
import { MdVerified, MdScience } from "react-icons/md";
import { RiMicroscopeFill } from "react-icons/ri";

const categories = [
  { id: "all", label: "الكل", icon: FaHeartbeat },
  { id: "doctors", label: "الأطباء", icon: FaUserMd },
  { id: "labs", label: "معامل تحاليل", icon: FaFlask },
  { id: "radiology", label: "معامل أشعة", icon: FaXRay },
];

const favorites = [
  {
    id: 1,
    type: "doctors",
    name: "د. أحمد محمود السيد",
    specialty: "استشاري قلب وأوعية دموية",
    rating: 4.9,
    reviews: 312,
    location: "المعادي، القاهرة",
    phone: "01001234567",
    hours: "السبت - الخميس، 10ص - 8م",
    verified: true,
    available: true,
    image: null,
    initials: "أم",
    color: "from-blue-500 to-blue-700",
    price: "٣٠٠ جنيه",
    waitTime: "١٥ دقيقة",
  },
  {
    id: 2,
    type: "labs",
    name: "معمل البيان للتحاليل الطبية",
    specialty: "تحاليل دم • هرمونات • بكتيريا",
    rating: 4.7,
    reviews: 215,
    location: "مدينة نصر، القاهرة",
    phone: "01112345678",
    hours: "يومياً، 7ص - 11م",
    verified: true,
    available: true,
    image: null,
    initials: "بي",
    color: "from-sky-400 to-cyan-600",
    price: "يبدأ من ٥٠ جنيه",
    waitTime: "٣٠ دقيقة",
  },
  {
    id: 3,
    type: "radiology",
    name: "مركز النور للأشعة التشخيصية",
    specialty: "أشعة مقطعية • رنين مغناطيسي • سونار",
    rating: 4.8,
    reviews: 189,
    location: "الزمالك، القاهرة",
    phone: "01223456789",
    hours: "السبت - الجمعة، 8ص - 10م",
    verified: true,
    available: false,
    image: null,
    initials: "نو",
    color: "from-indigo-500 to-blue-800",
    price: "يبدأ من ٢٠٠ جنيه",
    waitTime: "٤٥ دقيقة",
  },
  {
    id: 4,
    type: "doctors",
    name: "د. سارة خالد إبراهيم",
    specialty: "استشاري نساء وتوليد",
    rating: 4.95,
    reviews: 428,
    location: "الدقي، الجيزة",
    phone: "01334567890",
    hours: "الأحد - الخميس، 12م - 9م",
    verified: true,
    available: true,
    image: null,
    initials: "سخ",
    color: "from-blue-400 to-blue-600",
    price: "٤٠٠ جنيه",
    waitTime: "٢٠ دقيقة",
  },
  {
    id: 5,
    type: "labs",
    name: "معمل الشفاء المركزي",
    specialty: "PCR • فيروسات • حساسية • سكر",
    rating: 4.6,
    reviews: 304,
    location: "شبرا، القاهرة",
    phone: "01445678901",
    hours: "يومياً، 6ص - 12م",
    verified: false,
    available: true,
    image: null,
    initials: "شف",
    color: "from-cyan-500 to-blue-500",
    price: "يبدأ من ٣٠ جنيه",
    waitTime: "٢٠ دقيقة",
  },
  {
    id: 6,
    type: "radiology",
    name: "مركز الرؤية للأشعة",
    specialty: "أشعة عادية • طبقي محوري • تصوير أسنان",
    rating: 4.5,
    reviews: 97,
    location: "هليوبوليس، القاهرة",
    phone: "01556789012",
    hours: "السبت - الخميس، 9ص - 9م",
    verified: true,
    available: true,
    image: null,
    initials: "رؤ",
    color: "from-blue-600 to-indigo-700",
    price: "يبدأ من ١٥٠ جنيه",
    waitTime: "٣٥ دقيقة",
  },
];

const typeIcon = {
  doctors: FaUserMd,
  labs: RiMicroscopeFill,
  radiology: FaXRay,
};
const typeLabel = {
  doctors: "طبيب",
  labs: "معمل تحاليل",
  radiology: "معمل أشعة",
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

export default function MedicalFavorites() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [favorited, setFavorited] = useState(favorites.map((f) => f.id));
  const [selected, setSelected] = useState(null);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorited((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filtered = favorites.filter((f) => {
    const matchCat = activeCategory === "all" || f.type === activeCategory;
    const matchSearch =
      f.name.includes(search) ||
      f.specialty.includes(search) ||
      f.location.includes(search);
    const matchFav = favorited.includes(f.id);
    return matchCat && matchSearch && matchFav;
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white font-sans"
      style={{ fontFamily: "'Cairo', 'Tajawal', Arial, sans-serif" }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-sky-200 rounded-full opacity-30 blur-2xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-50 rounded-full opacity-60 blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-blue-100 shadow-sm"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-900 leading-tight">
                مفضلتي
              </h1>
              <p className="text-xs text-blue-400">
                {favorited.length} عنصر محفوظ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors relative"
            >
              <FaBell className="text-base" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-28">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 mb-4"
        >
          <div className="relative">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في مفضلتك..."
              className="w-full bg-white border border-blue-100 rounded-2xl pr-11 pl-4 py-3.5 text-sm text-blue-900 placeholder-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileTap={{ scale: 0.94 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-md shadow-blue-200"
                    : "bg-white text-blue-400 border-blue-100 hover:border-blue-300"
                }`}
              >
                <Icon className={isActive ? "text-white" : "text-blue-300"} />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-blue-400">{filtered.length} نتيجة</p>
          <motion.button
            whileTap={{ scale: 0.93 }}
            className="flex items-center gap-1.5 text-xs text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaFilter className="text-xs" />
            فرز وتصفية
            <FaChevronDown className="text-xs" />
          </motion.button>
        </div>

        {/* Cards Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
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
                لا يوجد عناصر محفوظة
              </p>
              <p className="text-blue-200 text-sm mt-1">
                ابدأ بإضافة أطباء ومعامل لمفضلتك
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
              {filtered.map((item) => {
                const Icon = typeIcon[item.type];
                const isFav = favorited.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    layout
                    exit="exit"
                    onClick={() => setSelected(item)}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 12px 40px rgba(59,130,246,0.13)",
                    }}
                    className="bg-white rounded-3xl border border-blue-50 shadow-sm overflow-hidden cursor-pointer group"
                  >
                    {/* Card top bar */}
                    <div
                      className={`h-1.5 w-full bg-gradient-to-r ${item.color}`}
                    />

                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                        >
                          <span className="text-white font-bold text-xl">
                            {item.initials}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-blue-900 font-bold text-sm leading-tight">
                                  {item.name}
                                </h3>
                                {item.verified && (
                                  <MdVerified className="text-blue-500 text-base flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-blue-400 text-xs mt-0.5 truncate">
                                {item.specialty}
                              </p>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={(e) => toggleFavorite(item.id, e)}
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

                          {/* Rating & Type */}
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.type === "doctors"
                                  ? "bg-blue-50 text-blue-600"
                                  : item.type === "labs"
                                    ? "bg-cyan-50 text-cyan-600"
                                    : "bg-indigo-50 text-indigo-600"
                              }`}
                            >
                              <Icon className="text-xs" />
                              {typeLabel[item.type]}
                            </span>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-amber-400 text-xs" />
                              <span className="text-blue-800 font-bold text-xs">
                                {item.rating}
                              </span>
                              <span className="text-blue-300 text-xs">
                                ({item.reviews})
                              </span>
                            </div>
                            <span
                              className={`text-xs font-medium ${item.available ? "text-emerald-500" : "text-red-400"}`}
                            >
                              ● {item.available ? "متاح" : "مغلق"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="mt-3 pt-3 border-t border-blue-50 grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-blue-400">
                          <FaMapMarkerAlt className="text-blue-300 flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-blue-400">
                          <FaClock className="text-blue-300 flex-shrink-0" />
                          <span className="truncate">
                            {item.waitTime} انتظار
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm shadow-blue-200 hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                          <FaCalendarAlt />
                          حجز موعد
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
                        >
                          <FaPhone />
                          اتصال
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 24 }}
        className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-t border-blue-100 shadow-xl"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-around px-6 py-3">
          {[
            { icon: FaHome, label: "الرئيسية", active: false },
            { icon: FaSearch, label: "بحث", active: false },
            { icon: FaBookmark, label: "مفضلتي", active: true },
            { icon: FaUser, label: "حسابي", active: false },
          ].map((nav) => (
            <motion.button
              key={nav.label}
              whileTap={{ scale: 0.88 }}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                nav.active ? "text-blue-600" : "text-blue-300"
              }`}
            >
              <div
                className={`p-2 rounded-xl ${nav.active ? "bg-blue-100" : ""}`}
              >
                <nav.icon
                  className={`text-lg ${nav.active ? "text-blue-600" : "text-blue-300"}`}
                />
              </div>
              <span
                className={`text-xs font-semibold ${nav.active ? "text-blue-600" : "text-blue-300"}`}
              >
                {nav.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-30 bg-blue-900/30 backdrop-blur-sm"
            />
            <motion.div
              key="modal"
              dir="rtl"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl max-w-2xl mx-auto"
              style={{ fontFamily: "'Cairo', 'Tajawal', Arial, sans-serif" }}
            >
              <div
                className={`h-2 w-full rounded-t-3xl bg-gradient-to-r ${selected.color}`}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-xl">
                        {selected.initials}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-blue-900 font-bold text-base">
                          {selected.name}
                        </h2>
                        {selected.verified && (
                          <MdVerified className="text-blue-500 text-lg" />
                        )}
                      </div>
                      <p className="text-blue-400 text-sm">
                        {selected.specialty}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <FaStar className="text-amber-400 text-xs" />
                        <span className="text-blue-800 font-bold text-xs">
                          {selected.rating}
                        </span>
                        <span className="text-blue-300 text-xs">
                          ({selected.reviews} تقييم)
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setSelected(null)}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors">
                      <FaTimes />
                    </div>
                  </motion.button>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { icon: FaMapMarkerAlt, label: selected.location },
                    { icon: FaPhone, label: selected.phone },
                    { icon: FaClock, label: selected.hours },
                    {
                      icon: FaCalendarAlt,
                      label: `وقت الانتظار: ${selected.waitTime}`,
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm text-blue-700"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <row.icon className="text-blue-400 text-sm" />
                      </div>
                      {row.label}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-blue-50 rounded-2xl px-4 py-3 mb-5">
                  <span className="text-blue-500 text-sm font-medium">
                    السعر
                  </span>
                  <span className="text-blue-800 font-bold">
                    {selected.price}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-blue-200 hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt />
                  احجز موعداً الآن
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
