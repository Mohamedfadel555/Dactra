import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useReportApi } from "../../hooks/useReportApi";
import { useComplaintsApi } from "../../hooks/useComplaintsApi";
import { useAdminAPI } from "../../api/adminAPI";
import {
  normalizeReportKind,
  parseReportThreadMeta,
  reportTypeLabel,
  stripReportMetaPrefix,
} from "../../utils/reportConstants";

function normalizeProviderList(res) {
  const raw = res?.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.$values)) return raw.$values;
  return [];
}

function doctorIsApproved(doctor) {
  if (!doctor) return false;
  const approvalStatus =
    typeof doctor.approvalStatus === "number" ? doctor.approvalStatus : null;
  return (
    approvalStatus === 1 ||
    doctor.isApproved === true ||
    doctor.status === "Approved" ||
    doctor.statusType === "Approved"
  );
}

function patientIsBlocked(patient) {
  if (!patient) return false;
  return (
    patient.isDeleted ||
    patient.statusType === "Blocked" ||
    patient.isBlocked
  );
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
  const adminAPI = useAdminAPI();

  const reportsQ = useQuery({
    queryKey: ["admin-reports"],
    queryFn: () => getAllReports().then((r) => normalizeList(r)),
  });

  const complaintsQ = useQuery({
    queryKey: ["admin-complaints"],
    queryFn: () => getAllComplaints().then((r) => normalizeList(r)),
  });

  const doctorsLookupQ = useQuery({
    queryKey: ["admin-doctors-lookup"],
    queryFn: () =>
      adminAPI
        .getAllDoctorsInfo(1, 500, null, null)
        .then((r) => normalizeProviderList(r)),
    staleTime: 1000 * 60 * 2,
  });

  const patientsLookupQ = useQuery({
    queryKey: ["admin-patients-lookup"],
    queryFn: () =>
      adminAPI
        .getAllPatientInfo(1, 500, null)
        .then((r) => normalizeProviderList(r)),
    staleTime: 1000 * 60 * 2,
  });

  const reports = reportsQ.data ?? [];
  const complaints = complaintsQ.data ?? [];

  const doctorByProfileId = useMemo(() => {
    const map = new Map();
    for (const d of doctorsLookupQ.data ?? []) {
      const pid = d.profileId ?? d.id;
      if (pid != null) map.set(String(pid), d);
    }
    return map;
  }, [doctorsLookupQ.data]);

  const patientByProfileId = useMemo(() => {
    const map = new Map();
    for (const p of patientsLookupQ.data ?? []) {
      const pid = p.profileId ?? p.id;
      if (pid != null) map.set(String(pid), p);
    }
    return map;
  }, [patientsLookupQ.data]);

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
      if (kind === "doctor") {
        if (id == null) {
          toast.info("No doctor id on this report.", { position: "top-center" });
          return;
        }
        navigate(`/doctor/profile/${id}`);
        return;
      }
      if (kind === "patient") {
        if (id == null) {
          toast.info("No patient id on this report.", {
            position: "top-center",
          });
          return;
        }
        navigate(`/patient/profile/${id}`);
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

  const refreshReportLookups = () => {
    doctorsLookupQ.refetch();
    patientsLookupQ.refetch();
  };

  const handleApproveDoctorReport = async (row) => {
    const doctor =
      row._doctor ??
      doctorByProfileId.get(
        String(row?.relatedEntityId ?? row?.RelatedEntityId ?? ""),
      );
    const providerId =
      doctor?.profileId ?? row?.relatedEntityId ?? row?.RelatedEntityId;
    if (!providerId) {
      toast.error("Doctor id not found on this report.", {
        position: "top-center",
      });
      return;
    }

    const isCurrentlyApproved = row.isApproved ?? doctorIsApproved(doctor);

    try {
      if (isCurrentlyApproved) {
        await adminAPI.disapproveProvider(0, providerId);
        toast.success("Doctor disapproved successfully.", {
          position: "top-center",
        });
      } else {
        await adminAPI.approveProvider(0, providerId);
        toast.success("Doctor approved successfully.", {
          position: "top-center",
        });
      }
      refreshReportLookups();
    } catch {
      toast.error(
        isCurrentlyApproved
          ? "Failed to disapprove doctor."
          : "Failed to approve doctor.",
        { position: "top-center" },
      );
    }
  };

  const handleBlockPatientReport = async (row) => {
    const patient =
      row._patient ??
      patientByProfileId.get(
        String(row?.relatedEntityId ?? row?.RelatedEntityId ?? ""),
      );
    const userId = patient?.id;
    if (!userId) {
      toast.error("Patient user id not found on this report.", {
        position: "top-center",
      });
      return;
    }

    const isBlocked = patientIsBlocked(patient);
    const actionText = isBlocked ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${actionText} this patient?`)) {
      return;
    }

    try {
      await adminAPI.deleteAppUser(userId);
      toast.success(
        isBlocked ? "Patient unblocked successfully." : "Patient blocked successfully.",
        { position: "top-center" },
      );
      refreshReportLookups();
    } catch {
      toast.error(
        isBlocked ? "Failed to unblock patient." : "Failed to block patient.",
        { position: "top-center" },
      );
    }
  };

  const handleResolve = (complaint) => {
    const id = complaint?.id ?? complaint?.Id;
    if (id == null) return;
    resolveMutation.mutate({ id, current: complaint });
  };

  const complaintsColumns = [
    {
      label: "From",
      key: "userEmail",
      width: "w-[20%]",
      render: (c) => (
        <span className="text-sm text-gray-700 truncate block">
          {c?.userEmail ?? c?.UserEmail ?? "—"}
        </span>
      ),
    },
    {
      label: "Title",
      key: "title",
      width: "w-[16%]",
      render: (c) => (
        <span className="text-sm text-gray-700 line-clamp-2">
          {c?.title || c?.Title || "N/A"}
        </span>
      ),
    },
    {
      label: "Description",
      key: "content",
      width: "w-[34%]",
      wrap: true,
      render: (c) => (
        <span className="text-sm text-gray-600 max-w-[280px] line-clamp-3 break-words block">
          {c?.content || c?.Content || "N/A"}
        </span>
      ),
    },
    {
      label: "Created",
      key: "createdAt",
      width: "w-[16%]",
      render: (c) => {
        const raw = c?.createdAt ?? c?.CreatedAt;
        return (
          <span className="text-sm text-gray-500">
            {raw ? new Date(raw).toLocaleString() : "N/A"}
          </span>
        );
      },
    },
    {
      label: "Status",
      key: "status",
      width: "w-[10%]",
      render: (c) => {
        const ok = complaintIsResolved(c);
        return (
          <span
            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
              ok
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {ok ? "Resolved" : "Open"}
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
        <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#316BE8]">
          {reportTypeLabel(r)}
        </span>
      ),
    },
    {
      label: "Reporter",
      key: "userEmail",
      render: (r) => (
        <span className="text-sm text-gray-700 max-w-[180px] truncate block">
          {r?.userEmail ?? r?.UserEmail ?? "—"}
        </span>
      ),
    },
    {
      label: "Reported",
      key: "relatedEntityId",
      render: (r) => {
        const entityId = r?.relatedEntityId ?? r?.RelatedEntityId;
        const label = reportTypeLabel(r);
        return (
          <span className="text-sm font-medium text-gray-900">
            {entityId != null ? `${label} #${entityId}` : label}
          </span>
        );
      },
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
          <span className="text-sm text-gray-600 max-w-[280px] line-clamp-2">
            {shown}
          </span>
        );
      },
    },
    {
      label: "Created",
      key: "createdAt",
      render: (r) => {
        const raw = r?.createdAt ?? r?.CreatedAt;
        return (
          <span className="text-sm text-gray-500">
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
        report?.userEmail,
        report?.UserEmail,
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

  const enrichRow = (item) => {
    if (mainTab === "complaints") {
      return { ...item, isApproved: complaintIsResolved(item) };
    }

    const kind = normalizeReportKind(item);
    const entityId = String(
      item?.relatedEntityId ?? item?.RelatedEntityId ?? "",
    );

    if (kind === "doctor") {
      const doctor = doctorByProfileId.get(entityId);
      return {
        ...item,
        _doctor: doctor,
        isApproved: doctorIsApproved(doctor),
      };
    }

    if (kind === "patient") {
      const patient = patientByProfileId.get(entityId);
      const blocked = patientIsBlocked(patient);
      return {
        ...item,
        _patient: patient,
        isBlocked: blocked,
        isDeleted: patient?.isDeleted,
        statusType: patient?.statusType,
      };
    }

    return item;
  };

  const mappedData = getCurrentData().map(enrichRow);
  const isLoading = mainTab === "complaints" ? complaintsQ.isLoading : reportsQ.isLoading;

  const showReportView = (row) => {
    const kind = normalizeReportKind(row);
    if (kind === "comment") {
      const content = row?.content ?? row?.Content ?? "";
      return (
        parseReportThreadMeta(
          typeof content === "string" ? content.trim() : "",
        ).qid != null
      );
    }
    return ["post", "question", "doctor", "patient"].includes(kind);
  };

  const showDoctorApprove = (row) => normalizeReportKind(row) === "doctor";
  const showPatientBlock = (row) => normalizeReportKind(row) === "patient";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#06172E]">
            Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            System complaints are platform issues. Reports flag community content,
            doctors, or patients — use View to open the target profile or post.
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

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setMainTab("complaints");
            setSearchQuery("");
          }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mainTab === "complaints"
              ? "bg-[#316BE8] text-white shadow-md shadow-blue-900/20"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
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
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mainTab === "reports"
              ? "bg-[#316BE8] text-white shadow-md shadow-blue-900/20"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
          }`}
        >
          Reports ({reports.length})
        </button>
        
      </div>

      <AdminTable
        columns={getCurrentColumns()}
        data={mappedData}
        isLoading={isLoading}
        onView={mainTab === "reports" ? handleOpenReportedEntity : undefined}
        showViewForRow={mainTab === "reports" ? showReportView : undefined}
        onApprove={
          mainTab === "complaints"
            ? handleResolve
            : mainTab === "reports"
              ? handleApproveDoctorReport
              : undefined
        }
        showApproveForRow={
          mainTab === "reports" ? showDoctorApprove : undefined
        }
        onBlock={
          mainTab === "reports" ? handleBlockPatientReport : undefined
        }
        showBlockForRow={mainTab === "reports" ? showPatientBlock : undefined}
        onDelete={mainTab === "reports" ? handleDeleteReportRow : undefined}
      />
    </div>
  );
}
