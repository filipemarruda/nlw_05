import { Request, Response } from "express";
import { MessagesService } from "../services/MessagesService";

class MessagesController {
  private messagesServices: MessagesService;

  constructor() {
    this.messagesServices = new MessagesService();
  }

  async create(request: Request, response: Response) {
    const { admin_id, text, user_id } = request.body;
    const message = await this.messagesServices.create({
      admin_id,
      text,
      user_id
    });
    return response.json(message);
  }

  async showByUser(request: Request, response: Response) {
    const { id } = request.params;
    const list = await this.messagesServices.listByUser(id);
    return response.json(list);
  }
}
export { MessagesController };
