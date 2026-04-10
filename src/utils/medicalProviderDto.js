/**
 * ASP.NET APIs often bind MedicalTestsProviderUpdateDTO with PascalCase JSON.
 * WorkingHourDTO: Day (0–6), From / To as TimeSpan strings "HH:mm:ss".
 */
export function toPascalMedicalProviderUpdateDto(payload) {
  const wh = Array.isArray(payload.workingHours) ? payload.workingHours : [];
  const workingHours = wh.map((w) => ({
    Day: Number(w.day),
    From: String(w.from),
    To: String(w.to),
  }));

  const body = {};

  if (payload.name != null && String(payload.name).trim() !== "") {
    body.Name = String(payload.name).trim();
  }
  if (payload.licenceNo != null && String(payload.licenceNo).trim() !== "") {
    body.LicenceNo = String(payload.licenceNo).trim();
  }
  if (payload.address != null && String(payload.address).trim() !== "") {
    body.Address = String(payload.address).trim();
  }
  if (payload.about != null) {
    body.About = String(payload.about);
  }

  body.WorkingHours = workingHours;

  return body;
}

/** Same payload in camelCase (fallback if server uses System.Text.Json camelCase only). */
export function toCamelMedicalProviderUpdateDto(payload) {
  const wh = Array.isArray(payload.workingHours) ? payload.workingHours : [];
  return {
    ...(payload.name != null && String(payload.name).trim() !== ""
      ? { name: String(payload.name).trim() }
      : {}),
    ...(payload.licenceNo != null && String(payload.licenceNo).trim() !== ""
      ? { licenceNo: String(payload.licenceNo).trim() }
      : {}),
    ...(payload.address != null && String(payload.address).trim() !== ""
      ? { address: String(payload.address).trim() }
      : {}),
    ...(payload.about != null ? { about: String(payload.about) } : {}),
    workingHours: wh.map((w) => ({
      day: Number(w.day),
      from: String(w.from),
      to: String(w.to),
    })),
  };
}
