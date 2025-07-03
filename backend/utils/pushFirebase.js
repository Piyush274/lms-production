const admin = require("../config/firebaseConfig"); // Import initialized Firebase

// const sendNotification = async (token, title, body) => {
//   const message = {
//     notification: {
//       title,
//       body,
//     },
//     token,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("Notification sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     throw error;
//   }
// };

const sendNotification = async (message, deviceIds) => {
  console.log("✌️message, deviceIds --->", message, deviceIds);
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: deviceIds,
      data: {
        title: message.title,
        body: message.message,
        icon: "",
      },
    });

    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(deviceIds[idx]);
        }
      });
      console.log("Failed tokens:", failedTokens);
    } else {
      console.log("Successfully sent message to all devices:", response);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = {
  sendNotification,
};
