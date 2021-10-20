import { Router } from "express";

import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLastMessagesController } from "./controllers/GetLastMessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);

router.post("/messages", ensureAuthenticated, new CreateMessageController().handle);

router.get("/messages/last", new GetLastMessagesController().handle);

router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { router }