import { Router } from "express";
import { usuarioRoutes } from "./usuarios-router";
import { loginRoutes } from "./login-router";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/login", loginRoutes);

export { router };
