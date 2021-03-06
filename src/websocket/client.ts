import { Socket } from "socket.io";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { io } from "../http";
import { ConnectionsService } from "../services/ConnetionsService";
import { MessagesService } from "../services/MessagesService";
import { UsersService } from "../services/UsersService";

interface IParams {
  text: string;
  email: string;
}

io.on("connect", (socket: Socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on("client_first_access", async ({ text, email }: IParams) => {
    const { id: socket_id } = socket;

    let user_id;
    let connection: any = {};

    try {
      ({ id: user_id } = await usersService.findByEmail(email));
      connection = await connectionsService.findByUserId(user_id);
    } catch (e) {
      if (e instanceof UserNotFoundError) ({ id: user_id } = await usersService.create(email));
    }

    connection = Object.assign(connection, { socket_id, user_id });
    connectionsService.create(connection);

    await messagesService.create({
      text,
      user_id
    });

    const allMessages = await messagesService.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);

    const allUser = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allUser);
  });

  socket.on("client_send_to_admin", async ({ text, socket_admin_id }) => {
    const socket_id = socket.id;

    const { user_id } = await connectionsService.findBySocketId(socket_id);

    const message = await messagesService.create({
      text,
      user_id
    });

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id
    });
  });
});
