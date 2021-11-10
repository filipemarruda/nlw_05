import { Socket } from "socket.io";
import { io } from "../http";
import { ConnectionsService } from "../services/ConnetionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket: Socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
  io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

  socket.on("admin_list_messages_by_users", async ({ user_id }, callback) => {
    const allMessages = await messagesService.listByUser(user_id);
    callback(allMessages);
  });

  socket.on("admin_send_message", async ({ text, user_id }) => {
    await messagesService.create({
      text,
      user_id,
      admin_id: socket.id
    });

    const { socket_id } = await connectionsService.findByUserId(user_id);

    io.to(socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id
    });
  });

  socket.on("admin_user_in_support", async ({ user_id }) => {
    await connectionsService.updateAdminId(user_id, socket.id);
    const allConnections = await connectionsService.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allConnections);
  });
});
