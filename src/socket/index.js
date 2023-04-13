let onlineUsers = [];

export const newSocketConnection = (socket) => {
  // 1. Send a message to a user that just logged in
  socket.emit("welcome", { message: `Welcome ${socket.id}` });

  // 2. Deal with the new arrival
  socket.on("setUsername", (payload) => {
    console.log(payload);
    // 2.1 Add the user in to Online Users array
    onlineUsers.push({ username: payload.username, socketID: socket.id });
    // 2.2 Send the online users list to the user
    socket.emit("loggedIn", onlineUsers);
    // 2.3 Inform all the others that somebody has joined the room
    socket.broadcast.emit("updateOnlineUsersList", onlineUsers);
  });

  // 3. Deal with messages
  socket.on("sendMessage", (message) => {
    // 3.1 When a user sends a message, server should pass the message to all the other users apart from the sender
    socket.broadcast.emit("newMessage", message);
  });

  // 4. Deal with the disconnected user ("disconnect", is a built in event of socket.io)
  socket.on("disconnect", () => {
    // 4.1 Remove the disconnected user from Online Users array
    onlineUsers = onlineUsers.filter((u) => u.socketID !== socket.id);
    // 4.2 Inform all the others that somebody has disconnected
    socket.broadcast.emit("updateOnlineUsersList", onlineUsers);
  });
};
