import { Request, Response } from "express";
import { MessagesService } from "../services/MessagesService";

class MessagesController {
  private service: MessagesService;

  constructor() {
    this.service = new MessagesService();
  }

  async create({ body: { admin_id, text, user_id } }: Request, response: Response) {
    const message = await this.service.create({
      admin_id,
      text,
      user_id
    });
    return response.json(message);
  }

  async showByUser({ params: { id } }: Request, response: Response) {
    const list = await this.service.listByUser(id);
    return response.json(list);
  }
}
export { MessagesController };
