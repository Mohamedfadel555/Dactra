import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";
import { useNotificationsApi } from "./useNotificationsApi";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const NOTIFICATION_KEYS = {
  all: ["notifications"],
  list: () => [...NOTIFICATION_KEYS.all, "my"],
  unreadCount: () => [...NOTIFICATION_KEYS.all, "unread-count"],
};

// ─── Normalizers ──────────────────────────────────────────────────────────────

/**
 * Coerces any API response shape into a plain notification array.
 */
function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw == null || typeof raw !== "object") return [];

  const candidates = [
    raw.items,
    raw.Items,
    raw.notifications,
    raw.Notifications,
    raw.data,
    raw.Data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

/**
 * Coerces any API response shape into a plain integer count.
 */
function normalizeCount(raw) {
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") return Number(raw) || 0;

  const value =
    raw.count ?? raw.Count ?? raw.unreadCount ?? raw.UnreadCount ?? 0;

  return typeof value === "number" ? value : Number(value) || 0;
}

/**
 * Safely parses an API response that might arrive as a JSON string.
 */
function safeParseResponse(raw) {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Extracts a human-readable error message from a React Query error object. */
function extractErrorMessage(error, fallback) {
  if (!error) return null;
  return error?.response?.data?.message ?? error?.message ?? fallback;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Unified notification inbox hook.
 *
 * Provides:
 *  - items          — sorted notification list (newest first)
 *  - unreadCount    — integer badge count
 *  - isLoading      — true on the very first fetch
 *  - isFetching     — true on any background refetch
 *  - isError        — true if any query failed
 *  - listError      — human-readable list error message
 *  - countError     — human-readable count error message
 *  - refetch()      — manually refresh both queries
 *  - markRead(id)   — optimistically marks a notification as read
 *  - isMarkingRead  — true while markRead is in-flight
 */
export function useNotificationInbox() {
  const { accessToken } = useAuth();
  const { getMyNotifications, getUnreadCount, markAsRead } =
    useNotificationsApi();
  const queryClient = useQueryClient();

  const enabled = Boolean(accessToken);

  // ── Notification list ──────────────────────────────────────────────────────
  const listQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.list(),
    queryFn: async () => {
      const res = await getMyNotifications();
      const raw = safeParseResponse(res?.data);
      return normalizeList(raw);
    },
    enabled,
    refetchInterval: 25_000,
    refetchOnWindowFocus: true,
    retry: 1,
    staleTime: 10_000,
  });

  // ── Unread count ───────────────────────────────────────────────────────────
  const countQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: async () => {
      const res = await getUnreadCount();
      const raw = safeParseResponse(res?.data);
      return normalizeCount(raw);
    },
    enabled,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    retry: 1,
    staleTime: 10_000,
  });

  // ── Mark as read ───────────────────────────────────────────────────────────
  const readMutation = useMutation({
    mutationFn: (id) => markAsRead(id),

    onMutate: async (id) => {
      // Cancel any in-flight refetch so it doesn't overwrite our optimistic update.
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.list() });

      const previous = queryClient.getQueryData(NOTIFICATION_KEYS.list());

      queryClient.setQueryData(NOTIFICATION_KEYS.list(), (old = []) =>
        old.map((n) => {
          const nId = n?.id ?? n?.Id;
          return String(nId) === String(id)
            ? { ...n, isRead: true, IsRead: true }
            : n;
        }),
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      // Roll back the optimistic update on failure.
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(NOTIFICATION_KEYS.list(), ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      });
    },
  });

  // ── Derived state ──────────────────────────────────────────────────────────

  return {
    items: listQuery.data ?? [],
    unreadCount: countQuery.data ?? 0,

    isLoading: listQuery.isLoading || countQuery.isLoading,
    isFetching: listQuery.isFetching || countQuery.isFetching,
    isError: listQuery.isError || countQuery.isError,

    listError: extractErrorMessage(
      listQuery.error,
      "Could not load notifications.",
    ),
    countError: extractErrorMessage(
      countQuery.error,
      "Could not load unread count.",
    ),

    refetch: () => {
      listQuery.refetch();
      countQuery.refetch();
    },

    markRead: readMutation.mutateAsync,
    isMarkingRead: readMutation.isPending,
  };
}
