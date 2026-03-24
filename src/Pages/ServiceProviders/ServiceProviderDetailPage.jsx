import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProviderAPI } from "../../api/providerAPI";
import { MdStar, MdLocationOn, MdBadge } from "react-icons/md";
import Loader from "../../Components/Common/loader";

/**
 * Detail page for a Lab or Scan Center: profile, services, prices, working hours
 * Route: /labs/:id (used for both labs and scan centers)
 */
export default function ServiceProviderDetailPage() {
  const { id } = useParams();
  const providerAPI = useProviderAPI();

  const { data: provider, isLoading, isError } = useQuery({
    queryKey: ["medicalTestsProvider", id],
    queryFn: async () => {
      try {
        return await providerAPI.getMedicalTestsProviderById(id);
      } catch {
        const list = await providerAPI.getMedicalTestsProviders();
        return list.find((p) => String(p.id) === String(id)) || null;
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="pt-[100px] md:pt-[70px] min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (isError || !provider) {
    return (
      <div className="min-h-[60vh] pt-[100px] md:pt-[70px] px-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-600 mb-4">Provider not found.</p>
          <Link to="/service-providers" className="text-[#316BE8] font-medium hover:underline">
            Back to Labs & Scan Centers
          </Link>
        </div>
      </div>
    );
  }

  const isLab = provider.type === 0;
  const name = provider.name || "—";
  const licenceNo = provider.licenceNo ?? provider.licenseNumber ?? "—";
  const address = provider.address ?? "—";
  const about = provider.about ?? "";
  const avgRating = provider.avg_Rating ?? provider.avgRating ?? "—";

  return (
    <div className="min-h-[60vh] pt-[100px] md:pt-[70px] pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/service-providers" className="text-[#316BE8] font-medium hover:underline mb-6 inline-block">
          ← Back to Labs & Scan Centers
        </Link>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#316BE8] flex items-center justify-center text-white text-2xl font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-gray-500">{isLab ? "Lab" : "Scan Center"}</p>
                {avgRating !== "—" && (
                  <div className="flex items-center gap-1 mt-1 text-amber-600">
                    <MdStar className="w-5 h-5" />
                    <span className="font-medium">{avgRating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MdBadge className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">License No.</p>
                    <p className="text-gray-900 font-medium">{licenceNo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MdLocationOn className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Address</p>
                    <p className="text-gray-900 font-medium">{address}</p>
                  </div>
                </div>
              </div>
              {about && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">About</p>
                  <p className="text-gray-700">{about}</p>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Services</h2>
             
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Working Hours</h2>
              
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
