// import { chatService } from "./service/index";
const { chatService } = require("./service"); // Import the service for database operations

const socketConfig = async (io, socket) => {
  // Join a room
  socket.on("JOIN ROOM", (data) => {
    const { group_id } = JSON.parse(data);
    if (group_id) {
      socket.join(group_id);
    }
  });

  // Leave a room
  socket.on("LEAVE ROOM", (data) => {
    const { group_id } = JSON.parse(data);
    socket.leave(group_id);
  });

  socket.on("FETCH MESSAGE", async (data) => {
    const { group_id } = JSON.parse(data);

    try {
      // Retrieve messages from the database
      const messages = await chatService.get_messages(group_id);

      socket.emit("RECEIVER", {
        type: "FETCHED MESSAGES",
        messages,
      });
    } catch (error) {
      socket.emit("ERROR", { message: "Failed to fetch messages" });
    }
  });

  // Send a message
  socket.on("SEND MESSAGE", async (data) => {
    const payload = JSON.parse(data);


    try {
      // Save the message to the database
      const savedMessage = await chatService.create_message(payload);

      // Emit the saved message to the room
      io.in(payload.group_id).emit("RECEIVER", {
        payload: savedMessage,
        type: "RECEIVE MESSAGE",
      });
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("ERROR", { message: "Failed to send message" });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
};

module.exports = {socketConfig}
