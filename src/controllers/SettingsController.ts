import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
  private settingsService: SettingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { chat, username } = request.body;
    try {
      const settings = await this.settingsService.create({ chat, username });
      return response.json(settings);
    } catch (err) {
      return response.status(400).json({
        message: err.message
      });
    }
  }

  async findByUsername(request: Request, response: Response): Promise<Response> {
    const { username } = request.params;
    const settings = await this.settingsService.findByUsername(username);
    return response.json(settings);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { username } = request.params;
    const { chat } = request.body;
    const settings = await this.settingsService.update(username, chat);
    return response.json(settings);
  }
}

export { SettingsController };
