import { Router } from "express";
import { ReembolsoController } from "@/controllers/reembolso-controller";
import { verificaUsuarioAutenticado } from "@/middlewares/verificaUsuarioAutenticado";
import { ReembolsoService } from "@/service/reembolso-service";
import { verificaUsuarioAutorizacao } from "@/middlewares/verificaUsuarioAutorizacao";
import uploadConfig from "@/config/uploadConfig";
import multer from "multer";

const upload = multer(uploadConfig.MULTER);

const reembolsoRoutes = Router();
const reembolsoService = new ReembolsoService();
const reembolsoController = new ReembolsoController(reembolsoService);

reembolsoRoutes.use(verificaUsuarioAutenticado, verificaUsuarioAutorizacao(["COLABORADOR", "ADMIN"]));

reembolsoRoutes.post("/", (req, res) => reembolsoController.create(req, res));
reembolsoRoutes.get("/", (req, res) => reembolsoController.index(req, res));
reembolsoRoutes.get("/:id", (req, res) => reembolsoController.show(req, res));
reembolsoRoutes.delete("/:id", (req, res) => reembolsoController.delete(req, res));
reembolsoRoutes.patch("/:id/comprovante", upload.single("file"), (req, res) => reembolsoController.updateComprovante(req, res));


export { reembolsoRoutes };
