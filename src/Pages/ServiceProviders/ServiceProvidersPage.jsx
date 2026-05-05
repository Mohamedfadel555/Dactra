import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProviderAPI } from "../../api/providerAPI";
import ServiceProviderCard from "../../Components/ServiceProviders/ServiceProviderCard";
import { MdSearch, MdScience, MdBiotech, MdApps } from "react-icons/md";
import Loader from "../../Components/Common/loader";

const FILTER_ALL = "all";
const FILTER_LAB = "lab";
const FILTER_SCAN = "scan";

// Pulse skeleton for loading state
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

// Animated section heading
function HeroSection() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 0.6s ease, transform 0.6s cubic-bezier(.22,.68,0,1.2)",
      }}
      className="mb-8"
    >
      {/* Decorative pill */}
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

export default function ServiceProvidersPage() {
  const providerAPI = useProviderAPI();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(FILTER_ALL);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["medicalTestsProviders"],
    queryFn: () => providerAPI.getMedicalTestsProviders(),
  });

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

        {/* Controls bar */}
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
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            style={{ opacity: 1, animation: "fadeIn 0.4s ease" }}
          >
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
