/** Reasons shown in report modal (server receives `title` = selected reason) */
export const reportReasons = [
  "Spam",
  "Inappropriate",
  "Wrong medical info",
  "Other",
];

/** Backend Report API: 0 = Post, 1 = Comment, 2 = Question */
export const REPORT_TYPE = {
  POST: 0,
  COMMENT: 1,
  QUESTION: 2,
};

/**
 * Normalize API `type` (number, string, or alternate property names) to
 * "post" | "comment" | "question" for admin navigation.
 */
export function normalizeReportKind(row) {
  const raw =
    row?.type ??
    row?.Type ??
    row?.reportType ??
    row?.ReportType ??
    row?.contentType ??
    row?.ContentType;

  if (raw == null || raw === "") {
    const content = String(row?.content ?? row?.Content ?? "").trim();
    if (THREAD_TAG_RE.test(content)) return "comment";
    return null;
  }

  if (typeof raw === "number") {
    if (raw === REPORT_TYPE.POST) return "post";
    if (raw === REPORT_TYPE.COMMENT) return "comment";
    if (raw === REPORT_TYPE.QUESTION) return "question";
    return null;
  }

  const s = String(raw).trim().toLowerCase();
  const map = {
    "0": "post",
    "1": "comment",
    "2": "question",
    post: "post",
    article: "post",
    artical: "post",
    comment: "comment",
    answer: "comment",
    question: "question",
  };
  if (map[s]) return map[s];
  const n = Number(s);
  if (!Number.isNaN(n)) {
    if (n === REPORT_TYPE.POST) return "post";
    if (n === REPORT_TYPE.COMMENT) return "comment";
    if (n === REPORT_TYPE.QUESTION) return "question";
  }
  return null;
}

/** Complaints API: `against` enum (aligned with form order) */
export const COMPLAINT_AGAINST = {
  Doctor: 0,
  Patient: 1,
  System: 2,
};

export const complaintTargetLabel = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && Number.isNaN(Number(value)))
    return value;
  const n = Number(value);
  const entry = Object.entries(COMPLAINT_AGAINST).find(([, v]) => v === n);
  return entry ? entry[0] : String(value);
};

/** One-line tag at start of `content` so admin can open the correct thread after report. */
export const THREAD_TAG_RE =
  /^\[DactraThread:qid=(\d+)(?::type=(article|question))?\]/i;

export const stripReportMetaPrefix = (content) => {
  if (typeof content !== "string") return "";
  return content.replace(THREAD_TAG_RE, "").trim();
};

/**
 * @param {string} userText
 * @param {{ questionId?: number|string, threadType?: "Artical"|"Question" }} meta
 */
export const buildReportContent = (userText, meta = {}) => {
  const qid = meta.questionId;
  if (qid == null) return (userText || "").trim();
  const typePart =
    meta.threadType === "Artical"
      ? ":type=article"
      : ":type=question";
  const tag = `[DactraThread:qid=${qid}${typePart}]`;
  const body = (userText || "").trim();
  return body ? `${tag}\n${body}` : tag;
};

/** @returns {{ qid: number|null, threadType: "Artical"|"Question"|null }} */
export const parseReportThreadMeta = (content) => {
  if (typeof content !== "string") return { qid: null, threadType: null };
  const m = content.trim().match(THREAD_TAG_RE);
  if (m) {
    const t = (m[2] || "question").toLowerCase();
    return {
      qid: Number(m[1]),
      threadType: t === "article" ? "Artical" : "Question",
    };
  }
  const legacy = content.match(/\[ctx:qid=(\d+)\]/);
  if (legacy) {
    return { qid: Number(legacy[1]), threadType: "Question" };
  }
  return { qid: null, threadType: null };
};

/** @deprecated use parseReportThreadMeta */
export const parseReportQuestionId = (content) =>
  parseReportThreadMeta(content).qid;
