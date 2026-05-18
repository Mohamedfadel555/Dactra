import { useMemo } from "react";
import { useAxios } from "./useAxios";

function extractMessage(payload) {
  if (typeof payload === "string") return payload;
  if (payload != null) {
    if (typeof payload.message === "string") return payload.message;
    if (typeof payload.Message === "string") return payload.Message;
  }
  return "";
}

/**
 * Builds a minimal notification body, falling back to a full DTO on 400.
 *
 * @param {object} opts
 * @param {Function} opts.post          - axios.post bound to a URL
 * @param {string|number} opts.entityId - the route param (postId / slotId / etc.)
 * @param {object} opts.body            - caller-supplied overrides
 * @param {string} opts.defaultType     - e.g. "Booking" | "Community"
 */
async function postWithFallback({ post, entityId, body = {}, defaultType }) {
  const numericId = Number(entityId);
  const title = body.title ?? "Notification";
  const message = body.message ?? "";

  const minimal = { title, message };

  try {
    return await post(minimal);
  } catch (err) {
    if (err?.response?.status !== 400) throw err;

    const full = {
      id: 0,
      title,
      message,
      type: body.type ?? defaultType,
      relatedEntityId: Number.isNaN(numericId) ? entityId : numericId,
      isRead: false,
      createdAtUtc: new Date().toISOString(),
    };

    return post(full);
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Notification API — mirrors the Swagger spec at dactra.runasp.net
 */
export function useNotificationsApi() {
  const axios = useAxios();

  return useMemo(
    () => ({
      /** GET /Notification/my */
      getMyNotifications: () => axios.get("Notification/my"),

      /** GET /Notification/unread-count */
      getUnreadCount: () => axios.get("Notification/unread-count"),

      /** POST /Notification/read/:id */
      markAsRead: (id) => axios.post(`Notification/read/${id}`),

      /**
       * POST /Notification/me
       * Self-confirmation (e.g. after creating a post).
       * Body shape: string | { message: string }
       */
      notifyMe: (payload) => {
        const message = extractMessage(payload);

        // Try lowercase key first, fall back to PascalCase on 400.
        return axios.post("Notification/me", { message }).catch((err) => {
          if (err?.response?.status === 400) {
            return axios.post("Notification/me", { Message: message });
          }
          throw err;
        });
      },

      /**
       * POST /Notification/sent-to-doctor/:postId
       * Triggered on like / comment on a doctor's post.
       */
      notifySentToDoctor: (postId, body = {}) =>
        postWithFallback({
          post: (dto) =>
            axios.post(`Notification/sent-to-doctor/${postId}`, dto),
          entityId: postId,
          body: { title: "Activity on your post", ...body },
          defaultType: "Community",
        }),

      /**
       * POST /Notification/cancel/:slotId
       * Triggered when an appointment is cancelled.
       */
      notifyCancel: (slotId, body = {}) =>
        postWithFallback({
          post: (dto) => axios.post(`Notification/cancel/${slotId}`, dto),
          entityId: slotId,
          body: { title: "Appointment", ...body },
          defaultType: "Booking",
        }),

      /**
       * POST /Notification/bookAppointmentNotification/:id
       * Triggered on a new booking.
       */
      notifyBookAppointment: (id, body = {}) =>
        postWithFallback({
          post: (dto) =>
            axios.post(`Notification/bookAppointmentNotification/${id}`, dto),
          entityId: id,
          body: { title: "Appointment", ...body },
          defaultType: "Booking",
        }),

      /**
       * POST /Notification/new-user
       * Triggered after a new user registers — notifies admin.
       */
      notifyNewUser: (userId, userType) =>
        axios.post("Notification/new-user", { userId, userType }),

      notifyInterestedUsers: (Id) => {
        axios.post(`Notification/interested-users/${Id}`);
      },
    }),
    [axios],
  );
}
