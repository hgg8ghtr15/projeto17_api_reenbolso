import { Request, Response } from "express";
import { z } from "zod";
import { ReembolsoService } from "@/service/reembolso-service";
import { AppError } from "@/utils/AppError";
import uploadConfig from "@/config/uploadConfig";
import { DiskStorage } from "@/utils/disk-storage";



const createReembolsoSchema = z.object({
    titulo: z.string().min(1, "Titulo é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    valor: z.number().positive("Valor deve ser maior que 0"),
    categoria: z.enum(["ALIMENTACAO", "TRANSPORTE", "HOSPEDAGEM", "SERVICOS", "OUTROS"]),
    nomearquivo: z.string().min(1, "Nome do arquivo é obrigatório"),
});

const indexReembolsoSchema = z.object({
    name: z.string().optional(),
    categoria: z.enum(["ALIMENTACAO", "TRANSPORTE", "HOSPEDAGEM", "SERVICOS", "OUTROS"]).optional(),
    status: z.enum(["SOLICITADO", "APROVADO", "REPROVADO"]).optional(),
    userId: z.string().optional(),
    page: z.coerce.number().optional().default(1),
    perPage: z.coerce.number().optional().default(10),
});

const idSchema = z.object({
    id: z.string("ID inválido"),
});

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

class ReembolsoController {
    constructor(private reembolsoService: ReembolsoService) { }

    async create(request: Request, response: Response) {
        const { titulo, descricao, valor, categoria, nomearquivo } = createReembolsoSchema.parse(request.body);

        const userId = request.usuario?.id;

        if (!userId) {
            throw new AppError("Usuario não autenticado", 401);
        }

        const reembolso = await this.reembolsoService.create({ titulo, descricao, valor, categoria, nomearquivo, userId });


        return response.status(201).json({
            message: "Reembolso criado com sucesso",
            reembolso
        });
    }

    async index(request: Request, response: Response) {
        // Valida e extrai os parâmetros da query string
        const { categoria, status, userId, name, page, perPage } = indexReembolsoSchema.parse(request.query);

        /**
         * Lógica de Paginação:
         * skip: Define quantos itens pular. 
         *       Se page=1 e perPage=10 -> skip = (1-1)*10 = 0 (pega do início)
         *       Se page=2 e perPage=10 -> skip = (2-1)*10 = 10 (pula os 10 primeiros)
         * take: Define o limite de itens por página.
         */
        const skip = (page - 1) * perPage;
        const take = perPage;


        const { reembolsos, pagination } = await this.reembolsoService.index({ categoria, status, userId, name, skip, take, page });

        return response.status(200).json({
            message: `Foram listados ${reembolsos.length} reembolsos`,
            reembolsos,
            pagination
        });
    }

    async show(request: Request, response: Response) {
        const { id } = idSchema.parse(request.params);

        const { reembolso } = await this.reembolsoService.show({ id });

        return response.status(200).json({
            message: "Reembolso encontrado com sucesso",
            reembolso
        });
    }

    async delete(request: Request, response: Response) {
        const { id } = idSchema.parse(request.params);

        await this.reembolsoService.delete({ id });

        return response.status(200).json({
            message: "Reembolso deletado com sucesso",
        });
    }

    async updateComprovante(request: Request, response: Response) {
        const { id } = idSchema.parse(request.params);

        const diskStorage = new DiskStorage();

        try {
            const file = fileSchema.parse(request.file);

            const savedFile = await diskStorage.saveFile(file.filename);

            await this.reembolsoService.updateComprovante({ id, nomearquivo: savedFile });

            return response.status(200).json({
                message: "Comprovante enviado com sucesso!",
            })

        } catch (error) {
            if (request.file) {
                await diskStorage.deleteFile(request.file.filename);
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

export { ReembolsoController };