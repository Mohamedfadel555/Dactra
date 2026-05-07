import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useGetSiteReviews } from "../../hooks/useGetSiteReviews";
import { useSendReviews } from "../../hooks/useSendReviews";

/* ─── helpers ──────────────────────────────────────────── */
function getInitials(name = "") {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* ─── Stars ────────────────────────────────────────────── */
function Stars({ score = 0, size = "text-sm", interactive = false, onSelect }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || score;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => interactive && onSelect?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${size} transition-all duration-150 select-none leading-none
            ${s <= active ? "text-amber-400" : "text-blue-100"}
            ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"}
          `}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─── Avatar ───────────────────────────────────────────── */
function Avatar({ name, imageUrl, className = "w-11 h-11" }) {
  const [imgErr, setImgErr] = useState(false);
  if (imageUrl && !imgErr) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setImgErr(true)}
        className={`${className} rounded-full object-cover shrink-0 ring-2 ring-blue-100`}
      />
    );
  }
  return (
    <div
      className={`${className} rounded-full shrink-0 bg-blue-600 flex items-center justify-center
        text-white font-bold tracking-wide`}
      style={{ fontSize: "clamp(11px, 1.8vw, 15px)" }}
    >
      {getInitials(name)}
    </div>
  );
}

/* ─── Animated bar ─────────────────────────────────────── */
function AnimatedBar({ pct, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      className="flex-1 bg-blue-50 rounded-full h-3 overflow-hidden"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: inView ? `${pct}%` : 0 }}
        transition={{ duration: 1.1, delay, ease: [0.4, 0, 0.2, 1] }}
        className="h-full bg-blue-600 rounded-full"
      />
    </div>
  );
}

/* ─── Review card ──────────────────────────────────────── */
function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.09,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white border border-blue-100 rounded-2xl p-6 lg:p-7 flex flex-col gap-4
        relative overflow-hidden shadow-sm hover:shadow-md hover:shadow-blue-100 transition-shadow duration-300"
    >
      {/* top accent */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-blue-600 rounded-t-2xl" />

      {/* big decorative quote */}
      <span
        className="absolute bottom-3 right-5 text-6xl leading-none text-blue-50
        font-serif pointer-events-none select-none"
      >
        "
      </span>

      {/* reviewer */}
      <div className="flex items-center gap-3">
        <Avatar name={review.reviewerName} imageUrl={review.reviewerImageUrl} />
        <div>
          <p className="font-bold text-slate-800 text-sm lg:text-base leading-tight">
            {review.reviewerName || "Anonymous"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      <Stars score={review.score} size="text-sm" />

      {review.title && (
        <p className="font-bold text-slate-800 text-sm lg:text-base leading-snug">
          {review.title}
        </p>
      )}

      <p className="text-sm lg:text-[15px] text-slate-500 leading-relaxed flex-1">
        {review.comment}
      </p>
    </motion.div>
  );
}

/* ─── Skeleton ─────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-52 rounded-2xl bg-blue-50 animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────── */
export default function ReviewsSection({ role }) {
  const queryClient = useQueryClient();
  const { data: apiData, isLoading, isError } = useGetSiteReviews();
  const sendReviewMutation = useSendReviews();

  const reviews = apiData?.data ?? [];
  const count = apiData?.count ?? reviews.length;
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1)
      : "0.0";
  const satisfaction =
    reviews.length > 0
      ? Math.round(
          (reviews.filter((r) => r.score >= 4).length / reviews.length) * 100,
        )
      : 0;

  const dist = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => r.score === star).length;
    return {
      star,
      n,
      pct: reviews.length ? Math.round((n / reviews.length) * 100) : 0,
    };
  });

  /* pagination */
  const PER_PAGE = 3;
  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  const [page, setPage] = useState(0);
  const visible = reviews.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000);
    return () => clearInterval(t);
  }, [totalPages]);

  /* form */
  const canReview = role === "Patient" || role === "Doctor";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", score: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.comment.trim()) {
      setFormError("Please write a comment before submitting.");
      return;
    }
    try {
      await sendReviewMutation.mutateAsync({
        title: form.title.trim(),
        score: Number(form.score),
        comment: form.comment.trim(),
      });
      /* refetch reviews so the new one appears */
      await queryClient.invalidateQueries({ queryKey: ["sitereviews"] });
      setForm({ title: "", score: 5, comment: "" });
      setShowForm(false);
      setPage(0);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setFormError(
        err?.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-16 py-10">
      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {/* Average score hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="bg-blue-600 rounded-2xl p-8 xl:p-10 flex flex-col items-center
            justify-center gap-3 md:col-span-2 xl:col-span-1 shadow-lg shadow-blue-200"
        >
          <p className="text-7xl xl:text-8xl font-extrabold text-white leading-none tabular-nums">
            {isLoading ? "—" : avg}
          </p>
          <Stars
            score={isLoading ? 0 : Math.round(parseFloat(avg))}
            size="text-2xl"
          />
          <p className="text-blue-200 text-sm mt-1">
            {isLoading
              ? "Loading…"
              : `Based on ${count} review${count !== 1 ? "s" : ""}`}
          </p>
        </motion.div>

        {/* Mini stat cards */}
        {[
          {
            icon: "ti-message-circle",
            val: isLoading ? "—" : count,
            label: "Total reviews",
          },
          {
            icon: "ti-thumb-up",
            val: isLoading ? "—" : `${satisfaction}%`,
            label: "Patient satisfaction",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
            className="bg-white border border-blue-100 rounded-2xl p-6 xl:p-8
              flex items-center gap-5 shadow-sm"
          >
            <div
              className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-blue-50
              flex items-center justify-center shrink-0"
            >
              <i
                className={`ti ${s.icon} text-blue-600 text-2xl xl:text-3xl`}
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-3xl xl:text-4xl font-extrabold text-slate-900 leading-none tabular-nums">
                {s.val}
              </p>
              <p className="text-sm xl:text-base text-slate-400 mt-1">
                {s.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Rating breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="bg-white border border-blue-100 rounded-2xl p-6 xl:p-8 mb-10 shadow-sm"
      >
        <p className="text-sm xl:text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <i
            className="ti ti-chart-bar text-blue-600 text-base"
            aria-hidden="true"
          />
          Rating breakdown
        </p>
        <div className="flex flex-col gap-3.5">
          {dist.map((d, i) => (
            <div key={d.star} className="flex items-center gap-3 xl:gap-4">
              <span className="text-xs xl:text-sm text-slate-400 w-10 flex items-center gap-1 shrink-0">
                {d.star}
                <span className="text-amber-400">★</span>
              </span>
              <AnimatedBar pct={d.pct} delay={0.3 + i * 0.07} />
              <span className="text-xs xl:text-sm text-slate-400 w-6 text-right tabular-nums shrink-0">
                {d.n}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Write a review button ── */}
      {canReview && (
        <div className="text-center mb-6">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl px-7 py-3.5
              text-sm xl:text-base font-bold transition-colors duration-200 cursor-pointer border-0
              ${
                showForm
                  ? "bg-blue-50 text-blue-600"
                  : "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700"
              }`}
          >
            <i
              className={`ti ${showForm ? "ti-x" : "ti-plus"} text-base`}
              aria-hidden="true"
            />
            {showForm ? "Close" : "Write a review"}
          </motion.button>
        </div>
      )}

      {/* ── Success toast ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5
              text-center text-emerald-700 text-sm font-semibold mb-6"
          >
            ✓ Your review was submitted successfully — thank you!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form ── */}
      <AnimatePresence>
        {showForm && canReview && (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden mb-8"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-blue-100 rounded-2xl p-6 xl:p-8
                flex flex-col gap-5 shadow-sm"
            >
              <p className="text-base xl:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <i
                  className="ti ti-edit text-blue-600 text-lg"
                  aria-hidden="true"
                />
                Share your experience
              </p>

              {/* title + stars row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <input
                  type="text"
                  placeholder="Review title (optional)"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="flex-1 h-11 xl:h-12 rounded-xl border border-blue-200 bg-blue-50
                    px-4 text-sm xl:text-base text-slate-800 placeholder-slate-400 outline-none
                    focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className="flex items-center gap-1 border border-blue-200 bg-blue-50
                    rounded-xl px-4 py-2.5"
                  >
                    <Stars
                      score={form.score}
                      size="text-2xl"
                      interactive
                      onSelect={(s) => setForm((p) => ({ ...p, score: s }))}
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    {form.score} star{form.score > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <textarea
                rows={4}
                required
                placeholder="Tell us about your experience with the platform…"
                value={form.comment}
                onChange={(e) =>
                  setForm((p) => ({ ...p, comment: e.target.value }))
                }
                className="w-full rounded-xl border border-blue-200 bg-blue-50 p-4
                  text-sm xl:text-base text-slate-800 placeholder-slate-400 outline-none resize-none
                  focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all
                  leading-relaxed"
              />

              {formError && (
                <p className="text-red-500 text-sm text-center">{formError}</p>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-50 text-slate-500 text-sm font-semibold
                    hover:bg-blue-100 transition-colors cursor-pointer border-0"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  disabled={sendReviewMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600
                    text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer
                    border-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                >
                  <i className="ti ti-send text-sm" aria-hidden="true" />
                  {sendReviewMutation.isPending
                    ? "Submitting…"
                    : "Submit review"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cards ── */}
      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <p className="text-center py-16 text-red-400 text-sm">
          Failed to load reviews. Please try again later.
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-center py-16 text-slate-400 text-sm">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8"
            >
              {visible.map((r, i) => (
                <ReviewCard key={r.id} review={r} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() =>
                  setPage((p) => (p - 1 + totalPages) % totalPages)
                }
                aria-label="Previous page"
                className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-white border border-blue-200
                  flex items-center justify-center text-blue-600 text-xl font-bold
                  hover:bg-blue-50 transition-colors cursor-pointer"
              >
                ‹
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`rounded-full border-0 cursor-pointer transition-all duration-200
                      ${
                        i === page
                          ? "w-6 h-2.5 bg-blue-600"
                          : "w-2.5 h-2.5 bg-blue-200 hover:bg-blue-400"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setPage((p) => (p + 1) % totalPages)}
                aria-label="Next page"
                className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-white border border-blue-200
                  flex items-center justify-center text-blue-600 text-xl font-bold
                  hover:bg-blue-50 transition-colors cursor-pointer"
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
