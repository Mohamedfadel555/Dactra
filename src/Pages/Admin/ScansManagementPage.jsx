import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function ScansManagementPage() {
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

  // Fetch all scans info مع search + status
  const { data: scansData, isLoading, refetch } = useQuery({
    queryKey: ["admin-scans", pageSize, searchQuery, statusFilter],
    queryFn: async () => {
      const res = await adminAPI.getAllScansInfo(
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

  // When route changes بين /scans و /scans/new
  useEffect(() => {
    setStatusFilter(isNewRoute ? "0" : "");
  }, [isNewRoute]);

  // Reset pagination when search or status filter changes
  useEffect(() => {
  }, [searchQuery, statusFilter]);

  const allScans = (scansData || []).map((scan) => {
    const approvalStatus =
      typeof scan.approvalStatus === "number" ? scan.approvalStatus : null;

    const isApprovedBool =
      approvalStatus === 1 ||
      scan.isApproved === true ||
      scan.status === "Approved" ||
      scan.statusType === "Approved";

    return {
      ...scan,
      isApproved: isApprovedBool,
    };
  });

  const columns = [
    {
      label: "Name",
      key: "name",
      render: (scan) => (
        <span className="text-sm font-medium text-gray-900">
          {scan.name || "N/A"}
        </span>
      ),
    },
    {
      label: "Phone",
      key: "phoneNumber",
      render: (scan) => (
        <span className="text-sm text-gray-600">{scan.phoneNumber || "N/A"}</span>
      ),
    },
    {
      label: "License No.",
      key: "licenceNo",
      render: (scan) => (
        <span className="text-sm text-gray-600">
          {scan.licenceNo || scan.licenseNumber || "N/A"}
        </span>
      ),
    },
    {
      label: "Address",
      key: "address",
      render: (scan) => (
        <span className="text-sm text-gray-600">{scan.address || "N/A"}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (scan) => {
        const approvalStatus =
          typeof scan.approvalStatus === "number" ? scan.approvalStatus : null;

        let status;
        if (
          approvalStatus === 1 ||
          scan.isApproved === true ||
          scan.status === "Approved" ||
          scan.statusType === "Approved"
        ) {
          status = "Approved";
        } else if (
          approvalStatus === 2 ||
          scan.status === "Rejected" ||
          scan.statusType === "Rejected"
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

  const handleView = (scan) => {
    const scanId = scan.profileId || scan.id || scan.userId || scan.appUserId;
    if (scanId) {
      navigate(`/scan/profile/${scanId}`);
    } else {
      toast.error("Scan center ID not found");
    }
  };

  const handleApprove = async (scan) => {
    const providerId =
      
      scan.id ;

    if (!providerId) {
      toast.error("Scan center ID not found for approve/disapprove");
      return;
    }

    const isCurrentlyApproved = scan.isApproved;
    const providerType = 2; // 2 = Scan

    try {
      if (isCurrentlyApproved) {
        await adminAPI.disapproveProvider(providerType, providerId);
        toast.success("Scan center disapproved successfully!");
      } else {
        await adminAPI.approveProvider(providerType, providerId);
        toast.success("Scan center approved successfully!");
      }

      refetch();
    } catch (error) {
      if (isCurrentlyApproved) {
        toast.error("Failed to disapprove scan center");
      } else {
        toast.error("Failed to approve scan center");
      }
    }
  };

  const handleBlock = async (scan) => {
    const userId =
      scan.id ||
      scan.userId ||
      scan.appUserId ||
      scan.profileId;

    if (!userId) {
      toast.error("Scan center ID not found for block/unblock");
      return;
    }

    const isBlocked = scan.statusType === "Blocked" || scan.isBlocked;
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

      setPage(1);
      setAllLoadedScans([]);
      refetch();
    } catch (error) {
      if (isBlocked) {
        toast.error("Failed to unblock user");
      } else {
        toast.error("Failed to block user");
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {isNewRoute ? "New Scans" : "Scans Management"}
          </h1>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4 space-y-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search scan centers..."
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
        data={allScans}
        isLoading={isLoading}
        onView={handleView}
        onApprove={handleApprove}
        showMore={false}
        hasMore={false}
      />
    </div>
  );
}

