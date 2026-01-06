import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import { useDoctors } from "../hooks/useDoctors";
import { useMajors } from "../hooks/useMajors";

export default function DoctorsListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSpecializationId, setSelectedSpecializationId] =
    useState(null);
  const [sortedByRating, setSortedByRating] = useState(null); // null = default, true = highest, false = lowest
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const specialtiesRef = useRef(null);

  const handleDoctorClick = (doctor) => {
    const doctorId = doctor.id || doctor.profileId || doctor.userId;
    if (doctorId) {
      navigate(`/doctor/profile/${doctorId}`);
    }
  };

  // Use Search API with pagination and filters
  const genderValue =
    selectedGender === "all" ? null : selectedGender === "male" ? 0 : 1;
  const { data: doctorsResponse, isLoading: doctorsLoading } = useDoctors(
    currentPage,
    pageSize,
    searchTerm,
    selectedSpecializationId,
    genderValue,
    sortedByRating
  );

  // Extract doctors list from response
  const doctors = doctorsResponse?.doctors || [];

  // Extract pagination info from backend
  const totalPages = doctorsResponse?.totalPages || 1;
  const hasNext = doctorsResponse?.hasNext || false;
  const hasPrevious = doctorsResponse?.hasPrevious || false;

  const { data: majors = [], isLoading: majorsLoading } = useMajors("doctor");

  // Backend handles all filtering and pagination, so use doctors directly
  const filteredDoctors = doctors;

  const currentPageSafe = Math.min(currentPage, totalPages);

  // Backend already paginated, so use doctors directly
  const paginatedDoctors = filteredDoctors;

  const handleNextPage = () => {
    if (hasNext) setCurrentPage(currentPageSafe + 1);
  };

  const handlePrevPage = () => {
    if (hasPrevious) setCurrentPage(currentPageSafe - 1);
  };

  const getSpecializationForDoctor = (doctor) => {
    if (!doctor || !majors?.length) return null;

    const specId =
      doctor.specializationId ||
      doctor.specialiaztionId ||
      doctor.specializationID ||
      doctor.specialiaztionID;

    if (!specId) return null;

    return majors.find((major) => String(major.id) === String(specId));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col pt-[90px]">
      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Search + filter bar */}
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm shadow-sm"
            >
              <MdFilterList className="text-gray-500 w-4 h-4" />
              <span className="font-medium">Filter</span>
            </button>

            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-[#316BE8] placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Layout: column on mobile, side-by-side from md and up */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left filters column */}
            <aside className="w-full md:w-60 md:shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 md:h-[380px] md:overflow-y-auto md:sticky md:top-[110px]">
              {/* Gender */}
              <section className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 mb-2">
                  Gender
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGender("all")}
                    className={`flex-1 py-1.5 text-xs rounded-full border ${
                      selectedGender === "all"
                        ? "bg-[#316BE8] text-white border-[#316BE8]"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGender("male");
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1.5 text-xs rounded-full border ${
                      selectedGender === "male"
                        ? "bg-[#316BE8] text-white border-[#316BE8]"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGender("female");
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1.5 text-xs rounded-full border ${
                      selectedGender === "female"
                        ? "bg-[#316BE8] text-white border-[#316BE8]"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </section>

              {/* Sort */}
              <section className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 mb-2">
                  Sort
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortedByRating === null}
                      onChange={() => {
                        setSortedByRating(null);
                        setCurrentPage(1);
                      }}
                    />
                    <span>Most recommended</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortedByRating === true}
                      onChange={() => {
                        setSortedByRating(true);
                        setCurrentPage(1);
                      }}
                    />
                    <span>Highest Rating</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortedByRating === false}
                      onChange={() => {
                        setSortedByRating(false);
                        setCurrentPage(1);
                      }}
                    />
                    <span>Lowest Rating</span>
                  </label>
                </div>
              </section>

              {/* Consultation Type
              <section>
                <h3 className="text-xs font-semibold text-gray-500 mb-2">
                  Consultation Type
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" disabled />
                    <span>Online</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" disabled />
                    <span>Offline</span>
                  </label>
                </div>
                {/* TODO: ask backend to support filtering by consultation type (online / offline) */}
              {/* </section> */}
            </aside>

            {/* Right content column */}
            <section className="flex-1 min-w-0">
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Choose Specialties
              </h2>

              {/* Specialties pills - horizontal scroll with arrows */}
              <div className="flex items-center gap-2 mb-6">
                {/* Left arrow */}
                <button
                  type="button"
                  onClick={() =>
                    specialtiesRef.current?.scrollBy({
                      left: -200,
                      behavior: "smooth",
                    })
                  }
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                  <HiChevronLeft className="w-4 h-4" />
                </button>

                {/* Scrollable row - shows as many as fit in width, rest scroll */}
                <div
                  ref={specialtiesRef}
                  className="flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <div className="inline-flex gap-2 whitespace-nowrap pr-2">
                    {majorsLoading ? (
                      <p className="text-sm text-gray-500">
                        Loading specialties...
                      </p>
                    ) : (
                      majors?.map((major) => (
                        <button
                          key={major.id}
                          type="button"
                          onClick={() => {
                            setSelectedSpecializationId(
                              selectedSpecializationId === major.id
                                ? null
                                : major.id
                            );
                            setCurrentPage(1);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
                            String(selectedSpecializationId) ===
                            String(major.id)
                              ? "bg-[#316BE8] text-white border-[#316BE8]"
                              : "bg-white text-gray-700 border-gray-200"
                          }`}
                        >
                          {(major.iconpath || major.iconPath) && (
                            <span className="w-6 h-6 rounded-full bg-[#F5F7FB] flex items-center justify-center">
                              <img
                                src={major.iconpath || major.iconPath}
                                alt={major.name}
                                className="w-4 h-4 object-contain"
                              />
                            </span>
                          )}
                          <span>{major.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Right arrow */}
                <button
                  type="button"
                  onClick={() =>
                    specialtiesRef.current?.scrollBy({
                      left: 200,
                      behavior: "smooth",
                    })
                  }
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Doctors grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {doctorsLoading ? (
                  <p className="text-sm text-gray-500 col-span-full">
                    Loading doctors...
                  </p>
                ) : paginatedDoctors.length === 0 ? (
                  <p className="text-sm text-gray-500 col-span-full">
                    No doctors found.
                  </p>
                ) : (
                  paginatedDoctors.map((doctor) => {
                    const specialization = getSpecializationForDoctor(doctor);

                    // TODO: Ask backend to add fields like:
                    // - totalReviews
                    // - imageUrl / avatarUrl

                    return (
                      <article
                        key={doctor.id}
                        className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col"
                      >
                        <div className="p-4 flex flex-col flex-1 gap-3">
                          {/* Top: image + name/speciality + favourite */}
                          <div className="flex items-center gap-3">
                            {/* Image placeholder - clickable */}
                            <div
                              onClick={() => handleDoctorClick(doctor)}
                              className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              {/* TODO: replace with doctor image when backend provides imageUrl */}
                              <span className="text-3xl text-gray-400">👨‍⚕️</span>
                            </div>

                            <div className="flex-1">
                              <h3
                                onClick={() => handleDoctorClick(doctor)}
                                className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-[#316BE8] transition-colors"
                              >
                                {doctor.name ||
                                  `${doctor.firstName || ""} ${
                                    doctor.lastName || ""
                                  }`.trim() ||
                                  "N/A"}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {doctor.specialization ||
                                  specialization?.name ||
                                  "N/A"}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                  <FaStar className="text-yellow-400" />
                                  <span className="font-semibold text-gray-700">
                                    {doctor?.averageRating != null
                                      ? Number(doctor.averageRating).toFixed(1)
                                      : "0.0"}
                                  </span>
                                </div>

                                {/* Favourite icon aligned with rating */}
                                <button
                                  type="button"
                                  className="text-[#316BE8] hover:text-[#274fb3]"
                                >
                                  <IoIosHeartEmpty className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Button */}
                          <button
                            type="button"
                            onClick={() => handleDoctorClick(doctor)}
                            className="mt-2 w-full py-2 rounded-lg bg-[#316BE8] text-white text-xs font-semibold hover:bg-[#2552c1] transition"
                          >
                            Book appointment
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPageSafe === 1}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPageSafe} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPageSafe === totalPages}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
                >
                  Next Page
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
