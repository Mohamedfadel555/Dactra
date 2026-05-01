// hooks/useGetSlots.js
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { useAppointmentAPI } from "../api/appointmentAPI";

const HUB_URL = "https://dactra.runasp.net/doctorScheduleHub";

export const useGetSlots = (role, type) => {
  const { getInPersonSlots, getOnlineSlots } = useAppointmentAPI();
  const queryClient = useQueryClient();
  const connectionRef = useRef(null);

  const queryKey = type === "in-person" ? "inPersonSlots" : "onlineSlots";

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: type === "in-person" ? getInPersonSlots : getOnlineSlots,
    staleTime: 1000 * 60 * 5,
    enabled: role === "Doctor",
  });

  useEffect(() => {
    if (role !== "Doctor") return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        connection.on("SlotsUpdated", (data) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
          if (data?.WorkingHoursUpdated) {
            queryClient.invalidateQueries({ queryKey: ["inPersonSlots"] });
            queryClient.invalidateQueries({ queryKey: ["onlineSlots"] });
          }
        });
      })
      .catch((err) => console.error("SignalR failed:", err));

    return () => {
      connection.off("SlotsUpdated");
      connection.stop();
    };
  }, [role, queryKey, queryClient]);

  return query;
};
