import { Router } from "express";
import { usuarioRoutes } from "./usuarios-router";
import { loginRoutes } from "./login-router";
import { reembolsoRoutes } from "./reembolso-router";
import { uploadRoutes } from "./upload-router";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/login", loginRoutes);
router.use("/reembolso", reembolsoRoutes);
router.use("/upload", uploadRoutes);

export { router };
