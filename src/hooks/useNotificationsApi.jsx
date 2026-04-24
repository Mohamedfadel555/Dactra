import { useMemo } from "react";
import { useAxios } from "./useAxios";

/**
 * Notification API — see Swagger (dactra.runasp.net)
 */
export function useNotificationsApi() {
  const axios = useAxios();
  return useMemo(
    () => ({
      getMyNotifications: () => axios.get("Notification/my"),
      getUnreadCount: () => axios.get("Notification/unread-count"),
      markAsRead: (id) => axios.post(`Notification/read/${id}`),
      /** Self-confirmation, e.g. after creating a post — body must be `{ message: string }` */
      notifyMe: async (payload) => {
        const text =
          typeof payload === "string"
            ? payload
            : payload != null && typeof payload.message === "string"
              ? payload.message
              : "";
        try {
          return await axios.post("Notification/me", { message: text });
        } catch (e) {
          if (e?.response?.status === 400) {
            return await axios.post("Notification/me", { Message: text });
          }
          throw e;
        }
      },
      /** Like/comment on doctor's post — some builds expect full notification DTO */
      notifySentToDoctor: async (postId, body = {}) => {
        const pid = Number(postId);
        const title = body.title ?? "Activity on your post";
        const message = body.message ?? "";
        const minimal = { title, message };
        try {
          return await axios.post(
            `Notification/sent-to-doctor/${postId}`,
            minimal,
          );
        } catch (e) {
          if (e?.response?.status === 400) {
            const full = {
              id: 0,
              title,
              message,
              type: body.type ?? "Community",
              relatedEntityId: Number.isNaN(pid) ? postId : pid,
              isRead: false,
              createdAtUtc: new Date().toISOString(),
            };
            return await axios.post(
              `Notification/sent-to-doctor/${postId}`,
              full,
            );
          }
          throw e;
        }
      },
      /** Cancel appointment — slot id */
      notifyCancel: (slotId, body) =>
        axios.post(`Notification/cancel/${slotId}`, body),
      /** New booking */
      notifyBookAppointment: async (id, body = {}) => {
        const minimal = {
          title: body.title ?? "Appointment",
          message: body.message ?? "",
        };
        try {
          return await axios.post(
            `Notification/bookAppointmentNotification/${id}`,
            minimal,
          );
        } catch (e) {
          if (e?.response?.status === 400) {
            const pid = Number(id);
            return await axios.post(
              `Notification/bookAppointmentNotification/${id}`,
              {
                id: 0,
                title: minimal.title,
                message: minimal.message,
                type: body.type ?? "Booking",
                relatedEntityId: Number.isNaN(pid) ? id : pid,
                isRead: false,
                createdAtUtc: new Date().toISOString(),
              },
            );
          }
          throw e;
        }
      },
      /** New registration — admin */
      notifyNewUser: (userId, userType) =>
        axios.post("Notification/new-user", { userId, userType }),
    }),
    [axios],
  );
}
