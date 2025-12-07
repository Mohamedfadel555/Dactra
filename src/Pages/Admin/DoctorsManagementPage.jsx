import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function DoctorsManagementPage() {
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // Adjust based on table height

  // TODO: Replace with actual API endpoint when backend is ready
  const { data: doctorsData, isLoading } = useQuery({
    queryKey: ["admin-doctors", page, pageSize],
    queryFn: async () => {
      // Placeholder - replace with actual API call
      // const res = await axiosInstance.get(`Doctor/GetAll?pageNumber=${page}&pageSize=${pageSize}`);
      return {
        items: [],
        totalCount: 0,
        pageNumber: page,
        pageSize: pageSize,
        totalPages: 0,
      };
    },
  });

  const filteredDoctors = (doctorsData?.items || []).filter((doctor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doctor.firstName?.toLowerCase().includes(query) ||
      doctor.lastName?.toLowerCase().includes(query) ||
      doctor.email?.toLowerCase().includes(query) ||
      doctor.phoneNumber?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      label: "Name",
      key: "name",
      render: (doctor) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">
                {doctor.firstName?.[0] || "D"}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {doctor.firstName} {doctor.lastName}
          </span>
        </div>
      ),
    },
    {
      label: "Specialty",
      key: "specialty",
      render: (doctor) => (
        <span className="text-sm text-gray-600">
          {doctor.specializationName || "N/A"}
        </span>
      ),
    },
    {
      label: "Email",
      key: "email",
      render: (doctor) => (
        <span className="text-sm text-gray-600">{doctor.email || "N/A"}</span>
      ),
    },
    {
      label: "Phone",
      key: "phone",
      render: (doctor) => (
        <span className="text-sm text-gray-600">
          {doctor.phoneNumber || "N/A"}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (doctor) => {
        const status = doctor.status || "Pending";
        const statusColors = {
          Pending: "bg-yellow-100 text-yellow-800",
          Approved: "bg-green-100 text-green-800",
          Blocked: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || statusColors.Pending
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const handleView = (doctor) => {
    // TODO: Implement view doctor details
  };

  const handleApprove = async (doctor) => {
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`Doctor/Approve/${doctor.id}`);
      toast.success("Doctor approved successfully!");
    } catch (error) {
      toast.error("Failed to approve doctor");
    }
  };

  const handleBlock = async (doctor) => {
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`Doctor/Block/${doctor.id}`);
      toast.success("Doctor blocked successfully!");
    } catch (error) {
      toast.error("Failed to block doctor");
    }
  };

  const handleDelete = async (doctor) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await adminAPI.deleteAppUser(doctor.id);
        toast.success("Doctor deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete doctor");
      }
    }
  };

  const hasMore =
    doctorsData?.totalPages && page < doctorsData.totalPages;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Doctors Management
          </h1>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredDoctors}
        isLoading={isLoading}
        onView={handleView}
        onApprove={handleApprove}
        onBlock={handleBlock}
        onDelete={handleDelete}
        showMore={true}
        hasMore={hasMore}
        onShowMore={() => setPage((p) => p + 1)}
      />
    </div>
  );
}

