/** C# DayOfWeek: 0 = Sunday … 6 = Saturday */
export const DAY_ORDER = [0, 1, 2, 3, 4, 5, 6];

export const DAY_LABELS_AR_EN = [
  { en: "Sunday" },
  { en: "Monday" },
  { en: "Tuesday" },
  { en: "Wednesday" },
  { en: "Thursday" },
  { en: "Friday" },
  { en: "Saturday" },
];

/** "09:00:00" or "09:00" → "09:00" for <input type="time" /> */
export function spanToTimeInput(span) {
  if (span == null || span === "") return "";
  const s = String(span);
  if (s.length >= 5) return s.slice(0, 5);
  return s;
}

/** "09:30" → "09:30:00" for API TimeSpan */
export function timeInputToSpan(hhmm) {
  if (!hhmm || String(hhmm).trim() === "") return null;
  const s = String(hhmm).trim();
  return s.length === 5 ? `${s}:00` : s;
}

/**
 * Build 7 UI rows (Sun→Sat). Merge API workingHours by `day`.
 * @param {Array<{day?: number, Day?: number, from?: string, From?: string, to?: string, To?: string}>} apiHours
 */
export function buildWorkingRowsFromApi(apiHours) {
  const map = new Map();
  (apiHours || []).forEach((wh) => {
    const d = wh.day ?? wh.Day;
    if (d == null) return;
    map.set(Number(d), {
      from: spanToTimeInput(wh.from ?? wh.From),
      to: spanToTimeInput(wh.to ?? wh.To),
    });
  });
  return DAY_ORDER.map((day) => {
    const ex = map.get(day);
    return {
      day,
      label: DAY_LABELS_AR_EN[day]?.en ?? `Day ${day}`,
      from: ex?.from ?? "",
      to: ex?.to ?? "",
    };
  });
}

/**
 * Rows with both from & to → { day, from, to } for MedicalTestsProviderUpdateDTO
 */
export function rowsToWorkingHourPayload(rows) {
  return rows
    .filter((r) => r.from && r.to)
    .map((r) => ({
      day: r.day,
      from: timeInputToSpan(r.from),
      to: timeInputToSpan(r.to),
    }));
}

export function minutesToDurationSpan(minutes) {
  const m = Math.max(0, Math.floor(Number(minutes) || 0));
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00`;
}

export function durationSpanToMinutes(span) {
  if (span == null || span === "") return 60;
  const parts = String(span).split(":");
  const h = parseInt(parts[0], 10) || 0;
  const min = parseInt(parts[1], 10) || 0;
  return h * 60 + min;
}

/**
 * Human lines for patients (Arabic day + time range).
 * @param {Array} apiHours same shape as API workingHours
 * @param {number} maxLines
 * @returns {string[]}
 */
export function formatWorkingHoursDisplayLines(apiHours, maxLines = 8) {
  const rows = buildWorkingRowsFromApi(apiHours).filter((r) => r.from && r.to);
  if (!rows.length) return [];
  return rows
    .map((r) => {
      const ar = DAY_LABELS_AR_EN[r.day]?.ar ?? r.label;
      return `${ar}: ${r.from} – ${r.to}`;
    })
    .slice(0, maxLines);
}
