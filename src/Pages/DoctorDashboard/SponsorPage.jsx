import { motion } from "framer-motion";
import {
  RiFlaskLine,
  RiScanLine,
  RiMapPinLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import {
  useGetActiveSponsors,
  useRemoveSponsor,
} from "../../hooks/useActiveSponsors";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

export default function SponsorsPage() {
  const { data, isLoading, isError } = useGetActiveSponsors();
  const removeMutation = useRemoveSponsor();

  if (isLoading)
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        Loading sponsors…
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-20 text-rose-400 text-sm">
        Failed to load sponsors.
      </div>
    );

  const sponsorships = data?.sponsorships ?? [];
  const avgDisc = data?.averageDiscountPercentage ?? 0;
  const patientCount = data?.patientBenefitsCount ?? 0;
  const activeCount = data?.activeSponsorsCount ?? 0;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Stats row */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        {[
          { l: "Active Sponsors", v: activeCount, c: "text-blue-600" },
          { l: "Patients Benefited", v: patientCount, c: "text-emerald-600" },
          { l: "Avg Discount", v: `${avgDisc}%`, c: "text-violet-600" },
        ].map(({ l, v, c }) => (
          <div
            key={l}
            className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm"
          >
            <p className="text-[11.5px] text-slate-400 mb-1">{l}</p>
            <p className={`text-[28px] font-extrabold leading-none ${c}`}>
              {v}
            </p>
          </div>
        ))}
      </motion.div>

      {sponsorships.length === 0 ? (
        <motion.p
          variants={fadeUp}
          className="text-center py-20 text-slate-400 text-sm"
        >
          No active sponsors yet
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sponsorships.map((sp) => {
            const isLab = sp.providerType === 0;
            return (
              <motion.div
                key={sp.id}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
                      ${isLab ? "bg-emerald-50 border border-emerald-200" : "bg-sky-50 border border-sky-200"}`}
                  >
                    {isLab ? (
                      <RiFlaskLine className="text-emerald-600" />
                    ) : (
                      <RiScanLine className="text-sky-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-slate-900 truncate">
                      {sp.providerName}
                    </p>
                    <span
                      className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                        ${isLab ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}
                    >
                      {isLab ? "Laboratory" : "Radiology"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[28px] font-extrabold text-blue-600 leading-none">
                      {sp.discountPercentage}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      off for patients
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-0.5">Offer</p>
                    <p className="text-[12px] font-medium text-slate-700 line-clamp-2">
                      {sp.offerContent}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-0.5">
                      Active since
                    </p>
                    <p className="text-[14px] font-bold text-slate-700">
                      {fmt(sp.requestedAtUtc)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-0.5">Status</p>
                    <p className="text-[14px] font-bold text-emerald-600">
                      ● Active
                    </p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => removeMutation.mutate(sp.id)}
                  disabled={removeMutation.isPending}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-[12px] font-semibold hover:bg-rose-100 transition-colors disabled:opacity-50"
                >
                  <RiDeleteBinLine /> Remove Sponsor
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
