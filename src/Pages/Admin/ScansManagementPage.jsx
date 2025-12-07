import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function ScansManagementPage() {
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // TODO: Replace with actual API endpoint when backend is ready
  const { data: scansData, isLoading } = useQuery({
    queryKey: ["admin-scans", page, pageSize],
    queryFn: async () => {
      // Placeholder - replace with actual API call
      // const res = await axiosInstance.get(`MedicalTestsProvider/GetAll?pageNumber=${page}&pageSize=${pageSize}`);
      return {
        items: [],
        totalCount: 0,
        pageNumber: page,
        pageSize: pageSize,
        totalPages: 0,
      };
    },
  });

  const filteredScans = (scansData?.items || []).filter((scan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      scan.name?.toLowerCase().includes(query) ||
      scan.location?.toLowerCase().includes(query) ||
      scan.contact?.toLowerCase().includes(query)
    );
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
      label: "Location",
      key: "location",
      render: (scan) => (
        <span className="text-sm text-gray-600">{scan.location || "N/A"}</span>
      ),
    },
    {
      label: "Contact",
      key: "contact",
      render: (scan) => (
        <span className="text-sm text-gray-600">{scan.contact || "N/A"}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (scan) => {
        const status = scan.status || "Pending";
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

  const handleView = (scan) => {
    // TODO: Implement view scan details
  };

  const handleApprove = async (scan) => {
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`MedicalTestsProvider/Approve/${scan.id}`);
      toast.success("Scan center approved successfully!");
    } catch (error) {
      toast.error("Failed to approve scan center");
    }
  };

  const handleBlock = async (scan) => {
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`MedicalTestsProvider/Block/${scan.id}`);
      toast.success("Scan center blocked successfully!");
    } catch (error) {
      toast.error("Failed to block scan center");
    }
  };

  const handleDelete = async (scan) => {
    if (window.confirm("Are you sure you want to delete this scan center?")) {
      try {
        await adminAPI.deleteAppUser(scan.id);
        toast.success("Scan center deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete scan center");
      }
    }
  };

  const hasMore = scansData?.totalPages && page < scansData.totalPages;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Scans Management
          </h1>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4">
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
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredScans}
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

