import { Router } from "express";
import { UsuariosService } from "@/service/usuarios-service";
import { UsuarioController } from "@/controllers/usuarios-controller";
import { verificaUsuarioAutenticado } from "@/middlewares/verificaUsuarioAutenticado";
import { verificaUsuarioAutorizacao } from "@/middlewares/verificaUsuarioAutorizacao";

const usuarioRoutes = Router();
const usuariosService = new UsuariosService();
const usuarioController = new UsuarioController(usuariosService);

usuarioRoutes.post("/", (req, res) => usuarioController.create(req, res));
usuarioRoutes.get("/", verificaUsuarioAutenticado, verificaUsuarioAutorizacao(["ADMIN"]), (req, res) => usuarioController.index(req, res));
usuarioRoutes.put("/:id", verificaUsuarioAutenticado, (req, res) => usuarioController.update(req, res));
usuarioRoutes.delete("/:id", verificaUsuarioAutenticado, verificaUsuarioAutorizacao(["ADMIN"]), (req, res) => usuarioController.delete(req, res));

export { usuarioRoutes };