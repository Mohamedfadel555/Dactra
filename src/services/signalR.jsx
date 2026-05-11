import * as signalR from "@microsoft/signalr";

let connection = null;

export const getConnection = (accessToken) => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://dactra.runasp.net/doctorScheduleHub", {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  return connection;
};
