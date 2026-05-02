import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProviderAPI } from "../../api/providerAPI";
import ServiceProviderCard from "../../Components/ServiceProviders/ServiceProviderCard";
import { MdSearch } from "react-icons/md";
import Loader from "../../Components/Common/loader";

const FILTER_ALL = "all";
const FILTER_LAB = "lab";
const FILTER_SCAN = "scan";

export default function ServiceProvidersPage() {
  const providerAPI = useProviderAPI();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(FILTER_ALL);

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
          (p.address || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [providers, filter, search]);

  return (
    <div className="min-h-[60vh] pt-[100px] md:pt-[70px] pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Labs & Scan Centers</h1>
        <p className="text-gray-600 mb-6">Find labs and scan centers near you. Filter and search below.</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setFilter(FILTER_ALL)}
              className={`px-4 py-2.5 rounded-xl font-medium transition ${
                filter === FILTER_ALL ? "bg-[#316BE8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter(FILTER_LAB)}
              className={`px-4 py-2.5 rounded-xl font-medium transition ${
                filter === FILTER_LAB ? "bg-[#316BE8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Labs
            </button>
            <button
              type="button"
              onClick={() => setFilter(FILTER_SCAN)}
              className={`px-4 py-2.5 rounded-xl font-medium transition ${
                filter === FILTER_SCAN ? "bg-[#316BE8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Scan Centers
            </button>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No labs or scan centers match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((p) => (
              <div key={p.id} className="h-full min-h-0">
                <ServiceProviderCard
                  id={p.id}
                  name={p.name}
                  address={p.address}
                  avg_Rating={p.avg_Rating}
                  type={p.type}
                  imageUrl={p.imageUrl || p.profileImageUrl || p.logoUrl || ""}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
