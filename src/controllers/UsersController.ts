import { Request, Response } from "express";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UsersService } from "../services/UsersService";

class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    try {
      const user = await this.usersService.findByEmail(email);
      return response.json(user);
    } catch (err) {
      const status = err instanceof UserNotFoundError ? 404 : 400;
      return response.status(status).json({
        message: err.message
      });
    }
  }
}

export { UsersController };
