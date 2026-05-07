import * as signalR from "@microsoft/signalr";

let connection = null;
let connectionPromise = null;

/**
 * Returns a singleton SignalR connection.
 * Safe under React Strict Mode (double-invoke) — only one connection is ever built.
 */
export function getSponsorshipConnection(getToken) {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://dactra.runasp.net/hubs/sponsorship", {
      accessTokenFactory: getToken,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

  return connection;
}

/**
 * Starts the connection once. Returns the same promise on repeated calls.
 * Handles React Strict Mode double-mount safely.
 */
export async function startConnection(connection) {
  if (connection.state === signalR.HubConnectionState.Connected) return;
  if (connectionPromise) return connectionPromise;

  connectionPromise = connection
    .start()
    .then(() => {
      connectionPromise = null;
    })
    .catch((err) => {
      connectionPromise = null;
      console.error("[SponsorshipHub] Failed to connect:", err);
      throw err;
    });

  return connectionPromise;
}

export async function stopConnection(connection) {
  if (
    connection &&
    connection.state !== signalR.HubConnectionState.Disconnected
  ) {
    await connection.stop();
  }
}
