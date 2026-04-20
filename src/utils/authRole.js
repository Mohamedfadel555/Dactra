export const getTokenPayload = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const mapAppRoleFromPayload = (payload) => {
  if (!payload) return null;

  let rawRole =
    payload.role ||
    payload.roles ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (Array.isArray(rawRole)) {
    rawRole = rawRole[0];
  }

  const normalizedRole =
    rawRole && typeof rawRole === "string" ? rawRole.toLowerCase() : "";
  const typeValue = payload.tv;

  if (normalizedRole === "admin" || normalizedRole === "administrator") {
    return "Admin";
  }
  if (normalizedRole === "lab" || normalizedRole === "lap") {
    return "Lab";
  }
  if (normalizedRole === "scan" || normalizedRole === "scancenter") {
    return "Scan";
  }
  if (normalizedRole === "medicaltestprovider") {
    if (typeValue === "1" || typeValue === 1) return "Scan";
    return "Lab";
  }

  return rawRole || null;
};

export const mapAppRoleFromToken = (token) => {
  return mapAppRoleFromPayload(getTokenPayload(token));
};
