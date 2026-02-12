import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function DoctorsManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isNewRoute = location.pathname.endsWith("/new");
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    isNewRoute ? "0" : ""
  ); // "" => all, 0 => new/pending, 1 => approved, 2 => rejected
  const pageSize = 100; // نجيب لحد 100 في الصفحة الواحدة ونلغى الـ pagination المعقد

  // Fetch all doctors info with search + status filter
  const { data: doctorsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-doctors", pageSize, searchQuery, statusFilter],
    queryFn: async () => {
      const res = await adminAPI.getAllDoctorsInfo(
        1,
        pageSize,
        searchQuery || null,
        statusFilter === "" ? null : Number(statusFilter)
      );
      const raw = res.data;

      // Handle different possible shapes from backend (array, {items}, {$values}, etc.)
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.items)) return raw.items;
      if (Array.isArray(raw?.data)) return raw.data;
      if (Array.isArray(raw?.$values)) return raw.$values;

      return [];
    },
  });

  // When route changes between /doctors and /doctors/new, sync default filter
  useEffect(() => {
    setStatusFilter(isNewRoute ? "0" : "");
  }, [isNewRoute]);

  // Reset pagination when search or status filter changes
  useEffect(() => {
    // مجرد تغيير الـ key بتاع useQuery بيعمل refetch تلقائى
  }, [searchQuery, statusFilter]);

  // Normalise data + نحدد isApproved boolean عشان الـ table يعرف يغيّر الزرار Approve/Disapprove
  const allDoctors = (doctorsData || []).map((doctor) => {
    const approvalStatus =
      typeof doctor.approvalStatus === "number" ? doctor.approvalStatus : null;

    const isApprovedBool =
      approvalStatus === 1 ||
      doctor.isApproved === true ||
      doctor.status === "Approved" ||
      doctor.statusType === "Approved";

    return {
      ...doctor,
      isApproved: isApprovedBool,
    };
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
      label: "License No.",
      key: "licenceNo",
      render: (doctor) => (
        <span className="text-sm text-gray-600">
          {doctor.licenceNo || doctor.licenseNumber || "N/A"}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (doctor) => {
        const approvalStatus =
          typeof doctor.approvalStatus === "number" ? doctor.approvalStatus : null;

        let status;
        if (
          approvalStatus === 1 ||
          doctor.isApproved === true ||
          doctor.status === "Approved" ||
          doctor.statusType === "Approved"
        ) {
          status = "Approved";
        } else if (
          approvalStatus === 2 ||
          doctor.status === "Rejected" ||
          doctor.statusType === "Rejected"
        ) {
          status = "Rejected";
        } else {
          status = "Pending";
        }

        const statusColors = {
          Pending: "bg-yellow-100 text-yellow-800",
          Approved: "bg-green-100 text-green-800",
          Rejected: "bg-red-100 text-red-800",
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

      // Refetch واحد بس بعد ما الريكوست يخلص
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
            {isNewRoute ? "New Doctors" : "Doctors Management"}
          </h1>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4 space-y-2">
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
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm text-gray-600">
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none sm:w-48 px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent bg-white"
            >
              <option value="">All</option>
              <option value="0">New / Pending</option>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={allDoctors}
        isLoading={isLoading}
        onView={handleView}
        onApprove={handleApprove}
        showMore={false}
        hasMore={false}
      />
    </div>
  );
}

