import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function LabsManagementPage() {
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // TODO: Replace with actual API endpoint when backend is ready
  const { data: labsData, isLoading } = useQuery({
    queryKey: ["admin-labs", page, pageSize],
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

  const filteredLabs = (labsData?.items || []).filter((lab) => {
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
      label: "Location",
      key: "location",
      render: (lab) => (
        <span className="text-sm text-gray-600">{lab.location || "N/A"}</span>
      ),
    },
    {
      label: "Contact",
      key: "contact",
      render: (lab) => (
        <span className="text-sm text-gray-600">{lab.contact || "N/A"}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (lab) => {
        const status = lab.status || "Pending";
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
    // TODO: Implement view lab details
  };

  const handleApprove = async (lab) => {
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`MedicalTestsProvider/Approve/${lab.id}`);
      toast.success("Lab approved successfully!");
    } catch (error) {
      toast.error("Failed to approve lab");
    }
  };

  const handleBlock = async (lab) => {
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`MedicalTestsProvider/Block/${lab.id}`);
      toast.success("Lab blocked successfully!");
    } catch (error) {
      toast.error("Failed to block lab");
    }
  };

  const handleDelete = async (lab) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      try {
        await adminAPI.deleteAppUser(lab.id);
        toast.success("Lab deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete lab");
      }
    }
  };

  const hasMore = labsData?.totalPages && page < labsData.totalPages;

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
        onBlock={handleBlock}
        onDelete={handleDelete}
        showMore={true}
        hasMore={hasMore}
        onShowMore={() => setPage((p) => p + 1)}
      />
    </div>
  );
}

