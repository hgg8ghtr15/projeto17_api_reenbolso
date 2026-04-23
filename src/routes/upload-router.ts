import { UploadController } from "@/controllers/upload-controller";
import { verificaUsuarioAutenticado } from "@/middlewares/verificaUsuarioAutenticado";
import { verificaUsuarioAutorizacao } from "@/middlewares/verificaUsuarioAutorizacao";
import { Router } from "express";
import multer from "multer";
import uploadConfig from "@/config/uploadConfig";


const uploadRoutes = Router();

const uploadController = new UploadController();

const upload = multer(uploadConfig.MULTER);

uploadRoutes.use(verificaUsuarioAutenticado, verificaUsuarioAutorizacao(['ADMIN', 'COLABORADOR']));

uploadRoutes.post("/", upload.single('file'), uploadController.create);

export { uploadRoutes };
