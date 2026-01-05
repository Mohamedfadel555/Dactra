import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function LabsManagementPage() {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch all labs info with pagination
  const { data: labsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-labs", page, pageSize],
    queryFn: async () => {
      const res = await adminAPI.getAllLabsInfo(page, pageSize);
      return res.data; // Array of labs
    },
  });

  const [allLoadedLabs, setAllLoadedLabs] = useState([]);

  useEffect(() => {
    if (labsData && Array.isArray(labsData) && labsData.length > 0) {
      setAllLoadedLabs((prev) => {
        const existingPageStart = (page - 1) * pageSize;
        const hasPage = prev.length > existingPageStart && prev[existingPageStart] !== undefined;

        if (!hasPage) {
          const newList = [...prev];
          while (newList.length < existingPageStart) {
            newList.push(undefined);
          }
          labsData.forEach((lab) => {
            newList.push(lab);
          });
          return newList;
        }
        return prev;
      });
    }
  }, [labsData, page, pageSize]);

  const allLabs = allLoadedLabs.filter(Boolean);

  const filteredLabs = (allLabs || []).filter((lab) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lab.name?.toLowerCase().includes(query) ||
      lab.location?.toLowerCase().includes(query) ||
      lab.contact?.toLowerCase().includes(query)
    );
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
        const status = lab.isApproved ? "Approved" : "Pending";
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

      setPage(1);
      setAllLoadedLabs([]);
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

      setPage(1);
      setAllLoadedLabs([]);
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Labs Management</h1>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4">
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
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredLabs}
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

