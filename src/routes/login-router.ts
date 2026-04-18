const { Router } = require("express");
const { LoginController } = require("@/controllers/login-controller");

const loginRoutes = Router();

const loginController = new LoginController();

loginRoutes.post("/login", loginController.create);

export { loginRoutes };