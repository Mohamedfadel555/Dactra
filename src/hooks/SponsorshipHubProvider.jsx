import { createContext, useContext, useEffect, useRef } from "react";
import { getSponsorshipConnection, startConnection } from "./SponsorShipHub";

// export الـ context علشان useHubEvent يقدر يستخدمه بدون throw
export const SponsorshipHubContext = createContext(null);

export function SponsorshipHubProvider({ getToken, children }) {
  const connectionRef = useRef(null);

  useEffect(() => {
    const conn = getSponsorshipConnection(getToken);
    connectionRef.current = conn;

    console.log("[Hub] 🚀 Starting connection...");
    console.log("[Hub] Token:", getToken());

    startConnection(conn)
      .then(() => {
        console.log("[Hub] ✅ Connected! State:", conn.state);
        console.log("[Hub] Connection ID:", conn.connectionId);
      })
      .catch((err) => {
        console.error("[Hub] ❌ Connection failed:", err);
      });

    conn.onreconnecting((err) => console.warn("[Hub] 🔄 Reconnecting...", err));
    conn.onreconnected((id) =>
      console.log("[Hub] ✅ Reconnected, new ID:", id),
    );
    conn.onclose((err) => console.error("[Hub] ❌ Connection closed:", err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SponsorshipHubContext.Provider value={connectionRef}>
      {children}
    </SponsorshipHubContext.Provider>
  );
}

export function useSponsorshipHubConnection() {
  const ctx = useContext(SponsorshipHubContext);
  if (!ctx) {
    throw new Error(
      "useSponsorshipHubConnection must be used inside <SponsorshipHubProvider>",
    );
  }
  return ctx;
}
