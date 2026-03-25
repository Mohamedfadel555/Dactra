import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../Context/AuthContext";
import { useProviderAPI } from "../../api/providerAPI";
import Loader from "../../Components/Common/loader";
import { MdStar, MdLocationOn, MdBadge } from "react-icons/md";

export default function ProviderProfilePage() {
  const { accessToken, role } = useAuth();
  const providerAPI = useProviderAPI();

  const isLab = (role || "").toLowerCase() === "lab" || (role || "").toLowerCase() === "lap";
  const titlePrefix = isLab ? "Lab" : "Scan Center";

  const {
    data: providers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["providerProfileList"],
    queryFn: () => providerAPI.getMedicalTestsProviders(),
    enabled: !!accessToken,
  });

  const desiredType = isLab ? 0 : 1;
  const provider =
    (Array.isArray(providers) &&
      (providers.find((p) => p.type === desiredType) || providers[0])) ||
    null;

  const [workingHours, setWorkingHours] = useState([
    { day: "Saturday", from: "", to: "" },
    { day: "Sunday", from: "", to: "" },
    { day: "Monday", from: "", to: "" },
    { day: "Tuesday", from: "", to: "" },
    { day: "Wednesday", from: "", to: "" },
    { day: "Thursday", from: "", to: "" },
    { day: "Friday", from: "", to: "" },
  ]);

  const handleWorkingHoursChange = (index, field, value) => {
    setWorkingHours((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <p className="text-gray-700">
          We could not load your {titlePrefix.toLowerCase()} profile.
        </p>
        <p className="text-gray-500 text-sm">
          Please make sure your account is linked to a MedicalTestsProvider entry.
        </p>
      </div>
    );
  }

  const name = provider.name || "—";
  const licenceNo =
    provider.licenceNo ?? provider.licenseNo ?? provider.licenseNumber ?? "—";
  const address = provider.address ?? "—";
  const about = provider.about ?? "";
  const avgRating = provider.avg_Rating ?? provider.avgRating ?? "—";

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {titlePrefix} Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#316BE8] flex items-center justify-center text-white text-2xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              <p className="text-gray-500">{titlePrefix}</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MdBadge className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    License No.
                  </p>
                  <p className="text-gray-900 font-medium">{licenceNo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MdLocationOn className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Address
                  </p>
                  <p className="text-gray-900 font-medium">{address}</p>
                </div>
              </div>
            </div>
            {about && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  About
                </p>
                <p className="text-gray-700">{about}</p>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Working Hours
            </h3>
            {/* <p className="text-gray-600 text-sm mb-3">
              Set your weekly working hours. This data is saved locally for now
              and will be connected to backend APIs later.
            </p> */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Day
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      From
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      To
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workingHours.map((row, index) => (
                    <tr
                      key={row.day}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                    >
                      <td className="px-3 py-2 font-medium text-gray-800">
                        {row.day}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={row.from}
                          onChange={(e) =>
                            handleWorkingHoursChange(index, "from", e.target.value)
                          }
                          className="w-full border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#316BE8] focus:border-transparent text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={row.to}
                          onChange={(e) =>
                            handleWorkingHoursChange(index, "to", e.target.value)
                          }
                          className="w-full border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#316BE8] focus:border-transparent text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

