import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function LabsManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isNewRoute = location.pathname.endsWith("/new");
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    isNewRoute ? "0" : ""
  ); // "" => all, 0 => new/pending, 1 => approved, 2 => rejected
  const pageSize = 100;

  // Fetch all labs info مع search + status
  const { data: labsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-labs", pageSize, searchQuery, statusFilter],
    queryFn: async () => {
      const res = await adminAPI.getAllLabsInfo(
        1,
        pageSize,
        searchQuery || null,
        statusFilter === "" ? null : Number(statusFilter)
      );
      const raw = res.data;

      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.items)) return raw.items;
      if (Array.isArray(raw?.data)) return raw.data;
      if (Array.isArray(raw?.$values)) return raw.$values;

      return [];
    },
  });

  // When route changes between /labs and /labs/new, sync default filter
  useEffect(() => {
    setStatusFilter(isNewRoute ? "0" : "");
  }, [isNewRoute]);

  // Reset pagination when search or status filter changes
  useEffect(() => {
    // مجرد تغيير key بتاع useQuery بيعمل refetch
  }, [searchQuery, statusFilter]);

  const allLabs = (labsData || []).map((lab) => {
    const approvalStatus =
      typeof lab.approvalStatus === "number" ? lab.approvalStatus : null;

    const isApprovedBool =
      approvalStatus === 1 ||
      lab.isApproved === true ||
      lab.status === "Approved" ||
      lab.statusType === "Approved";

    return {
      ...lab,
      isApproved: isApprovedBool,
    };
  });

  const columns = [
    {
      label: "Name",
      key: "name",
      render: (lab) => (
        <span className="text-sm font-medium text-gray-900">
          {lab.name || "N/A"}
        </span>
      ),
    },
    {
      label: "Phone",
      key: "phoneNumber",
      render: (lab) => (
        <span className="text-sm text-gray-600">{lab.phoneNumber || "N/A"}</span>
      ),
    },
    {
      label: "License No.",
      key: "licenceNo",
      render: (lab) => (
        <span className="text-sm text-gray-600">
          {lab.licenceNo || lab.licenseNumber || "N/A"}
        </span>
      ),
    },
    {
      label: "Address",
      key: "address",
      render: (lab) => (
        <span className="text-sm text-gray-600">{lab.address || "N/A"}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (lab) => {
        const approvalStatus =
          typeof lab.approvalStatus === "number" ? lab.approvalStatus : null;

        let status;
        if (
          approvalStatus === 1 ||
          lab.isApproved === true ||
          lab.status === "Approved" ||
          lab.statusType === "Approved"
        ) {
          status = "Approved";
        } else if (
          approvalStatus === 2 ||
          lab.status === "Rejected" ||
          lab.statusType === "Rejected"
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

  const handleView = (lab) => {
    const labId = lab.profileId || lab.id || lab.userId || lab.appUserId;
    if (labId) {
      navigate(`/lab/profile/${labId}`);
    } else {
      toast.error("Lab ID not found");
    }
  };

  const handleApprove = async (lab) => {
    const providerId =
      lab.profileId ||
      lab.id ||
      lab.userId ||
      lab.appUserId;

    if (!providerId) {
      toast.error("Lab ID not found for approve/disapprove");
      return;
    }

    const isCurrentlyApproved = lab.isApproved;
    const providerType = 1; // 1 = Lab

    try {
      if (isCurrentlyApproved) {
        await adminAPI.disapproveProvider(providerType, providerId);
        toast.success("Lab disapproved successfully!");
      } else {
        await adminAPI.approveProvider(providerType, providerId);
        toast.success("Lab approved successfully!");
      }

      // مجرد refetch واحد بعد ما الريكوست يخلص
      refetch();
    } catch (error) {
      if (isCurrentlyApproved) {
        toast.error("Failed to disapprove lab");
      } else {
        toast.error("Failed to approve lab");
      }
    }
  };

  const handleBlock = async (lab) => {
    const userId =
      lab.id ;

    if (!userId) {
      toast.error("Lab ID not found for block/unblock");
      return;
    }

    const isBlocked = lab.statusType === "Blocked" || lab.isBlocked;
    const action = isBlocked ? "unblock" : "block";
    const actionText = isBlocked ? "Unblock" : "Block";

    if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) return;

    try {
      await adminAPI.deleteAppUser(userId);

      if (isBlocked) {
        toast.success("User unblocked successfully!");
      } else {
        toast.success("User blocked successfully!");
      }

      refetch();
    } catch (error) {
      if (isBlocked) {
        toast.error("Failed to unblock user");
      } else {
        toast.error("Failed to block user");
      }
    }
  };

  const hasMore =
    labsData && Array.isArray(labsData) && labsData.length === pageSize;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {isNewRoute ? "New Labs" : "Labs Management"}
          </h1>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4 space-y-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search labs..."
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
        data={allLabs}
        isLoading={isLoading}
        onView={handleView}
        onApprove={handleApprove}
        showMore={false}
        hasMore={false}
      />
    </div>
  );
}

