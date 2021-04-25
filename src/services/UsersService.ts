import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async create(email: string): Promise<User> {
    const userExists = await this.usersRepository.findOne({
      email
    });
    if (userExists) return userExists;
    const user = this.usersRepository.create({
      email
    });
    await this.usersRepository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) throw new UserNotFoundError("User not found");
    return user;
  }
}

export { UsersService };
