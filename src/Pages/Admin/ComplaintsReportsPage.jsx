import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useReportApi } from "../../hooks/useReportApi";
import { useComplaintsApi } from "../../hooks/useComplaintsApi";
import {
  complaintTargetLabel,
  normalizeReportKind,
  parseReportThreadMeta,
  stripReportMetaPrefix,
} from "../../utils/reportConstants";

function reportTypeLabel(row) {
  const k = normalizeReportKind(row);
  if (k === "post") return "Post (Article)";
  if (k === "comment") return "Comment";
  if (k === "question") return "Question";
  const raw = row?.type ?? row?.Type ?? row?.reportType ?? row?.ReportType;
  return raw != null ? String(raw) : "—";
}

function normalizeList(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  return [];
}

/** API uses numeric status (0 = open) and optional resolvedAt (see GET /Complaints). */
function complaintIsResolved(c) {
  const resolvedAt = c?.resolvedAt ?? c?.ResolvedAt;
  if (resolvedAt != null && resolvedAt !== "") return true;
  const s = c?.status ?? c?.Status ?? 0;
  if (typeof s === "number") return s !== 0;
  if (typeof s === "string") {
    const low = s.toLowerCase();
    if (low === "resolved" || low === "closed") return true;
    const n = Number(s);
    return !Number.isNaN(n) && n !== 0;
  }
  return Boolean(s);
}

export default function ComplaintsReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mainTab, setMainTab] = useState("complaints");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getAllReports, deleteReport } = useReportApi();
  const { getAllComplaints, getComplaintById, updateComplaint } =
    useComplaintsApi();

  const reportsQ = useQuery({
    queryKey: ["admin-reports"],
    queryFn: () => getAllReports().then((r) => normalizeList(r)),
  });

  const complaintsQ = useQuery({
    queryKey: ["admin-complaints"],
    queryFn: () => getAllComplaints().then((r) => normalizeList(r)),
  });

  const reports = reportsQ.data ?? [];
  const complaints = complaintsQ.data ?? [];

  const delMutation = useMutation({
    mutationFn: (id) => deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report removed from list.", { position: "top-center" });
    },
    onError: () =>
      toast.error("Could not delete report.", { position: "top-center" }),
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, current }) => {
      const nextResolved = !complaintIsResolved(current);
      let base = { ...current };
      try {
        const res = await getComplaintById(id);
        if (res?.data != null) base = { ...base, ...res.data };
      } catch {
        /* keep current */
      }
      const statusNum = nextResolved ? 1 : 0;
      const body = {
        id: base.id ?? base.Id ?? id,
        title: base.title ?? base.Title,
        content: base.content ?? base.Content,
        against: base.against ?? base.Against,
        status: statusNum,
        resolvedAt: nextResolved ? new Date().toISOString() : null,
        userEmail: base.userEmail ?? base.UserEmail,
        adminResponse: base.adminResponse ?? base.AdminResponse ?? null,
      };
      return updateComplaint(id, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
      toast.success("Complaint status updated.", { position: "top-center" });
    },
    onError: () =>
      toast.error("Could not update complaint.", { position: "top-center" }),
  });

  const refetch = () => {
    reportsQ.refetch();
    complaintsQ.refetch();
  };

  const handleOpenReportedEntity = useCallback(
    (row) => {
      const relatedEntityId = row?.relatedEntityId ?? row?.RelatedEntityId;
      const content = row?.content ?? row?.Content ?? "";
      const threadMeta = parseReportThreadMeta(
        typeof content === "string" ? content.trim() : "",
      );
      const id = relatedEntityId;
      const kind = normalizeReportKind(row);

      if (kind === "post") {
        if (id == null) {
          toast.info("No post id on this report.", { position: "top-center" });
          return;
        }
        navigate(`/Community/Question/${id}`, {
          state: { type: "Artical" },
        });
        return;
      }
      if (kind === "question") {
        if (id == null) {
          toast.info("No question id on this report.", {
            position: "top-center",
          });
          return;
        }
        navigate(`/Community/Question/${id}`, {
          state: { type: "Question" },
        });
        return;
      }
      if (kind === "comment") {
        if (threadMeta.qid != null) {
          navigate(`/Community/Question/${threadMeta.qid}`, {
            state: { type: threadMeta.threadType || "Question" },
          });
          return;
        }
        toast.warning(
          "This report has no thread link (old report). Submit a new report from the app to attach thread info.",
          { position: "top-center" },
        );
        return;
      }
      toast.warning(
        `Unknown report type (raw: ${String(row?.type ?? row?.Type ?? "—")}). Check API field names.`,
        { position: "top-center" },
      );
    },
    [navigate],
  );

  const handleDeleteReportRow = (reportItem) => {
    const id = reportItem?.id ?? reportItem?.Id;
    if (id == null) return;
    if (
      !window.confirm(
        "Remove this report from the admin list? (It does not delete the post or comment on the site.)",
      )
    ) {
      return;
    }
    delMutation.mutate(id);
  };

  const handleResolve = (complaint) => {
    const id = complaint?.id ?? complaint?.Id;
    if (id == null) return;
    resolveMutation.mutate({ id, current: complaint });
  };

  const complaintsColumns = [
    {
      label: "Against",
      key: "against",
      render: (c) => (
        <span className="text-sm font-medium text-gray-900">
          {complaintTargetLabel(c?.against ?? c?.Against) ||
            c?.against ||
            c?.Against ||
            "N/A"}
        </span>
      ),
    },
    {
      label: "From",
      key: "userEmail",
      render: (c) => (
        <span className="text-sm text-gray-600 max-w-[200px] truncate block">
          {c?.userEmail ?? c?.UserEmail ?? "—"}
        </span>
      ),
    },
    {
      label: "Title",
      key: "title",
      render: (c) => (
        <span className="text-sm text-gray-700 max-w-[200px] line-clamp-1">
          {c?.title || c?.Title || "N/A"}
        </span>
      ),
    },
    {
      label: "Description",
      key: "content",
      render: (c) => (
        <span className="text-sm text-gray-600 max-w-[320px] line-clamp-2">
          {c?.content || c?.Content || "N/A"}
        </span>
      ),
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (c) => {
        const raw = c?.createdAt ?? c?.CreatedAt;
        return (
          <span className="text-sm text-gray-600">
            {raw ? new Date(raw).toLocaleString() : "N/A"}
          </span>
        );
      },
    },
    {
      label: "Status",
      key: "status",
      render: (c) => {
        const ok = complaintIsResolved(c);
        const code = c?.status ?? c?.Status ?? 0;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              ok
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {ok ? "Resolved" : "Open"}{" "}
            <span className="opacity-70 font-normal">({String(code)})</span>
          </span>
        );
      },
    },
  ];

  const reportsColumns = [
    {
      label: "Type",
      key: "type",
      render: (r) => (
        <span className="text-sm font-medium text-gray-900">
          {reportTypeLabel(r)}
        </span>
      ),
    },
    {
      label: "Reason",
      key: "title",
      render: (r) => (
        <span className="text-sm text-gray-700">
          {r?.title || r?.Title || "N/A"}
        </span>
      ),
    },
    {
      label: "Details",
      key: "content",
      render: (r) => {
        const raw = r?.content || r?.Content || "";
        const shown = stripReportMetaPrefix(raw) || raw || "—";
        return (
          <span className="text-sm text-gray-600 max-w-[320px] line-clamp-2">
            {shown}
          </span>
        );
      },
    },
    {
      label: "Entity id",
      key: "relatedEntityId",
      render: (r) => (
        <span className="text-sm text-gray-800">
          {r?.relatedEntityId ?? r?.RelatedEntityId ?? "—"}
        </span>
      ),
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (r) => {
        const raw = r?.createdAt ?? r?.CreatedAt;
        return (
          <span className="text-sm text-gray-600">
            {raw ? new Date(raw).toLocaleString() : "N/A"}
          </span>
        );
      },
    },
  ];

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return reports;
    return reports.filter((report) => {
      const haystack = [
        reportTypeLabel(report),
        report?.title,
        report?.Title,
        report?.content,
        report?.Content,
        String(report?.relatedEntityId ?? report?.RelatedEntityId),
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
        String(item?.against ?? item?.Against),
        item?.title,
        item?.Title,
        item?.content,
        item?.Content,
        item?.userEmail,
        item?.UserEmail,
        complaintIsResolved(item) ? "resolved" : "pending",
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

  const getApproveMeta = (item) => {
    if (mainTab !== "complaints") return item;
    return { ...item, isApproved: complaintIsResolved(item) };
  };

  const mappedData = getCurrentData().map(getApproveMeta);
  const isLoading = mainTab === "complaints" ? complaintsQ.isLoading : reportsQ.isLoading;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Complaints / Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Reports are flags only — use View to open the post or question. Delete
            removes the report record from the list.
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
          type="button"
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
          type="button"
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
        <button
          type="button"
          onClick={() => refetch()}
          className="ml-auto text-sm text-[#316BE8] hover:underline"
        >
          Refresh
        </button>
      </div>

      <AdminTable
        columns={getCurrentColumns()}
        data={mappedData}
        isLoading={isLoading}
        onView={mainTab === "reports" ? handleOpenReportedEntity : undefined}
        onApprove={mainTab === "complaints" ? handleResolve : undefined}
        onDelete={mainTab === "reports" ? handleDeleteReportRow : undefined}
      />
    </div>
  );
}
