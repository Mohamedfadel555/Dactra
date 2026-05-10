import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { useGetProviderRating } from "../../hooks/useGetProviderRating";
import { useRateProvider } from "../../hooks/useRateProvider";
import { useGetMyRating } from "./../../hooks/useGetMyRating";

// ─── helpers ──────────────────────────────────────────────────────────────────

function StarRow({ score, interactive = false, onSelect, size = 20 }) {
  const [hovered, setHovered] = useState(null);
  const active = hovered ?? score;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <motion.span
          key={s}
          whileHover={interactive ? { scale: 1.25 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(null)}
          onClick={() => interactive && onSelect?.(s)}
          style={{ cursor: interactive ? "pointer" : "default" }}
        >
          <FaStar
            size={size}
            className="transition-colors duration-100"
            style={{ color: s <= active ? "#f59e0b" : "#e5e7eb" }}
          />
        </motion.span>
      ))}
    </div>
  );
}

function ScoreBar({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[12px] text-gray-500 w-4 text-right">{label}</span>
      <FaStar size={11} className="text-amber-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-amber-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span className="text-[12px] text-gray-400 w-6 text-right">{count}</span>
    </div>
  );
}

function ReviewCard({ item }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/60"
    >
      <div className="size-9 rounded-full bg-gray-200 flex items-end justify-center overflow-hidden flex-shrink-0">
        {item.patientImageUrl ? (
          <img
            src={item.patientImageUrl}
            alt={item.patientName}
            className="size-full object-cover"
          />
        ) : (
          <IoPersonSharp className="text-[34px] text-gray-400 translate-y-1" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[13px] font-semibold text-gray-800">
            {item.patientName ?? "Anonymous"}
          </span>
          <StarRow score={item.score} size={12} />
        </div>
        {item.heading && (
          <p className="text-[13px] font-medium text-gray-700 mt-0.5">
            {item.heading}
          </p>
        )}
        {item.comment && (
          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
            {item.comment}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function RatingSection({ providerId, canRate }) {
  const { data, isLoading } = canRate
    ? useGetProviderRating(providerId)
    : useGetMyRating(canRate);
  const { mutate, isPending, isSuccess, isError } = useRateProvider(providerId);
  console.log(data);

  const [showForm, setShowForm] = useState(false);
  const [score, setScore] = useState(0);
  const [heading, setHeading] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  const scoreCounts = data?.scoreCounts ?? {};
  const totalRatings = data?.totalRatings ?? 0;
  const averageRating = data?.averageRating ?? 0;
  const ratings = data?.ratings ?? [];

  const validate = () => {
    const e = {};
    if (!score) e.score = "Please select a star rating.";
    if (!heading.trim()) e.heading = "Heading is required.";
    if (!comment.trim()) e.comment = "Comment is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    mutate(
      { score, heading, comment },
      {
        onSuccess: () => {
          setShowForm(false);
          setScore(0);
          setHeading("");
          setComment("");
          setErrors({});
        },
      },
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      {/* ── header ── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Patient reviews
        </p>
        {canRate && !showForm && (
          <motion.button
            whileHover={{ y: -1, boxShadow: "0 6px 18px rgba(24,95,165,.2)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[12px]
                       font-semibold hover:bg-blue-700 transition-colors shadow-md
                       shadow-blue-200/50"
          >
            + Write a review
          </motion.button>
        )}
      </div>

      {/* ── summary row ── */}
      {!isLoading && totalRatings > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
          {/* big average */}
          <div className="flex flex-col items-center justify-center gap-1 min-w-[90px]">
            <span className="text-[44px] font-bold text-gray-900 leading-none">
              {averageRating.toFixed(1)}
            </span>
            <StarRow score={Math.round(averageRating)} size={16} />
            <span className="text-[11px] text-gray-400 mt-0.5">
              {totalRatings} review{totalRatings !== 1 && "s"}
            </span>
          </div>
          {/* bars */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map((s) => (
              <ScoreBar
                key={s}
                label={s}
                count={scoreCounts[s] ?? 0}
                total={totalRatings}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── write review form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mb-6 pb-6 border-b border-gray-100">
              <p className="text-[13px] font-semibold text-gray-700 mb-4">
                Your review
              </p>

              {/* stars */}
              <div className="mb-4">
                <label className="text-[12px] text-gray-500 mb-1.5 block">
                  Rating
                </label>
                <StarRow
                  score={score}
                  interactive
                  onSelect={setScore}
                  size={26}
                />
                {errors.score && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.score}
                  </p>
                )}
              </div>

              {/* heading */}
              <div className="mb-3">
                <label className="text-[12px] text-gray-500 mb-1.5 block">
                  Heading
                </label>
                <input
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Summarise your experience…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200
                             text-[13px] text-gray-800 placeholder-gray-300
                             focus:outline-none focus:ring-2 focus:ring-blue-400/40
                             focus:border-blue-400 transition"
                />
                {errors.heading && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.heading}
                  </p>
                )}
              </div>

              {/* comment */}
              <div className="mb-4">
                <label className="text-[12px] text-gray-500 mb-1.5 block">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share more details about your visit…"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200
                             text-[13px] text-gray-800 placeholder-gray-300
                             focus:outline-none focus:ring-2 focus:ring-blue-400/40
                             focus:border-blue-400 transition resize-none"
                />
                {errors.comment && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.comment}
                  </p>
                )}
              </div>

              {isError && (
                <p className="text-[12px] text-red-500 mb-3">
                  Something went wrong. Please try again.
                </p>
              )}

              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[13px]
                             font-semibold hover:bg-blue-700 disabled:opacity-50
                             transition-colors"
                >
                  {isPending ? "Submitting…" : "Submit review"}
                </motion.button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-[13px]
                             text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── reviews list ── */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : ratings.length > 0 ? (
        <motion.div className="flex flex-col gap-3">
          <AnimatePresence>
            {ratings.map((item, idx) => (
              <ReviewCard key={item.id ?? idx} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="text-[13px] text-gray-400 text-center py-6">
          No reviews yet.
        </p>
      )}
    </div>
  );
}
