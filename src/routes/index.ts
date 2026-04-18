import { Router } from "express";
import { usuarioRoutes } from "./usuario-router";
import { loginRoutes } from "./login-router";

const router = Router();

router.use("/", usuarioRoutes);
router.use("/", loginRoutes);

export { router };
