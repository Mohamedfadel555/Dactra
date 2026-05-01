// hooks/useGetSlotsById.js
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { useAppointmentAPI } from "../api/appointmentAPI";

const HUB_URL = "https://dactra.runasp.net/doctorScheduleHub";

export const useGetSlotsById = (type, id) => {
  const { getInpersonSlotsById, getOnlineSlotsById } = useAppointmentAPI();
  const queryClient = useQueryClient();
  const connectionRef = useRef(null);

  const queryKey = [type, id];

  const query = useQuery({
    queryFn: () =>
      type === "online" ? getOnlineSlotsById(id) : getInpersonSlotsById(id),
    queryKey,
    enabled: !!id,
  });
  useEffect(() => {
    if (!id) return;

    const numericId = Number(id);
    let cancelled = false;
    let connection = null;

    const start = async () => {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      connectionRef.current = connection;

      // انتظر لحظة صغيرة — عشان StrictMode cleanup يخلص الأول
      await new Promise((r) => setTimeout(r, 100));

      if (cancelled) return; // لو cleanup اشتغل في الـ 100ms دول، وقف

      try {
        await connection.start();
        if (cancelled) {
          connection.stop();
          return;
        }

        await connection.invoke("JoinDoctorSchedule", numericId);

        connection.on("SlotsUpdated", (data) => {
          if (data?.DoctorId && data.DoctorId !== numericId) return;
          queryClient.invalidateQueries({ queryKey });
        });
      } catch (err) {
        if (!cancelled) console.error("SignalR failed:", err.message);
      }
    };

    start();

    return () => {
      cancelled = true;
      if (connection) {
        connection.off("SlotsUpdated");
        if (connection.state === signalR.HubConnectionState.Connected) {
          connection.invoke("LeaveDoctorSchedule", numericId).catch(() => {});
        }
        connection.stop();
      }
    };
  }, [id, queryClient]);

  return query;
};
