import { Request, Response } from "express";
import uploadConfig from "@/config/uploadConfig";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { DiskStorage } from "@/utils/disk-storage";


const fileSchema = z.object({
    filename: z.string().min(1, "Nome do arquivo é obrigatório"),
    mimetype: z
        .string()
        .min(1, "Tipo do arquivo é obrigatório")
        .refine(
            (value) => {
                return uploadConfig.ACCEPTED_IMAGE_TYPES.includes(value);
            }, `Tipos de arquivo permitidos: ${uploadConfig.ACCEPTED_IMAGE_TYPES.join(", ")}`
        ),
    size: z
        .number()
        .positive("Tamanho do arquivo deve ser maior que 0")
        .refine(
            (value) => {
                return value <= uploadConfig.MAX_FILE_SIZE;
            }, `Tamanho do arquivo deve ser menor que ${uploadConfig.MAX_FILE_SIZE}`
        ),
}).passthrough();

class UploadController {
    async create(req: Request, res: Response) {
        const diskStorage = new DiskStorage();

        try {
            const file = fileSchema.parse(req.file);

            const savedFile = await diskStorage.saveFile(file.filename);

            res.status(200).json({
                message: "Uploaded successfully",
                savedFile
            })

        } catch (error) {
            if (req.file) {
                await diskStorage.deleteFile(req.file.filename);
            }

            if (error instanceof z.ZodError) {
                throw error;
            }

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError("Erro ao fazer upload do arquivo", 500);
        }

    }
}

export { UploadController };