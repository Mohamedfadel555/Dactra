// hooks/useGetSlots.js
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { useAppointmentAPI } from "../api/appointmentAPI";

const HUB_URL = "https://dactra.runasp.net/doctorScheduleHub";

export const useGetSlots = (role, type, id) => {
  const { getInPersonSlots, getOnlineSlots } = useAppointmentAPI();
  const queryClient = useQueryClient();
  const connectionRef = useRef(null);

  const queryKey = type === "in-person" ? "inPersonSlots" : "onlineSlots";

  console.log(queryKey);

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: type === "in-person" ? getInPersonSlots : getOnlineSlots,
    staleTime: 1000 * 60 * 5,
    enabled: role === "Doctor" && !!id,
  });

  console.log(
    "🟡 Query state:",
    query.status,
    "| isFetching:",
    query.isFetching,
    "| data:",
    query.data,
  );

  useEffect(() => {
    if (role !== "Doctor") return;

    let cancelled = false;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None) // ← سكّت كل الـ logs
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        if (cancelled) {
          connection.stop();
          return;
        }

        if (!id) {
          console.warn("No doctor id yet, skipping JoinDoctorSchedule");
          return;
        }

        connection.invoke("JoinDoctorSchedule", Number(id));

        console.log("✅ Joined group DoctorSchedule_" + id);

        connection.on("SlotsUpdated", (data) => {
          console.log("🔄 SlotsUpdated received:", data);

          if (data?.WorkingHoursUpdated) {
            queryClient.invalidateQueries({ queryKey: ["inPersonSlots"] });
            queryClient.invalidateQueries({ queryKey: ["onlineSlots"] });
            queryClient.refetchQueries({ queryKey: ["inPersonSlots"] });
            queryClient.refetchQueries({ queryKey: ["onlineSlots"] });
          } else {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            queryClient.refetchQueries({ queryKey: [queryKey] });
          }
        });
      })
      .catch((err) => {
        if (!cancelled) console.error("SignalR failed:", err);
      });

    return () => {
      cancelled = true;
      connection.off("SlotsUpdated");
      connection.stop();
    };
  }, [role, queryKey, queryClient, id]);

  return query;
};
