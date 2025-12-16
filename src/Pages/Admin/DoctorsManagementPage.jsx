import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function DoctorsManagementPage() {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // Adjust based on table height

  // Fetch all doctors info with pagination
  const { data: doctorsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-doctors", page, pageSize],
    queryFn: async () => {
      const res = await adminAPI.getAllDoctorsInfo(page, pageSize);
      return res.data; // Array of doctors (paginated)
    },
  });

  // Accumulate pages for "Show more"
  const [allLoadedDoctors, setAllLoadedDoctors] = useState([]);

  useEffect(() => {
    if (doctorsData && Array.isArray(doctorsData) && doctorsData.length > 0) {
      setAllLoadedDoctors((prev) => {
        const existingPageStart = (page - 1) * pageSize;
        const hasPage = prev.length > existingPageStart && prev[existingPageStart] !== undefined;

        if (!hasPage) {
          const newList = [...prev];
          while (newList.length < existingPageStart) {
            newList.push(undefined);
          }
          doctorsData.forEach((doctor) => {
            newList.push(doctor);
          });
          return newList;
        }
        return prev;
      });
    }
  }, [doctorsData, page, pageSize]);

  const allDoctors = allLoadedDoctors.filter(Boolean);

  const filteredDoctors = (allDoctors || []).filter((doctor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(query) ||
      doctor.email?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      label: "Name",
      key: "name",
      render: (doctor) => {
        const initial = doctor.name?.trim()?.[0]?.toUpperCase() || "D";
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {initial}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {doctor.name || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      label: "Email",
      key: "email",
      render: (doctor) => (
        <span className="text-sm text-gray-600">{doctor.email || "N/A"}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (doctor) => {
        const status = doctor.isApproved ? "Approved" : "Pending";
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
    const doctorId = doctor.profileId || doctor.id || doctor.userId || doctor.appUserId;
    if (doctorId) {
      navigate(`/doctor/profile/${doctorId}`);
    } else {
      toast.error("Doctor ID not found");
    }
  };

  const handleApprove = async (doctor) => {
    const providerId =
      doctor.profileId 
      ;

    if (!providerId) {
      toast.error("Doctor ID not found for approve/disapprove");
      return;
    }

    const isCurrentlyApproved = doctor.isApproved;
    const providerType = 0; // 0 = Doctor

    try {
      if (isCurrentlyApproved) {
        await adminAPI.disapproveProvider(providerType, providerId);
        toast.success("Doctor disapproved successfully!");
      } else {
        await adminAPI.approveProvider(providerType, providerId);
        toast.success("Doctor approved successfully!");
      }

      setPage(1);
      setAllLoadedDoctors([]);
      refetch();
    } catch (error) {
      if (isCurrentlyApproved) {
        toast.error("Failed to disapprove doctor");
      } else {
        toast.error("Failed to approve doctor");
      }
    }
  };

  const handleBlock = async (doctor) => {
    const userId =
      doctor.id ||
      doctor.userId ||
      doctor.appUserId ||
      doctor.profileId;

    if (!userId) {
      toast.error("Doctor ID not found for block/unblock");
      return;
    }

    const isBlocked = doctor.statusType === "Blocked" || doctor.isBlocked;
    const action = isBlocked ? "unblock" : "block";

    if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) return;

    try {
      await adminAPI.deleteAppUser(userId);

      if (isBlocked) {
        toast.success("Doctor unblocked successfully!");
      } else {
        toast.success("Doctor blocked successfully!");
      }

      setPage(1);
      setAllLoadedDoctors([]);
      refetch();
    } catch (error) {
      if (isBlocked) {
        toast.error("Failed to unblock doctor");
      } else {
        toast.error("Failed to block doctor");
      }
    }
  };

  const hasMore =
    doctorsData && Array.isArray(doctorsData) && doctorsData.length === pageSize;

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
        showMore={true}
        hasMore={hasMore}
        onShowMore={() => setPage((p) => p + 1)}
      />
    </div>
  );
}

