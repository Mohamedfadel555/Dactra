// // signalRConnection.js
// // ───────────────────────────────────────────────────────────────
// // Singleton SignalR connection — يتعمل مرة واحدة في كل الـ app
// // ───────────────────────────────────────────────────────────────

// import * as signalR from "@microsoft/signalr";

// const HUB_URL = "https://dactra.runasp.net/doctorScheduleHub";

// let connectionInstance = null;
// let connectionPromise = null;

// /**
//  * يرجع connection واحد مشترك في كل الـ app
//  * لو الـ connection اتعمل قبل كده، يرجعه من غير ما يعمل واحد جديد
//  */
// export const getHubConnection = () => {
//   if (!connectionInstance) {
//     connectionInstance = new signalR.HubConnectionBuilder()
//       .withUrl(HUB_URL)
//       .withAutomaticReconnect([0, 2000, 5000, 10000]) // retry delays بالـ ms
//       .configureLogging(signalR.LogLevel.Warning)
//       .build();
//   }
//   return connectionInstance;
// };

// /**
//  * يبدأ الـ connection لو مش شغال
//  * بيرجع promise واحدة حتى لو اتكلم أكتر من مرة في نفس الوقت
//  */
// export const startHubConnection = async () => {
//   const connection = getHubConnection();

//   if (connection.state === signalR.HubConnectionState.Connected) {
//     return connection;
//   }

//   if (connection.state === signalR.HubConnectionState.Connecting) {
//     return connectionPromise;
//   }

//   connectionPromise = connection.start().then(() => {
//     console.log("SignalR connected");
//     return connection;
//   });

//   return connectionPromise;
// };

// /**
//  * يوقف الـ connection بالكامل (لما المستخدم يعمل logout مثلاً)
//  */
// export const stopHubConnection = async () => {
//   if (
//     connectionInstance &&
//     connectionInstance.state === signalR.HubConnectionState.Connected
//   ) {
//     await connectionInstance.stop();
//     connectionInstance = null;
//     connectionPromise = null;
//     console.log(" SignalR disconnected");
//   }
// };
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
