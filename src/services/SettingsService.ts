import { getCustomRepository } from "typeorm";
import { Setting } from "../entities/Setting";
import { UserAlreadyExistisError } from "../errors/UserAlreadyExistisError";
import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettingsCreate {
  chat: boolean,
  username: string
}

class SettingsService {
  private get repository(): SettingsRepository {
    return getCustomRepository(SettingsRepository);
  }

  async create({ chat, username } :ISettingsCreate): Promise<Setting> {
    const userAlreadyExistis = await this.repository.findOne({ username });
    if (userAlreadyExistis) throw new UserAlreadyExistisError("User already exists");
    const settings = this.repository.create({
      chat,
      username
    });
    await this.repository.save(settings);
    return settings;
  }

  async findByUsername(username: string): Promise<Setting> {
    const settings = await this.repository.findOne({
      username
    });
    return settings;
  }

  async update(username: string, chat: boolean): Promise<void> {
    await this.repository.createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where("username = :username", {
        username
      })
      .execute();
  }
}

export { SettingsService };
