import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProviderAPI } from "../../api/providerAPI";
import { useProviderPortalAPI } from "../../api/providerPortalAPI";
import { pick } from "../../hooks/useMedicalProviderMe";
import {
  useDeleteProviderRating,
  usePatientProviderRatings,
  useRateProvider,
  useUpdateProviderRating,
  useGetProviderRatings,
} from "../../hooks/useProviderRatings";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState, useRef } from "react";
import {
  formatWorkingHoursDisplayLines,
  durationSpanToMinutes,
} from "../../utils/workingHours";
import {
  MdStar,
  MdLocationOn,
  MdBadge,
  MdSchedule,
  MdPhone,
  MdScience,
  MdBiotech,
  MdArrowBack,
  MdEdit,
  MdDelete,
  MdCheckCircle,
} from "react-icons/md";
import Loader from "../../Components/Common/loader";

function normOffering(o) {
  return {
    id: pick(o, "id", "Id"),
    price: pick(o, "price", "Price"),
    duration: pick(o, "duration", "Duration"),
    testService: pick(o, "testService", "TestService") || {},
  };
}

// Animated section wrapper
function Section({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Star rating picker
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(null);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(null)}
          className="transition-transform hover:scale-125 duration-150"
        >
          <MdStar
            className={`w-7 h-7 transition-colors duration-100 ${
              s <= (hover ?? value) ? "text-amber-400" : "text-slate-200"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500 font-medium">
        {hover ?? value} / 5
      </span>
    </div>
  );
}

// Info chip
function InfoChip({ icon: Icon, label, value, color = "blue" }) {
  const colors = {
    blue: "bg-[#EEF3FF] text-[#316BE8]",
    sky: "bg-[#E0F5FF] text-[#0EA5E9]",
    gray: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-gray-900 font-medium text-sm break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function ServiceProviderDetailPage() {
  const { role } = useAuth();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const providerAPI = useProviderAPI();
  const portal = useProviderPortalAPI();
  const numericId = id != null ? Number(id) : NaN;
  const [headerReady, setHeaderReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const {
    data: provider,
    isLoading,
    isError,
  } = useQuery({
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

  const { data: offeringsRaw = [], isLoading: loadingOfferings } = useQuery({
    queryKey: ["providerOfferings", numericId],
    queryFn: () => portal.getProviderOfferings(numericId),
    enabled: Number.isFinite(numericId),
  });

  // ✅ FIX: use numericId here — providerId is defined later after provider loads
  const { data: providerRatingsData, isLoading: loadingRatings } =
    useGetProviderRatings(numericId);
  const allReviews = providerRatingsData?.ratings ?? [];
  const scoreCounts = providerRatingsData?.scoreCounts ?? {};
  const totalRatings = providerRatingsData?.totalRatings ?? 0;
  const averageRating = providerRatingsData?.averageRating ?? null;

  const { data: myRatings = [], isPending: ratingsLoading } =
    usePatientProviderRatings();
  const rateMutation = useRateProvider();
  const updateRateMutation = useUpdateProviderRating();
  const deleteRateMutation = useDeleteProviderRating();
  const [showRateForm, setShowRateForm] = useState(false);
  const [rateSuccess, setRateSuccess] = useState(false);
  const [rateForm, setRateForm] = useState({
    heading: "",
    score: 5,
    comment: "",
  });

  const providerId = provider?.id ?? provider?.Id ?? numericId;
  const matchProviderRow = (r) => {
    const pid =
      pick(r, "providerId", "ProviderId") ??
      pick(r, "medicalTestsProviderId", "MedicalTestsProviderId");
    return pid != null && String(pid) === String(providerId);
  };
  const existingRate = myRatings.find(matchProviderRow);

  useEffect(() => {
    if (!existingRate) return;
    setRateForm({
      heading: pick(existingRate, "heading", "Heading") || "",
      score: Number(pick(existingRate, "score", "Score") || 5),
      comment: pick(existingRate, "comment", "Comment") || "",
    });
  }, [existingRate]);

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
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <MdLocationOn className="w-8 h-8 text-red-300" />
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-1">
            Provider not found
          </p>
          <p className="text-gray-400 text-sm mb-6">
            We couldn't find this lab or scan center.
          </p>
          <Link
            to="/service-providers"
            className="inline-flex items-center gap-2 text-[#316BE8] font-semibold hover:underline"
          >
            <MdArrowBack /> Back to Labs &amp; Scan Centers
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
  const avgRating = provider.avg_Rating ?? provider.avgRating ?? null;
  const phone = provider.phoneNumber ?? null;
  const workingHoursApi = provider.workingHours ?? provider.WorkingHours ?? [];
  const hoursLines = formatWorkingHoursDisplayLines(workingHoursApi);
  const offerings = offeringsRaw.map(normOffering);
  const accentClass = isLab ? "text-[#316BE8]" : "text-[#0EA5E9]";
  const badgeBg = isLab
    ? "bg-[#EEF3FF] text-[#316BE8]"
    : "bg-[#E0F5FF] text-[#0EA5E9]";
  const gradientBar = isLab
    ? "from-[#316BE8] to-[#6A9FFF]"
    : "from-[#0EA5E9] to-[#38BDF8]";

  // ─── Rating submit handler ────────────────────────────────────────────────
  const handleRatingSubmit = async () => {
    const userHeading = String(rateForm.heading || "").trim();
    if (!userHeading) return;

    const body = {
      heading: userHeading,
      score: Number(rateForm.score),
      comment: rateForm.comment || "",
    };

    // Double-check if a rating already exists (guards against stale cache)
    let useUpdate = !!existingRate;
    if (!useUpdate) {
      await queryClient.refetchQueries({
        queryKey: ["patientProviderRatings"],
      });
      const fresh = queryClient.getQueryData(["patientProviderRatings"]) || [];
      useUpdate = (Array.isArray(fresh) ? fresh : []).some(matchProviderRow);
    }

    if (useUpdate) {
      await updateRateMutation.mutateAsync({ providerId, body });
    } else {
      await rateMutation.mutateAsync({ providerId, body });
    }

    setRateSuccess(true);
    setShowRateForm(false);
    // Refresh provider ratings after submitting
    queryClient.invalidateQueries({ queryKey: ["providerRatings", numericId] });
  };

  return (
    <div
      className="min-h-[60vh] pt-[100px] md:pt-[70px] pb-16 px-4"
      style={{
        background: "linear-gradient(180deg, #F6F9FF 0%, #FFFFFF 380px)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <div
          style={{
            opacity: headerReady ? 1 : 0,
            transform: headerReady ? "translateX(0)" : "translateX(-12px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
          className="mb-6"
        >
          <Link
            to="/service-providers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#316BE8] transition-colors duration-200"
          >
            <MdArrowBack className="w-4 h-4" />
            Labs &amp; Scan Centers
          </Link>
        </div>

        {/* ── HERO CARD ── */}
        <div
          style={{
            opacity: headerReady ? 1 : 0,
            transform: headerReady ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.55s ease 0.05s, transform 0.55s cubic-bezier(.22,.68,0,1.2) 0.05s",
          }}
          className="bg-white rounded-2xl shadow-[0_4px_32px_0_rgba(49,107,232,0.09)] border border-slate-100 overflow-hidden mb-6"
        >
          {/* Gradient top bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${gradientBar}`} />

          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div
              className={`relative w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden
              ${isLab ? "bg-gradient-to-br from-[#EEF3FF] to-[#C7D9FF]" : "bg-gradient-to-br from-[#E0F5FF] to-[#BAE6FD]"}`}
            >
              {provider.imageUrl || provider.profileImageUrl ? (
                <img
                  src={provider.imageUrl || provider.profileImageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${accentClass}`}
                >
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 mb-1">
                <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                  {name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeBg}`}
                >
                  {isLab ? (
                    <MdScience className="w-3.5 h-3.5" />
                  ) : (
                    <MdBiotech className="w-3.5 h-3.5" />
                  )}
                  {isLab ? "Laboratory" : "Scan Center"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {avgRating != null && avgRating > 0 ? (
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <MdStar className="w-4 h-4" />
                    {avgRating}
                    <span className="text-gray-400 font-normal">/ 5</span>
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">No ratings yet</span>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-1 hover:text-[#316BE8] transition-colors"
                  >
                    <MdPhone className="w-4 h-4" />
                    {phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PROFILE CHIPS ── */}
        <Section delay={80}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <InfoChip
              icon={MdBadge}
              label="License No."
              value={licenceNo}
              color="blue"
            />
            <InfoChip
              icon={MdLocationOn}
              label="Address"
              value={address}
              color={isLab ? "blue" : "sky"}
            />
          </div>
          {about && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 shadow-sm">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                About
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">{about}</p>
            </div>
          )}
        </Section>

        {/* ── WORKING HOURS ── */}
        <Section delay={160}>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLab ? "bg-[#EEF3FF]" : "bg-[#E0F5FF]"}`}
              >
                <MdSchedule className={`w-4 h-4 ${accentClass}`} />
              </span>
              Working Hours
            </h2>
            {hoursLines.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Working hours haven't been set yet. Contact the center directly.
              </p>
            ) : (
              <ul className="space-y-2">
                {hoursLines.map((line, idx) => (
                  <li
                    key={`${idx}-${line}`}
                    className="flex items-start gap-2 text-sm text-gray-700"
                    style={{
                      animation: `slideUp 0.35s ease ${idx * 40}ms both`,
                    }}
                  >
                    <span
                      className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${isLab ? "bg-[#316BE8]" : "bg-[#0EA5E9]"}`}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {/* ── SERVICES TABLE ── */}
        <Section delay={240}>
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mb-6 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-bold text-gray-800">
                Services &amp; Prices
              </h2>
            </div>
            {loadingOfferings ? (
              <div className="p-6">
                <Loader />
              </div>
            ) : offerings.length === 0 ? (
              <p className="text-sm text-gray-400 italic p-6">
                No services registered yet for this provider.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Price (EGP)
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {offerings.map((off, i) => {
                      const ts = off.testService || {};
                      const sname = pick(ts, "name", "Name") || "—";
                      const sdesc = pick(ts, "description", "Description");
                      const mins = durationSpanToMinutes(off.duration);
                      return (
                        <tr
                          key={off.id ?? `${sname}-${off.price}`}
                          className="hover:bg-slate-50/70 transition-colors duration-150"
                          style={{
                            animation: `slideUp 0.35s ease ${i * 50}ms both`,
                          }}
                        >
                          <td className="px-5 py-3.5 align-top">
                            <span className="font-semibold text-gray-900">
                              {sname}
                            </span>
                            {sdesc && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                {sdesc}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-gray-800">
                            {off.price != null ? (
                              <span>
                                <span className={`font-bold ${accentClass}`}>
                                  {Number(off.price).toLocaleString()}
                                </span>
                                <span className="text-gray-400 text-xs ml-1">
                                  EGP
                                </span>
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">
                            ~{mins} <span className="text-xs">min</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Section>

        {/* ── REVIEWS SECTION ── */}
        <Section delay={300}>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">
                Patient Reviews
              </h2>
              {totalRatings > 0 && (
                <span className="text-xs text-gray-400 font-medium">
                  {totalRatings} review{totalRatings !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {loadingRatings ? (
              <Loader />
            ) : allReviews.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No reviews yet.</p>
            ) : (
              <>
                {/* Average + bar breakdown */}
                <div className="flex flex-col sm:flex-row gap-6 mb-6 p-4 bg-slate-50 rounded-xl">
                  {/* Big avg number */}
                  <div className="flex flex-col items-center justify-center min-w-[80px]">
                    <span className={`text-4xl font-extrabold ${accentClass}`}>
                      {Number(averageRating).toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <MdStar
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(averageRating)
                              ? "text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {totalRatings} review{totalRatings !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Score bars */}
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = scoreCounts[String(star)] ?? 0;
                      const pct =
                        totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3 text-right">
                            {star}
                          </span>
                          <MdStar className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${gradientBar} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-4">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                <div className="space-y-3">
                  {allReviews.map((r, i) => (
                    <div
                      key={r.ratingId ?? i}
                      className="border border-slate-100 rounded-xl p-4"
                      style={{
                        animation: `slideUp 0.35s ease ${i * 60}ms both`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {r.heading}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {r.patientName || "Anonymous"} ·{" "}
                            {new Date(r.ratedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <MdStar
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= r.score
                                  ? "text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Section>

        {/* ── YOUR RATING SECTION ── */}
        {(role || "").toLowerCase() === "patient" && (
          <Section delay={380}>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-base font-bold text-gray-800">
                  Your Rating
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowRateForm((v) => !v);
                    setRateSuccess(false);
                  }}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      showRateForm
                        ? "bg-slate-100 text-gray-600 hover:bg-slate-200"
                        : `${isLab ? "bg-[#EEF3FF] text-[#316BE8]" : "bg-[#E0F5FF] text-[#0EA5E9]"} hover:opacity-80`
                    }`}
                >
                  <MdEdit className="w-3.5 h-3.5" />
                  {showRateForm
                    ? "Close"
                    : existingRate
                      ? "Edit Review"
                      : "Add Review"}
                </button>
              </div>

              {/* Success message */}
              {rateSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl mb-4">
                  <MdCheckCircle className="w-5 h-5" />
                  Rating submitted successfully!
                </div>
              )}

              {/* Rating form */}
              {showRateForm && (
                <div
                  style={{
                    animation: "slideUp 0.35s cubic-bezier(.22,.68,0,1.2) both",
                  }}
                  className="space-y-4"
                >
                  <StarPicker
                    value={rateForm.score}
                    onChange={(s) => setRateForm((p) => ({ ...p, score: s }))}
                  />

                  <input
                    value={rateForm.heading}
                    onChange={(e) =>
                      setRateForm((p) => ({ ...p, heading: e.target.value }))
                    }
                    placeholder="Review heading (required)"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316BE8]/30 focus:border-[#316BE8] transition-all"
                  />

                  <textarea
                    value={rateForm.comment}
                    onChange={(e) =>
                      setRateForm((p) => ({ ...p, comment: e.target.value }))
                    }
                    placeholder="Share your experience (optional)"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#316BE8]/30 focus:border-[#316BE8] transition-all"
                  />

                  {/* Actions */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="button"
                      disabled={
                        ratingsLoading ||
                        rateMutation.isPending ||
                        updateRateMutation.isPending ||
                        !String(rateForm.heading || "").trim()
                      }
                      onClick={handleRatingSubmit}
                      className={`flex-1 h-10 rounded-xl text-white text-sm font-semibold
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-200 active:scale-95
                        ${
                          isLab
                            ? "bg-gradient-to-r from-[#316BE8] to-[#6A9FFF] hover:shadow-[0_4px_16px_rgba(49,107,232,0.35)]"
                            : "bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:shadow-[0_4px_16px_rgba(14,165,233,0.35)]"
                        }`}
                    >
                      {existingRate ? "Update Rating" : "Submit Rating"}
                    </button>

                    {existingRate && (
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteRateMutation.mutateAsync(providerId);
                          setShowRateForm(false);
                          queryClient.invalidateQueries({
                            queryKey: ["providerRatings", numericId],
                          });
                        }}
                        className="px-4 h-10 rounded-xl border border-red-200 text-red-500 text-sm font-semibold
                          hover:bg-red-50 transition-all duration-200 flex items-center gap-1.5"
                      >
                        <MdDelete className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Existing rating display */}
              {!showRateForm && existingRate && !rateSuccess && (
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <MdStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < (pick(existingRate, "score", "Score") || 0)
                            ? "text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="font-semibold text-gray-800">
                    {pick(existingRate, "heading", "Heading")}
                  </p>
                  {pick(existingRate, "comment", "Comment") && (
                    <p className="text-gray-500 mt-0.5">
                      {pick(existingRate, "comment", "Comment")}
                    </p>
                  )}
                </div>
              )}

              {/* No rating yet */}
              {!showRateForm && !existingRate && !rateSuccess && (
                <p className="text-sm text-gray-400">
                  You haven't rated this provider yet.
                </p>
              )}
            </div>
          </Section>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
