import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { useLocation } from "react-router-dom";
import { useProviderPortalAPI } from "../../api/providerPortalAPI";
import {
  useMedicalProviderMe,
  pick,
  medicalProviderMeQueryKey,
} from "../../hooks/useMedicalProviderMe";
import Loader from "../../Components/Common/loader";
import { MdStar, MdLocationOn, MdBadge } from "react-icons/md";
import {
  buildWorkingRowsFromApi,
  rowsToWorkingHourPayload,
  DAY_LABELS_AR_EN,
} from "../../utils/workingHours";

export default function ProviderProfilePage({ type }) {
  const { role, accessToken } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const portal = useProviderPortalAPI();

  const pathType = location.pathname.startsWith("/scan") ? "scan" : "lab";
  const normalizedType = (type || pathType || role || "").toLowerCase();
  const isLab = normalizedType !== "scan";
  const titlePrefix = isLab ? "Lab Center" : "Scan Center";

  const { data: provider, isLoading, isError } = useMedicalProviderMe();

  const providerId = provider ? pick(provider, "id", "Id") : null;
  const workingHoursApi = pick(provider, "workingHours", "WorkingHours");

  const [rows, setRows] = useState(() =>
    buildWorkingRowsFromApi([]),
  );
  const [quickFrom, setQuickFrom] = useState("09:00");
  const [quickTo, setQuickTo] = useState("17:00");

  useEffect(() => {
    if (provider) {
      setRows(buildWorkingRowsFromApi(workingHoursApi));
    }
  }, [provider, workingHoursApi]);

  const updateMutation = useMutation({
    mutationFn: (payload) => portal.updateMedicalProvider(payload),
    onSuccess: async (_, variables) => {
      const qKey = medicalProviderMeQueryKey(accessToken, role);
      const savedWh = variables.workingHours || [];

      queryClient.setQueryData(qKey, (old) => {
        if (!old) return old;
        return { ...old, workingHours: savedWh };
      });

      await queryClient.invalidateQueries({ queryKey: ["medicalTestsProvider"] });
      await queryClient.refetchQueries({ queryKey: qKey });

      const fresh = queryClient.getQueryData(qKey);
      const whFromServer = pick(fresh, "workingHours", "WorkingHours");
      if (
        (!whFromServer || whFromServer.length === 0) &&
        savedWh.length > 0
      ) {
        queryClient.setQueryData(qKey, (old) =>
          old ? { ...old, workingHours: savedWh } : old,
        );
      }

      toast.success("Profile and working hours saved.", {
        position: "top-center",
      });
    },
    onError: (err) => {
      const data = err?.response?.data;
      let msg = "Could not save. Please try again.";
      if (typeof data === "string") msg = data;
      else if (data?.message) msg = String(data.message);
      else if (data?.title) msg = String(data.title);
      else if (Array.isArray(data?.errors) && data.errors[0])
        msg = String(data.errors[0]);
      toast.error(msg, { position: "top-center" });
    },
  });

  const handleRowChange = (day, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.day === day ? { ...r, [field]: value } : r)),
    );
  };

  const applyQuickToAllDays = () => {
    setRows((prev) =>
      prev.map((r) => ({ ...r, from: quickFrom, to: quickTo })),
    );
  };

  const applyQuickToDaySet = (daySet) => {
    setRows((prev) =>
      prev.map((r) =>
        daySet.has(r.day)
          ? { ...r, from: quickFrom, to: quickTo }
          : r,
      ),
    );
  };

  const handleSaveHours = () => {
    if (!provider) return;
    const workingHours = rowsToWorkingHourPayload(rows);
    if (workingHours.length === 0) {
      toast.warning(
        "Add a start and end time for at least one day, then save.",
        { position: "top-center" },
      );
      return;
    }
    const payload = {
      name: pick(provider, "name", "Name"),
      licenceNo:
        pick(provider, "licenceNo", "LicenceNo") ??
        pick(provider, "licenseNo", "LicenseNo"),
      address: pick(provider, "address", "Address"),
      about: pick(provider, "about", "About") ?? "",
      workingHours,
    };
    updateMutation.mutate(payload);
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
        <p className="text-gray-500 text-sm text-center max-w-md">
          Try logging in again. If the issue continues, ensure your account is
          linked to a medical provider on the server.
        </p>
      </div>
    );
  }

  const name = pick(provider, "name", "Name") || "—";
  const licenceNo =
    pick(provider, "licenceNo", "LicenceNo") ??
    pick(provider, "licenseNo", "LicenseNo") ??
    "—";
  const address = pick(provider, "address", "Address") ?? "—";
  const about = pick(provider, "about", "About") ?? "";
  const avgRating =
    pick(provider, "avg_Rating", "Avg_Rating") ??
    pick(provider, "avgRating", "AvgRating") ??
    "—";

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
              {providerId != null && (
                <p className="text-xs text-gray-400 mt-1">ID: {providerId}</p>
              )}
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
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Basic Info
            </h3>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Working hours
                </h3>
               
              </div>
              <button
                type="button"
                onClick={handleSaveHours}
                disabled={updateMutation.isPending}
                className="px-4 py-2 rounded-xl bg-[#316BE8] text-white text-sm font-semibold hover:bg-[#2552c1] transition disabled:opacity-60"
              >
                {updateMutation.isPending ? "Saving…" : "Save working hours"}
              </button>
            </div>

            <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="text-xs font-semibold text-gray-700">
                Quick setup
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase mb-0.5">
                    From
                  </label>
                  <input
                    type="time"
                    step={60}
                    value={quickFrom}
                    onChange={(e) => setQuickFrom(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase mb-0.5">
                    To
                  </label>
                  <input
                    type="time"
                    step={60}
                    value={quickTo}
                    onChange={(e) => setQuickTo(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applyQuickToAllDays}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Apply to all 7 days
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyQuickToDaySet(new Set([0, 1, 2, 3, 4]))
                  }
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sun–Thu 
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyQuickToDaySet(new Set([1, 2, 3, 4, 5]))
                  }
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Mon–Fri 
                </button>
                <button
                  type="button"
                  onClick={() => setRows(buildWorkingRowsFromApi([]))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-red-100 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Clear all times
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                After using quick setup you can still edit single days in the
                table below, then press Save.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Day
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      From (24h)
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      To (24h)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.day}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                      }
                    >
                      <td className="px-3 py-2 font-medium text-gray-800">
                        <span className="block">{row.label}</span>
                        
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          step={60}
                          value={row.from}
                          onChange={(e) =>
                            handleRowChange(row.day, "from", e.target.value)
                          }
                          className="w-full max-w-[140px] border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-[#316BE8] focus:border-transparent text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          step={60}
                          value={row.to}
                          onChange={(e) =>
                            handleRowChange(row.day, "to", e.target.value)
                          }
                          className="w-full max-w-[140px] border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-[#316BE8] focus:border-transparent text-xs"
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
