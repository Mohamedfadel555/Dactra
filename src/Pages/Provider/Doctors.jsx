import { MdSearch } from "react-icons/md";
import AdminTable from "../../Components/Admin/AdminTable";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";
import { useState } from "react";
import { useDoctors } from "../../hooks/useDoctors";
import { Deal } from "../../Components/Provider/Deal";

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const pageSize = 9;

  const { data: doctorsResponse, isLoading: doctorsLoading } = useDoctors(
    currentPage,
    pageSize,
    searchTerm,
  );

  const handleDealSubmit = async ({
    doctorId,
    discount,
    description,
    startDate,
    endDate,
  }) => {
    const response = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        discount,
        description,
        startDate,
        endDate,
      }),
    });

    if (!response.ok) {
      throw new Error("فشل إرسال الديل");
    }

    const data = await response.json();
    console.log("Deal created:", data);
  };

  const columns = [
    {
      label: "Name",
      key: "name",
      render: (doctor) => (
        <div className="flex items-center gap-3">
          <AvatarIcon />
          <span className="text-sm font-medium text-gray-900">
            {doctor.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      label: "Speciality",
      key: "speciality",
      render: (doctor) => (
        <span className="text-sm text-gray-600">
          {doctor.specialization || "N/A"}
        </span>
      ),
    },
    {
      label: "Rating",
      key: "rating",
      render: (doctor) => (
        <span className="text-sm text-center text-gray-600">
          {doctor.averageRating || 0}
        </span>
      ),
    },
    {
      label: "Actions",
      key: "actions",
      render: (doctor) => (
        <button
          onClick={() => setSelectedDoctor(doctor)}
          className="bg-blue-600 text-white font-bold flex justify-center items-center text-[12px] rounded-[5px] cursor-pointer py-[8px] px-[8px] hover:bg-blue-700 transition-colors"
        >
          Make a deal
        </button>
      ),
    },
  ];

  return (
    <div className="w-full h-fit flex flex-col gap-[10px]">
      <div className="w-full flex items-center justify-between">
        <p className="text-2xl font-bold">Search for doctors</p>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={doctorsResponse?.doctors || []}
        isLoading={doctorsLoading}
        showMore={false}
        hasMore={false}
      />

      {selectedDoctor && (
        <Deal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSubmit={handleDealSubmit}
        />
      )}
    </div>
  );
}
