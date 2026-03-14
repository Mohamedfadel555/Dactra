import * as signalR from "@microsoft/signalr";

export const createConnection = () =>
  new signalR.HubConnectionBuilder().withUrl().withAutomaticReconnect().build();
