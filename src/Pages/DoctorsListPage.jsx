import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MdFilterList, MdClose } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import { useDoctors } from "../hooks/useDoctors";
import { useMajors } from "../hooks/useMajors";

/* ─── inject keyframes once ─── */
const KEYFRAMES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0);    }
}
`;
if (!document.getElementById("dactra-kf")) {
  const s = document.createElement("style");
  s.id = "dactra-kf";
  s.textContent = KEYFRAMES;
  document.head.appendChild(s);
}

/* ─── debounce hook — delays API call until user stops typing ─── */
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ─── design tokens ─── */
const C = {
  primary: "#316BE8",
  primaryHover: "#2558cc",
  primaryAlpha: "rgba(49,107,232,0.09)",
  green: "#16a34a",
  greenAlpha: "rgba(22,163,74,0.08)",
  border: "#e8edf5",
  borderHover: "rgba(49,107,232,0.22)",
  bg: "#F4F7FC",
  white: "#fff",
  text: "#111827",
  muted: "#6b7280",
  hint: "#9ca3af",
  red: "#ef4444",
};

const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: C.hint,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 10,
};

const arrowBtnStyle = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: `0.5px solid ${C.border}`,
  background: C.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  color: C.muted,
  transition: "background 0.15s",
};

/* ─── Skeleton card ─── */
function SkeletonCard() {
  const sh = {
    background: `linear-gradient(90deg, #eff2f8 25%, #e2e8f4 50%, #eff2f8 75%)`,
    backgroundSize: "600px 100%",
    animation: "shimmer 1.5s infinite linear",
    borderRadius: 8,
  };
  return (
    <article
      style={{
        background: C.white,
        border: `0.5px solid ${C.border}`,
        borderRadius: radius.lg,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              flexShrink: 0,
              ...sh,
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 9,
              paddingTop: 4,
            }}
          >
            <div style={{ height: 14, width: "68%", ...sh }} />
            <div style={{ height: 12, width: "44%", ...sh }} />
            <div style={{ height: 12, width: "32%", ...sh }} />
          </div>
        </div>
        <div style={{ height: 40, borderRadius: 10, ...sh }} />
      </div>
    </article>
  );
}

/* ─── Spec pill ─── */
function SpecPill({ active, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: radius.pill,
        border: active ? "none" : `0.5px solid ${hov ? C.primary : C.border}`,
        background: active ? C.primary : hov ? C.primaryAlpha : C.white,
        color: active ? "#fff" : hov ? C.primary : C.muted,
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.18s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Pagination button ─── */
function PageBtn({ disabled, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "9px 22px",
        borderRadius: radius.pill,
        border: `0.5px solid ${hov && !disabled ? C.primary : C.border}`,
        background: hov && !disabled ? C.primaryAlpha : C.white,
        color: disabled ? C.hint : hov ? C.primary : C.muted,
        fontSize: 13,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Filter panel ─── */
function FilterPanel({
  selectedGender,
  setSelectedGender,
  sortedByRating,
  setSortedByRating,
  setCurrentPage,
}) {
  return (
    <div style={{ animation: "slideDown 0.22s ease both" }}>
      {/* Gender */}
      <div style={{ marginBottom: 22 }}>
        <p style={labelStyle}>Gender</p>
        <div style={{ display: "flex", gap: 5 }}>
          {["all", "male", "female"].map((g) => {
            const active = selectedGender === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setSelectedGender(g);
                  setCurrentPage(1);
                }}
                style={{
                  flex: 1,
                  padding: "7px 4px",
                  borderRadius: radius.pill,
                  border: active ? "none" : `0.5px solid ${C.border}`,
                  background: active ? C.primary : "#f8f9fb",
                  color: active ? "#fff" : C.muted,
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p style={labelStyle}>Sort by</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Most recommended", value: null },
            { label: "Highest rating", value: true },
            { label: "Lowest rating", value: false },
          ].map(({ label, value }) => (
            <label
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                fontSize: 13,
                color: C.muted,
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="sort"
                style={{ accentColor: C.primary, width: 14, height: 14 }}
                checked={sortedByRating === value}
                onChange={() => {
                  setSortedByRating(value);
                  setCurrentPage(1);
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Doctor card ─── */
function DoctorCard({
  doctor,
  specialization,
  isFav,
  onToggleFav,
  onClick,
  index,
}) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const name =
    doctor.name ||
    `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim() ||
    "N/A";

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const spec = doctor.specialization || specialization?.name || "";
  const rating =
    doctor?.averageRating != null
      ? Number(doctor.averageRating).toFixed(1)
      : "0.0";

  const imgSrc =
    doctor.imageUrl ||
    doctor.profileImageUrl ||
    doctor.image ||
    doctor.doctorImageUrl ||
    doctor.imgUrl ||
    "";

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        border: `0.5px solid ${hovered ? C.borderHover : C.border}`,
        borderRadius: radius.lg,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        animation: `fadeUp 0.32s ease both`,
        animationDelay: `${index * 50}ms`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 36px rgba(49,107,232,0.10)" : "none",
        transition:
          "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
      }}
    >
      <div style={{ padding: "18px 18px 0" }}>
        {/* Avatar + info */}
        <div
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 14,
            alignItems: "flex-start",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              overflow: "hidden",
              flexShrink: 0,
              background: C.primaryAlpha,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imgSrc && !imgError ? (
              <img
                src={imgSrc}
                alt={name}
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: C.primary,
                  userSelect: "none",
                }}
              >
                {initials}
              </span>
            )}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: hovered ? C.primary : C.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: 4,
                transition: "color 0.18s",
              }}
            >
              {name}
            </p>

            {spec && (
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
                {spec}
              </p>
            )}

            {/* Rating + fav */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <FaStar style={{ color: "#FBBF24", fontSize: 13 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {rating}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFav();
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 3,
                  lineHeight: 1,
                  color: isFav ? C.red : C.primary,
                  transition: "transform 0.18s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {isFav ? (
                  <IoIosHeart style={{ width: 20, height: 20 }} />
                ) : (
                  <IoIosHeartEmpty style={{ width: 20, height: 20 }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Price badges */}
        {(doctor.onlinePrice || doctor.offlinePrice) && (
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {doctor.onlinePrice && (
              <span
                style={{
                  flex: 1,
                  fontSize: 11,
                  padding: "5px 8px",
                  borderRadius: 7,
                  textAlign: "center",
                  background: C.primaryAlpha,
                  color: C.primary,
                  fontWeight: 500,
                }}
              >
                Online · {doctor.onlinePrice} EGP
              </span>
            )}
            {doctor.offlinePrice && (
              <span
                style={{
                  flex: 1,
                  fontSize: 11,
                  padding: "5px 8px",
                  borderRadius: 7,
                  textAlign: "center",
                  background: C.greenAlpha,
                  color: C.green,
                  fontWeight: 500,
                }}
              >
                Offline · {doctor.offlinePrice} EGP
              </span>
            )}
          </div>
        )}
      </div>

      {/* Book button */}
      <div style={{ padding: "0 18px 18px", marginTop: "auto" }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            width: "100%",
            padding: "10px 0",
            border: "none",
            borderRadius: 10,
            background: C.primary,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s, transform 0.1s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = C.primaryHover)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Book appointment
        </button>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function DoctorsListPage() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSpecializationId, setSelectedSpecializationId] =
    useState(null);
  const [sortedByRating, setSortedByRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favouriteDoctorIds, setFavouriteDoctorIds] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const pageSize = 9;
  const specialtiesRef = useRef(null);
  const favStorageKey = "dactra_favourite_doctors";

  /* Debounced search — no request fires while user is still typing */
  const searchTerm = useDebounce(searchInput, 500);

  /* Reset to page 1 when search changes */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* Load favourites */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(favStorageKey) || "[]");
      setFavouriteDoctorIds(Array.isArray(saved) ? saved : []);
    } catch {
      setFavouriteDoctorIds([]);
    }
  }, []);

  const toggleFavouriteDoctor = useCallback((doctor) => {
    const doctorId = doctor.id || doctor.profileId || doctor.userId;
    if (!doctorId) return;
    setFavouriteDoctorIds((prev) => {
      const id = String(doctorId);
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem(favStorageKey, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleDoctorClick = useCallback(
    (doctor) => {
      const id = doctor.id || doctor.profileId || doctor.userId;
      if (id) navigate(`/doctor/profile/${id}`);
    },
    [navigate],
  );

  /* API */
  const genderValue =
    selectedGender === "all" ? null : selectedGender === "male" ? 0 : 1;

  const { data: doctorsResponse, isLoading: doctorsLoading } = useDoctors(
    currentPage,
    pageSize,
    searchTerm,
    selectedSpecializationId,
    genderValue,
    sortedByRating,
  );

  const doctors = doctorsResponse?.doctors || [];
  const totalPages = doctorsResponse?.totalPages || 1;
  const hasNext = doctorsResponse?.hasNext || false;
  const hasPrev = doctorsResponse?.hasPrevious || false;
  const currentPageSafe = Math.min(currentPage, totalPages);

  const { data: majors = [], isLoading: majorsLoading } = useMajors("doctor");

  const getSpecialization = (doctor) => {
    if (!doctor || !majors?.length) return null;
    const specId =
      doctor.specializationId ||
      doctor.specialiaztionId ||
      doctor.specializationID ||
      doctor.specialiaztionID;
    if (!specId) return null;
    return majors.find((m) => String(m.id) === String(specId));
  };

  /* ════════════════ RENDER ════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingTop: 90 }}>
      <main
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}
      >
        {/* ── Search bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {/* Filter toggle */}
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 16px",
              border: `0.5px solid ${filterOpen ? C.primary : C.border}`,
              borderRadius: radius.md,
              background: filterOpen ? C.primaryAlpha : C.white,
              color: filterOpen ? C.primary : C.muted,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.18s",
              whiteSpace: "nowrap",
            }}
          >
            {filterOpen ? (
              <MdClose style={{ width: 16, height: 16 }} />
            ) : (
              <MdFilterList style={{ width: 16, height: 16 }} />
            )}
            {filterOpen ? "Close" : "Filter"}
          </button>

          {/* Search input */}
          <div style={{ flex: 1, position: "relative" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.hint,
                width: 15,
                height: 15,
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search doctors by name…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                border: `0.5px solid ${C.border}`,
                borderRadius: radius.md,
                background: C.white,
                fontSize: 13,
                color: C.text,
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = C.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(49,107,232,0.09)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* ── Layout ── */}
        <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
          {/* Sidebar — shown only when filterOpen */}
          {filterOpen && (
            <aside
              style={{
                width: 220,
                flexShrink: 0,
                background: C.white,
                border: `0.5px solid ${C.border}`,
                borderRadius: radius.lg,
                padding: 20,
                position: "sticky",
                top: 100,
              }}
            >
              <FilterPanel
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                sortedByRating={sortedByRating}
                setSortedByRating={setSortedByRating}
                setCurrentPage={setCurrentPage}
              />
            </aside>
          )}

          {/* Main content */}
          <section style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: C.text,
                marginBottom: 14,
              }}
            >
              Choose specialty
            </p>

            {/* Specialties row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <button
                type="button"
                style={arrowBtnStyle}
                onClick={() =>
                  specialtiesRef.current?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                  })
                }
              >
                <HiChevronLeft style={{ width: 16, height: 16 }} />
              </button>

              <div
                ref={specialtiesRef}
                style={{ flex: 1, overflowX: "auto", scrollbarWidth: "none" }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    gap: 7,
                    whiteSpace: "nowrap",
                    paddingBottom: 2,
                  }}
                >
                  <SpecPill
                    active={selectedSpecializationId === null}
                    onClick={() => {
                      setSelectedSpecializationId(null);
                      setCurrentPage(1);
                    }}
                  >
                    All
                  </SpecPill>

                  {majorsLoading ? (
                    <span
                      style={{ fontSize: 12, color: C.hint, padding: "7px 0" }}
                    >
                      Loading…
                    </span>
                  ) : (
                    majors?.map((major) => {
                      const active =
                        String(selectedSpecializationId) === String(major.id);
                      const icon = major.iconpath || major.iconPath;
                      return (
                        <SpecPill
                          key={major.id}
                          active={active}
                          onClick={() => {
                            setSelectedSpecializationId(
                              selectedSpecializationId === major.id
                                ? null
                                : major.id,
                            );
                            setCurrentPage(1);
                          }}
                        >
                          {icon && (
                            <span
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: active
                                  ? "rgba(255,255,255,0.2)"
                                  : C.primaryAlpha,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={icon}
                                alt={major.name}
                                style={{
                                  width: 13,
                                  height: 13,
                                  objectFit: "contain",
                                }}
                              />
                            </span>
                          )}
                          {major.name}
                        </SpecPill>
                      );
                    })
                  )}
                </div>
              </div>

              <button
                type="button"
                style={arrowBtnStyle}
                onClick={() =>
                  specialtiesRef.current?.scrollBy({
                    left: 200,
                    behavior: "smooth",
                  })
                }
              >
                <HiChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Doctors grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
                marginBottom: 32,
              }}
            >
              {doctorsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : doctors.length === 0 ? (
                <p
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    fontSize: 14,
                    color: C.hint,
                    padding: "56px 0",
                  }}
                >
                  No doctors found.
                </p>
              ) : (
                doctors.map((doctor, index) => {
                  const doctorId = String(
                    doctor.id || doctor.profileId || doctor.userId || "",
                  );
                  return (
                    <DoctorCard
                      key={doctorId || index}
                      doctor={doctor}
                      specialization={getSpecialization(doctor)}
                      isFav={favouriteDoctorIds.includes(doctorId)}
                      onToggleFav={() => toggleFavouriteDoctor(doctor)}
                      onClick={() => handleDoctorClick(doctor)}
                      index={index}
                    />
                  );
                })
              )}
            </div>

            {/* Pagination — hide when only 1 page */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                }}
              >
                <PageBtn
                  disabled={!hasPrev || currentPageSafe === 1}
                  onClick={() => hasPrev && setCurrentPage(currentPageSafe - 1)}
                >
                  ← Previous
                </PageBtn>

                <span style={{ fontSize: 13, color: C.hint }}>
                  Page {currentPageSafe} of {totalPages}
                </span>

                <PageBtn
                  disabled={!hasNext || currentPageSafe === totalPages}
                  onClick={() => hasNext && setCurrentPage(currentPageSafe + 1)}
                >
                  Next →
                </PageBtn>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
