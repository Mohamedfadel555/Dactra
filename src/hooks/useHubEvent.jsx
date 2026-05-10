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
      handlerRef.current(...args);
    };

    conn.on(eventName, stableHandler);

    return () => {
      conn.off(eventName, stableHandler);
    };
  }, [eventName, connRef]);
}
