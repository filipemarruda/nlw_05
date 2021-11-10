import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
  private service: SettingsService;

  constructor() {
    this.service = new SettingsService();
  }

  async create({ body: { chat, username } }: Request, response: Response): Promise<Response> {
    try {
      const settings = await this.service.create({ chat, username });
      return response.json(settings);
    } catch ({ message }) {
      return response.status(400).json({
        message
      });
    }
  }

  async findByUsername({ params: { username } }: Request, response: Response): Promise<Response> {
    const settings = await this.service.findByUsername(username);
    return response.json(settings);
  }

  async update({ params: { username }, body: { chat } }: Request, response: Response): Promise<Response> {
    const settings = await this.service.update(username, chat);
    return response.json(settings);
  }
}

export { SettingsController };
