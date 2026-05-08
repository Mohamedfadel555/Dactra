import { useEffect, useRef, useContext } from "react";
import { SponsorshipHubContext } from "./SponsorshipHubProvider";

export function useHubEvent(eventName, handler) {
  // بناخد الـ context بدون throw
  const connRef = useContext(SponsorshipHubContext);
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    // لو مفيش provider أو connection، نخرج بصمت
    if (!connRef?.current) return;

    const conn = connRef.current;
    const stableHandler = (...args) => {
      console.log(`[Hub] 📨 Event received: ${eventName}`, args);
      handlerRef.current(...args);
    };

    conn.on(eventName, stableHandler);
    console.log(`[Hub] 👂 Subscribed to: ${eventName}`);

    return () => {
      conn.off(eventName, stableHandler);
      console.log(`[Hub] 🔕 Unsubscribed from: ${eventName}`);
    };
  }, [eventName, connRef]);
}
