import { Router } from "express";
import { LoginController } from "@/controllers/login-controller";
import { LoginService } from "@/service/login-service";

const loginRoutes = Router();
const loginService = new LoginService();
const loginController = new LoginController(loginService);

loginRoutes.post("/", (req, res) => loginController.create(req, res));

export { loginRoutes };