import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function PatientsManagementPage() {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch all patient info from API with pagination
  const {
    data: patientsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-patients-info", page, pageSize],
    queryFn: async () => {
      const res = await adminAPI.getAllPatientInfo(page, pageSize);
      return res.data; // Array of patient objects (paginated from backend)
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  // Backend pagination - accumulate all loaded patients for "show more"
  const [allLoadedPatients, setAllLoadedPatients] = useState([]);

  // When new data arrives, add it to the accumulated list
  useEffect(() => {
    if (
      patientsData &&
      Array.isArray(patientsData) &&
      patientsData.length > 0
    ) {
      setAllLoadedPatients((prev) => {
        // Check if this page is already loaded
        const existingPageStart = (page - 1) * pageSize;
        const hasPage =
          prev.length > existingPageStart &&
          prev[existingPageStart] !== undefined;

        if (!hasPage) {
          // Add new patients to the list
          const newList = [...prev];
          // Fill gaps with undefined if needed
          while (newList.length < existingPageStart) {
            newList.push(undefined);
          }
          // Add new patients
          patientsData.forEach((patient) => {
            newList.push(patient);
          });
          return newList;
        }
        return prev;
      });
    }
  }, [patientsData, page, pageSize]);

  // Use accumulated patients for display (show all loaded pages)
  const allPatients = allLoadedPatients.filter(Boolean); // Remove undefined entries

  // Client-side filtering (on all loaded patients)
  const filteredPatients = (allPatients || []).filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.fullName?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      label: "Name",
      key: "name",
      render: (patient) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              {patient.fullName?.[0]?.toUpperCase() || "P"}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {patient.fullName || "N/A"}
          </span>
        </div>
      ),
    },
    {
      label: "Email",
      key: "email",
      render: (patient) => (
        <span className="text-sm text-gray-600">{patient.email || "N/A"}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (patient) => {
        // Status يتغير حسب الـ id - الباك يتحقق من الـ id ويحدد الحالة
        // إذا كان blocked يكون Blocked، وإلا Active
        // isDeleted يعني Blocked في الباك
        const isBlocked =
          patient.isDeleted ||
          patient.statusType === "Blocked" ||
          patient.isBlocked;
        const status = isBlocked ? "Blocked" : "Active";
        const statusColors = {
          Active: "bg-green-100 text-green-800",
          Blocked: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || statusColors.Active
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const handleView = (patient) => {
    const patientId = patient.id || patient.userId || patient.appUserId;
    if (patientId) {
      navigate(`/patient/profile/${patientId}`);
    } else {
      toast.error("Patient ID not found");
    }
  };

  const handleBlock = async (patient) => {
    // تحديد الحالة الحالية: isDeleted أو statusType === "Blocked" يعني Blocked
    const isBlocked =
      patient.isDeleted ||
      patient.statusType === "Blocked" ||
      patient.isBlocked;
    const action = isBlocked ? "unblock" : "block";
    const actionText = isBlocked ? "Unblock " : "Block";

    if (!window.confirm(`Are you sure you want to${actionText}  this user?`))
      return;

    try {
      await adminAPI.deleteAppUser(patient.id);
      // Toast message يتغير حسب الحالة
      if (isBlocked) {
        toast.success("User unblocked successfully!");
      } else {
        toast.success("User blocked successfully!");
      }
      // Reset to page 1 and refetch to get updated status
      setPage(1);
      setAllLoadedPatients([]); // Reset accumulated patients
      refetch(); // Refresh the list
    } catch (error) {
      // Toast error يتغير حسب الحالة
      console.log(error);
      if (isBlocked) {
        toast.error("Failed to unblock user");
      } else {
        toast.error("Failed to block user");
      }
    }
  };

  // Check if there are more pages to load
  // Since backend pagination, we check if current page has full pageSize
  const hasMore = patientsData && patientsData.length === pageSize;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Patients Management
          </h1>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search patients..."
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
        data={filteredPatients}
        isLoading={isLoading}
        onView={handleView}
        onBlock={handleBlock}
        showMore={true}
        hasMore={hasMore}
        onShowMore={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
