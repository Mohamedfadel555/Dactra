import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";
import { useNotificationsApi } from "./useNotificationsApi";

function normalizeNotificationList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.Items)) return data.Items;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.Notifications)) return data.Notifications;
  return [];
}

function parseCount(payload) {
  if (payload == null) return 0;
  if (typeof payload === "number") return payload;
  if (typeof payload === "string") {
    const n = Number(payload);
    return Number.isNaN(n) ? 0 : n;
  }
  const c =
    payload.count ??
    payload.Count ??
    payload.unreadCount ??
    payload.UnreadCount;
  if (typeof c === "number") return c;
  if (typeof c === "string") {
    const n = Number(c);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export function useNotificationInbox() {
  const { accessToken } = useAuth();
  const { getMyNotifications, getUnreadCount, markAsRead } =
    useNotificationsApi();
  const queryClient = useQueryClient();

  const enabled = Boolean(accessToken);

  const listQ = useQuery({
    queryKey: ["notifications", "my"],
    queryFn: async () => {
      const res = await getMyNotifications();
      let raw = res?.data;
      if (typeof raw === "string") {
        try {
          raw = JSON.parse(raw);
        } catch {
          raw = null;
        }
      }
      return normalizeNotificationList(raw);
    },
    enabled,
    refetchInterval: 25_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const countQ = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await getUnreadCount();
      let raw = res?.data;
      if (typeof raw === "string") {
        try {
          raw = JSON.parse(raw);
        } catch {
          raw = {};
        }
      }
      return parseCount(raw);
    },
    enabled,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const readMutation = useMutation({
    mutationFn: (id) => markAsRead(id),
    onMutate: async (id) => {
      // Optimistic update — mark item as read immediately in cache
      await queryClient.cancelQueries({ queryKey: ["notifications", "my"] });
      const previous = queryClient.getQueryData(["notifications", "my"]);
      queryClient.setQueryData(["notifications", "my"], (old = []) =>
        old.map((n) => {
          const nId = n?.id ?? n?.Id;
          if (String(nId) === String(id)) {
            return { ...n, isRead: true, IsRead: true };
          }
          return n;
        }),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["notifications", "my"], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "my"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  const listError =
    listQ.error?.response?.data?.message ||
    listQ.error?.message ||
    (listQ.isError ? "Could not load notifications." : null);

  const countError =
    countQ.error?.response?.data?.message ||
    countQ.error?.message ||
    (countQ.isError ? "Could not load unread count." : null);

  return {
    items: listQ.data ?? [],
    unreadCount: countQ.data ?? 0,
    isLoading: listQ.isLoading || countQ.isLoading,
    isFetching: listQ.isFetching || countQ.isFetching,
    isError: listQ.isError || countQ.isError,
    listError,
    countError,
    refetch: () => {
      listQ.refetch();
      countQ.refetch();
    },
    markRead: readMutation.mutateAsync,
    isMarkingRead: readMutation.isPending,
  };
}
