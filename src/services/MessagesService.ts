import { getCustomRepository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageCreate {
  admin_id?: string;
  text: string;
  user_id: string;
}

class MessagesService {
  private get repository(): MessagesRepository {
    return getCustomRepository(MessagesRepository);
  }

  async create({ admin_id, text, user_id } :IMessageCreate): Promise<Message> {
    const message = this.repository.create({
      admin_id,
      text,
      user_id
    });
    await this.repository.save(message);
    return message;
  }

  async listByUser(user_id: string): Promise<Message[]> {
    const list = await this.repository.find({
      where: { user_id },
      relations: ["user"]
    });
    return list;
  }
}
export { MessagesService };
