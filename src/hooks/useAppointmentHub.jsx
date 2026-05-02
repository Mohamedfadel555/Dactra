import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";

export function useAppointmentHub() {
  const queryClient = useQueryClient();
  const { accessToken, role } = useAuth();
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!accessToken || !role) return;

    let active = true;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://dactra.runasp.net/appointmentHub", {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
    const refreshAll = () => {
      if (!active) return;
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment-statistics"] });
    };

    const patchAllPages = (updater) => {
      if (!active) return;
      queryClient
        .getQueriesData({ queryKey: ["appointments"] })
        .forEach(([key, data]) => {
          if (!data) return;
          const patch = (items) => items.map(updater);
          let next = data;
          if (Array.isArray(data)) {
            next = patch(data);
          } else if (data.items) {
            next = { ...data, items: patch(data.items) };
          }
          queryClient.setQueryData(key, next);
        });
    };

    connection.on("AppointmentBooked", () => {
      refreshAll();
    });

    connection.on("AppointmentCancelled", (payload) => {
      if (!active) return;

      const appointmentId =
        payload.appointmentId ?? payload.AppointmentId ?? null;
      const cancelledReason =
        payload.cancelledReason ?? payload.CancelledReason ?? null;

      if (!appointmentId) {
        refreshAll();
        return;
      }

      patchAllPages((item) => {
        const id = item.appointmentId ?? item.id ?? null;
        if (id == null || Number(id) !== Number(appointmentId)) return item;
        return { ...item, status: "Cancelled", cancelledReason };
      });

      refreshAll();
    });

    connection
      .start()
      .then(() => {
        if (!active) {
          connection.stop();
          return;
        }
        return connection.invoke("JoinMyGroup");
      })
      .catch((err) => {
        console.error(" SignalR Error:", err);
      });

    return () => {
      active = false;
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection
          .invoke("LeaveMyGroup")
          .catch(() => {})
          .finally(() => connection.stop().catch(() => {}));
      } else {
        connection.stop().catch(() => {});
      }
    };
  }, [accessToken, role, queryClient]);
}
