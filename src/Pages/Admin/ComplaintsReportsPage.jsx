import { useEffect, useMemo, useState } from "react";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import {
  deleteReport,
  getComplaints,
  getReports,
  setComplaintStatus,
} from "../../utils/moderationStore";

export default function ComplaintsReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mainTab, setMainTab] = useState("complaints");
  const [reports, setReports] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const loadModerationData = () => {
    setReports(getReports());
    setComplaints(getComplaints());
  };

  useEffect(() => {
    loadModerationData();
  }, []);

  const complaintsColumns = [
    {
      label: "Against",
      key: "against",
      render: (complaint) => (
        <span className="text-sm font-medium text-gray-900">
          {complaint.against || "N/A"}
        </span>
      ),
    },
    {
      label: "By",
      key: "createdBy",
      render: (complaint) => (
        <span className="text-sm text-gray-600">
          {complaint.createdBy?.name || complaint.createdBy?.email || "N/A"}
        </span>
      ),
    },
    {
      label: "Reason",
      key: "reason",
      render: (complaint) => (
        <span className="text-sm text-gray-700 max-w-[250px] line-clamp-1">
          {complaint.reason || "N/A"}
        </span>
      ),
    },
    {
      label: "Description",
      key: "description",
      render: (complaint) => (
        <span className="text-sm text-gray-600 max-w-[320px] line-clamp-2">
          {complaint.description || "N/A"}
        </span>
      ),
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (complaint) => (
        <span className="text-sm text-gray-600">
          {complaint.createdAt
            ? new Date(complaint.createdAt).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (complaint) => {
        const status = complaint.status || "Pending";
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "Resolved"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const reportsColumns = [
    {
      label: "Content Type",
      key: "contentType",
      render: (report) => (
        <span className="text-sm font-medium text-gray-900">
          {report.contentType || "N/A"}
        </span>
      ),
    },
    {
      label: "By",
      key: "createdBy",
      render: (report) => (
        <span className="text-sm text-gray-600">
          {report.createdBy?.name || report.createdBy?.email || "N/A"}
        </span>
      ),
    },
    {
      label: "Reason",
      key: "reason",
      render: (report) => (
        <span className="text-sm text-gray-700">{report.reason || "N/A"}</span>
      ),
    },
    {
      label: "Details",
      key: "details",
      render: (report) => (
        <span className="text-sm text-gray-600 max-w-[320px] line-clamp-2">
          {report.details || "—"}
        </span>
      ),
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (report) => (
        <span className="text-sm text-gray-600">
          {report.createdAt
            ? new Date(report.createdAt).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
  ];

  const handleResolve = (complaint) => {
    const nextStatus = complaint.status === "Resolved" ? "Pending" : "Resolved";
    setComplaintStatus(complaint.id, nextStatus);
    loadModerationData();
    toast.success(`Complaint marked as ${nextStatus}.`, {
      position: "top-center",
    });
  };

  const handleDeleteReportedContent = (reportItem) => {
    const confirmed = window.confirm(
      `Delete reported ${reportItem.contentType || "content"} and close report?`,
    );
    if (!confirmed) return;
    deleteReport(reportItem.id);
    loadModerationData();
    toast.success("Reported content deleted by admin.", {
      position: "top-center",
    });
  };

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return reports;
    return reports.filter((report) => {
      const haystack = [
        report.contentType,
        report.reason,
        report.details,
        report.createdBy?.name,
        report.createdBy?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [reports, searchQuery]);

  const filteredComplaints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return complaints;
    return complaints.filter((item) => {
      const haystack = [
        item.against,
        item.reason,
        item.description,
        item.createdBy?.name,
        item.createdBy?.email,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [complaints, searchQuery]);

  const getCurrentColumns = () => {
    return mainTab === "complaints" ? complaintsColumns : reportsColumns;
  };

  const getCurrentData = () => {
    return mainTab === "complaints" ? filteredComplaints : filteredReports;
  };

  const handleView = (item) => {
    const msg =
      mainTab === "complaints"
        ? item.description || "No description"
        : item.details || item.contentPreview || "No details";
    toast.info(msg, { position: "top-center" });
  };

  const getDeleteHandler = () => {
    if (mainTab === "reports") return handleDeleteReportedContent;
    return undefined;
  };

  const getApproveHandler = () => {
    if (mainTab === "complaints") return handleResolve;
    return undefined;
  };

  const getApproveMeta = (item) => {
    if (mainTab !== "complaints") return item;
    return { ...item, isApproved: item.status === "Resolved" };
  };

  const mappedData = getCurrentData().map(getApproveMeta);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Complaints / Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Report is only a flag. Admin decides delete.
          </p>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => {
            setMainTab("complaints");
            setSearchQuery("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mainTab === "complaints"
              ? "text-[#316BE8] border-b-2 border-[#316BE8]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Complaints ({complaints.length})
        </button>
        <button
          onClick={() => {
            setMainTab("reports");
            setSearchQuery("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mainTab === "reports"
              ? "text-[#316BE8] border-b-2 border-[#316BE8]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Reports ({reports.length})
        </button>
      </div>

      <AdminTable
        columns={getCurrentColumns()}
        data={mappedData}
        isLoading={false}
        onView={handleView}
        onApprove={getApproveHandler()}
        onDelete={getDeleteHandler()}
      />
    </div>
  );
}
