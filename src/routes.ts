import { Router } from "express";
import { MessagesController } from "./controllers/MessagesController";
import { SettingsController } from "./controllers/SettingsController";
import { UsersController } from "./controllers/UsersController";

const routes = Router();
const settingsController = new SettingsController();
const usersController = new UsersController();
const messagesController = new MessagesController();

routes.post("/settings", (request, response) => settingsController.create(request, response));
routes.get("/settings/:username", (request, response) => settingsController.findByUsername(request, response));
routes.put("/settings/:username", (request, response) => settingsController.update(request, response));

routes.post("/users", (request, response) => usersController.create(request, response));

routes.post("/messages", (request, response) => messagesController.create(request, response));
routes.get("/messages/:id", (request, response) => messagesController.showByUser(request, response));

export { routes };
