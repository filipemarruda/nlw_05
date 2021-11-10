import { Request, Response } from "express";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UsersService } from "../services/UsersService";

class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  async create({ body: { email } }: Request, response: Response): Promise<Response> {
    try {
      const user = await this.service.findByEmail(email);
      return response.json(user);
    } catch (err) {
      const { message } = err;
      const status = err instanceof UserNotFoundError ? 404 : 400;
      return response.status(status).json({
        message
      });
    }
  }
}

export { UsersController };
