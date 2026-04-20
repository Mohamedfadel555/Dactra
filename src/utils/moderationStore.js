const REPORTS_KEY = "dactra_reports_v1";
const COMPLAINTS_KEY = "dactra_complaints_v1";

const REASONS = ["Spam", "Inappropriate", "Wrong medical info", "Other"];

const readArray = (key) => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeArray = (key, data) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(data));
};

const decodeToken = (token) => {
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
};

export const reportReasons = REASONS;

export const createReporterFromToken = (token) => {
  const payload = decodeToken(token);
  return {
    name:
      payload.fullName ||
      payload.name ||
      payload.unique_name ||
      payload.email ||
      "Unknown",
    email: payload.email || "",
    role:
      payload.role ||
      payload.roles ||
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      "",
  };
};

export const getReports = () => {
  return readArray(REPORTS_KEY);
};

export const addReport = (report) => {
  const all = getReports();
  const next = [
    {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      ...report,
    },
    ...all,
  ];
  writeArray(REPORTS_KEY, next);
  return next[0];
};

export const deleteReport = (reportId) => {
  const all = getReports();
  const next = all.filter((r) => r.id !== reportId);
  writeArray(REPORTS_KEY, next);
  return next;
};

export const getComplaints = () => {
  return readArray(COMPLAINTS_KEY);
};

export const addComplaint = (complaint) => {
  const all = getComplaints();
  const next = [
    {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      ...complaint,
    },
    ...all,
  ];
  writeArray(COMPLAINTS_KEY, next);
  return next[0];
};

export const setComplaintStatus = (complaintId, status) => {
  const all = getComplaints();
  const next = all.map((item) =>
    item.id === complaintId ? { ...item, status } : item,
  );
  writeArray(COMPLAINTS_KEY, next);
  return next;
};
