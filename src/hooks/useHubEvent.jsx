import { useEffect, useRef } from "react";
import { useSponsorshipHubConnection } from "./SponsorshipHubProvider";

export function useHubEvent(eventName, handler) {
  const connRef = useSponsorshipHubConnection();
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const conn = connRef.current;
    if (!conn) return;

    const stableHandler = (...args) => {
      handlerRef.current(...args);
    };

    conn.on(eventName, stableHandler);

    return () => {
      conn.off(eventName, stableHandler);
    };
  }, [eventName, connRef]);
}
