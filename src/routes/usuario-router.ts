import { Router } from "express";
import { UsuarioController } from "@/controllers/usuario-controller";
import { verificaUsuarioAutenticado } from "@/middlewares/verificaUsuarioAutenticado";
import { verificaUsuarioAutorizacao } from "@/middlewares/verificaUsuarioAutorizacao";

const usuarioRoutes = Router();

const usuarioController = new UsuarioController();

usuarioRoutes.post("/usuario", usuarioController.create);

usuarioRoutes.get("/usuario", verificaUsuarioAutenticado, verificaUsuarioAutorizacao(["ADMIN"]), usuarioController.index)

export { usuarioRoutes };