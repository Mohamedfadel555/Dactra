import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useProviderAPI } from "../../api/providerAPI";
import { useFavourite } from "../../hooks/useFavourite";
import {
  MdSearch,
  MdScience,
  MdBiotech,
  MdApps,
  MdLocationOn,
} from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_ALL = "all";
const FILTER_LAB = "lab";
const FILTER_SCAN = "scan";

/* ─── Heart button ─── */
function HeartButton({ isFav, isPending, onClick }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (isPending) return;
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
      className="cursor-pointer border-none bg-transparent p-0 disabled:opacity-50 flex-shrink-0"
    >
      <AnimatePresence mode="wait">
        {isFav ? (
          <motion.div
            key="filled"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            whileTap={{ scale: 1.2 }}
          >
            <IoIosHeart className="text-[22px] text-red-500" />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            whileTap={{ scale: 1.2 }}
          >
            <IoIosHeartEmpty className="text-[22px] text-gray-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white h-[172px] animate-pulse">
      <div className="h-1 bg-slate-200 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-200 flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
          </div>
        </div>
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 0.6s ease, transform 0.6s cubic-bezier(.22,.68,0,1.2)",
      }}
      className="mb-8"
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#316BE8] bg-[#EEF3FF] px-3 py-1 rounded-full mb-3 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#316BE8] animate-pulse" />
        Medical Network
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
        Labs &amp; <span className="text-[#316BE8]">Scan Centers</span>
      </h1>
      <p className="text-gray-500 mt-2 text-base max-w-lg">
        Find certified laboratories and scan centers near you. Filter by type or
        search by name and location.
      </p>
    </div>
  );
}

/* ─── Provider card ─── */
function ServiceProviderCard({
  id,
  name,
  address,
  avg_Rating,
  type,
  imageUrl,
  animationDelay = 0,
  isFav,
  isPending,
  onToggleFav,
}) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isLab = type === 0;
  const TypeIcon = isLab ? MdScience : MdBiotech;
  const typeLabel = isLab ? "Laboratory" : "Scan Center";
  const accentColor = isLab ? "#316BE8" : "#7C3AED";
  const accentAlpha = isLab ? "rgba(49,107,232,0.09)" : "rgba(124,58,237,0.09)";

  const rating = avg_Rating != null ? Number(avg_Rating).toFixed(1) : null;

  const initials = (name || "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article
      onClick={() => id && navigate(`/service-providers/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? accentColor + "55" : "#e8edf5"}`,
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 16px 40px ${accentColor}18`
          : "0 2px 8px rgba(0,0,0,0.05)",
        transition:
          "transform 0.22s cubic-bezier(.22,.68,0,1.2), box-shadow 0.22s ease, border-color 0.2s ease",
        animation: `providerFadeUp 0.35s ease both`,
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
          opacity: hovered ? 1 : 0.6,
          transition: "opacity 0.2s",
        }}
      />

      <div
        style={{
          padding: "16px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              overflow: "hidden",
              flexShrink: 0,
              background: accentAlpha,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${accentColor}22`,
            }}
          >
            {imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={name}
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: accentColor,
                  userSelect: "none",
                }}
              >
                {initials}
              </span>
            )}
          </div>

          {/* Name + badge */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: hovered ? accentColor : "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: 5,
                transition: "color 0.18s",
              }}
            >
              {name || "Unknown"}
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                color: accentColor,
                background: accentAlpha,
                padding: "3px 9px",
                borderRadius: 999,
              }}
            >
              <TypeIcon style={{ width: 12, height: 12 }} />
              {typeLabel}
            </span>
          </div>

          {/* Heart */}
          <HeartButton
            isFav={isFav}
            isPending={isPending}
            onClick={onToggleFav}
          />
        </div>

        {/* Address */}
        {address && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 5,
              marginBottom: 12,
            }}
          >
            <MdLocationOn
              style={{
                color: "#94a3b8",
                width: 14,
                height: 14,
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <p
              style={{
                fontSize: 12,
                color: "#6b7280",
                lineHeight: 1.45,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {address}
            </p>
          </div>
        )}

        {/* Footer: rating + view details */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 10,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {/* Rating */}
          {rating ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaStar style={{ color: "#FBBF24", fontSize: 13 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                {rating}
              </span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>/ 5</span>
            </div>
          ) : (
            <span style={{ fontSize: 11, color: "#9ca3af" }}>
              No ratings yet
            </span>
          )}

          {/* View details */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              id && navigate(`/service-providers/${id}`);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: hovered ? 6 : 4,
              fontSize: 12,
              fontWeight: 600,
              color: accentColor,
              transition: "gap 0.2s ease",
            }}
          >
            View details
            <svg
              style={{
                width: 14,
                height: 14,
                transform: hovered ? "translateX(2px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <style>{`
        @keyframes providerFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
}

/* ─── Main page ─── */
export default function ServiceProvidersPage() {
  const providerAPI = useProviderAPI();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(FILTER_ALL);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [pendingFavIds, setPendingFavIds] = useState(new Set());

  const { mutate: toggleFav } = useFavourite();

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["medicalTestsProviders"],
    queryFn: () => providerAPI.getMedicalTestsProviders(),
  });

  useEffect(() => {
    if (providers.length > 0) {
      setFavouriteIds(
        providers.filter((p) => p.isFavorite).map((p) => String(p.id)),
      );
    }
  }, [providers]);

  const filtered = useMemo(() => {
    let list = [...providers];
    if (filter === FILTER_LAB) list = list.filter((p) => p.type === 0);
    if (filter === FILTER_SCAN) list = list.filter((p) => p.type === 1);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.address || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [providers, filter, search]);

  const toggleFavouriteProvider = useCallback(
    (providerId) => {
      const id = String(providerId);
      if (pendingFavIds.has(id)) return;

      setFavouriteIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );

      setPendingFavIds((prev) => new Set(prev).add(id));

      toggleFav(providerId, {
        onSuccess: () => {
          setPendingFavIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
        onError: () => {
          setFavouriteIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
          );
          setPendingFavIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      });
    },
    [toggleFav, pendingFavIds],
  );

  const tabs = [
    { key: FILTER_ALL, label: "All", icon: MdApps },
    { key: FILTER_LAB, label: "Labs", icon: MdScience },
    { key: FILTER_SCAN, label: "Scan Centers", icon: MdBiotech },
  ];

  return (
    <div
      className="min-h-[60vh] pt-[100px] md:pt-[70px] pb-16 px-4"
      style={{
        background: "linear-gradient(180deg, #F6F9FF 0%, #FFFFFF 340px)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <HeroSection />

        {/* Controls */}
        <div
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
          }}
          className="flex flex-col sm:flex-row gap-3 mb-8 items-start sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1 w-full">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl
                text-sm text-gray-800 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#316BE8]/30 focus:border-[#316BE8]
                shadow-sm transition-all duration-200"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl flex-shrink-0">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    filter === key
                      ? "bg-white text-[#316BE8] shadow-sm shadow-[#316BE8]/10"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <div
            style={{
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.4s ease 0.25s",
            }}
            className="mb-5 flex items-center gap-2"
          >
            <span className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "result" : "results"}
            </span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs text-[#316BE8] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF3FF] flex items-center justify-center mb-4">
              <MdSearch className="w-8 h-8 text-[#316BE8]" />
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-1">
              No results found
            </p>
            <p className="text-gray-400 text-sm">
              Try a different name or location
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((p, idx) => (
              <div key={p.id} className="h-full min-h-0">
                <ServiceProviderCard
                  id={p.id}
                  name={p.name}
                  address={p.address}
                  avg_Rating={p.avg_Rating}
                  type={p.type}
                  imageUrl={p.imageUrl || p.profileImageUrl || p.logoUrl || ""}
                  animationDelay={idx * 70}
                  isFav={favouriteIds.includes(String(p.id))}
                  isPending={pendingFavIds.has(String(p.id))}
                  onToggleFav={() => toggleFavouriteProvider(p.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
