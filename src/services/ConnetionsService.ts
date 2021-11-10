import { getCustomRepository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionNotFoundError } from "../errors/ConnectionNotFoundError";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}

class ConnectionsService {
  private get repository(): ConnectionsRepository {
    return getCustomRepository(ConnectionsRepository);
  }

  async create({
    socket_id, user_id, admin_id, id
  }: IConnectionCreate): Promise<void> {
    const connection = this.repository.create({
      socket_id,
      user_id,
      admin_id,
      id
    });
    await this.repository.save(connection);
  }

  async findByUserId(user_id: string): Promise<Connection> {
    const connection = await this.repository.findOne({
      user_id
    });
    if (!connection) throw new ConnectionNotFoundError("Connection not found");
    return connection;
  }

  async findAllWithoutAdmin(): Promise<Connection[]> {
    const connections = await this.repository.find({
      where: {
        admin_id: null
      },
      relations: ["user"]
    });
    return connections;
  }

  async findBySocketId(socket_id: string): Promise<Connection> {
    const connections = await this.repository.findOne({
      socket_id
    });
    return connections;
  }

  async updateAdminId(user_id: string, admin_id: string) {
    await this.repository
      .createQueryBuilder()
      .update(Connection)
      .set({ admin_id })
      .where("user_id = :user_id", {
        user_id
      })
      .execute();
  }
}

export { ConnectionsService };
