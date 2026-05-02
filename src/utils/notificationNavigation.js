/** Shared helpers for notification → in-app routes (bell + notifications page). */

export function pickRelatedId(n) {
  return (
    n?.relatedEntityId ??
    n?.RelatedEntityId ??
    n?.entityId ??
    n?.EntityId ??
    n?.postId ??
    n?.PostId ??
    n?.questionId ??
    n?.QuestionId ??
    null
  );
}

export function pickType(n) {
  return n?.type ?? n?.Type ?? "";
}

export function pickMessage(n) {
  return (
    n?.message ??
    n?.Message ??
    n?.title ??
    n?.Title ??
    n?.body ??
    n?.Body ??
    ""
  );
}

function extractIdFromText(text) {
  if (text == null || text === "") return null;
  const s = String(text);
  const guid = s.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  );
  if (guid) return guid[0];
  const labeled = s.match(/\b(?:id|post|question)\s*[#:=]?\s*(\d{1,12})\b/i);
  if (labeled) return labeled[1];
  return null;
}

function communityThreadType(typeStr, messageStr) {
  const blob = `${typeStr} ${messageStr}`.toLowerCase();
  if (
    blob.includes("article") ||
    blob.includes("artical") ||
    blob.includes(" post") ||
    blob.includes("post ") ||
    blob.includes("like") ||
    blob.includes("liked") ||
    blob.includes("comment")
  )
    return "Artical";
  return "Question";
}

export function resolveNotificationTarget(n) {
  let related = pickRelatedId(n);
  const t = String(pickType(n)).toLowerCase();
  const msg = String(pickMessage(n)).toLowerCase();
  const fullMsg = pickMessage(n);

  if (related == null || related === "") {
    related = extractIdFromText(fullMsg);
  }

  if (related == null || related === "") {
    if (msg.includes("question")) return { to: "/Community/Questions" };
    if (msg.includes("article") || msg.includes("post"))
      return { to: "/Community/Posts" };
    if (msg.includes("complaint")) return { to: "/admin/complaints" };
    return null;
  }

  const looksLikeCommunity =
    t.includes("community") ||
    t.includes("post") ||
    t.includes("question") ||
    t.includes("like") ||
    t.includes("comment") ||
    t.includes("answer") ||
    msg.includes("article") ||
    msg.includes("artical") ||
    msg.includes("post") ||
    msg.includes("question") ||
    msg.includes("like") ||
    msg.includes("comment") ||
    msg.includes("answer");

  if (looksLikeCommunity) {
    const stateType = communityThreadType(t, msg);
    return {
      to: `/Community/Question/${related}`,
      state: { type: stateType },
    };
  }

  if (t.includes("complaint") || msg.includes("complaint")) {
    return { to: "/admin/complaints", state: { focusId: related } };
  }

  return null;
}
