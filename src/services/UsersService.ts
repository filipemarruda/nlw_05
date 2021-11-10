import { getCustomRepository } from "typeorm";
import { User } from "../entities/User";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  private get repository(): UsersRepository {
    return getCustomRepository(UsersRepository);
  }

  async create(email: string): Promise<User> {
    const userExists = await this.repository.findOne({
      email
    });
    if (userExists) return userExists;
    const user = this.repository.create({
      email
    });
    await this.repository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });
    if (!user) throw new UserNotFoundError("User not found");
    return user;
  }
}

export { UsersService };
