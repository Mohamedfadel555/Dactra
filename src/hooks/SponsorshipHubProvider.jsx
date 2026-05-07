import { createContext, useContext, useEffect, useRef } from "react";
import { getSponsorshipConnection, startConnection } from "./sponsorshipHub";

const SponsorshipHubContext = createContext(null);

export function SponsorshipHubProvider({ getToken, children }) {
  const connectionRef = useRef(null);

  useEffect(() => {
    const conn = getSponsorshipConnection(getToken);
    connectionRef.current = conn;

    startConnection(conn).catch((err) => {
      console.error("[Hub] ❌ Connection failed:", err);
    });
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
