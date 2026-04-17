import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

// Manuseio de erro
export const errorHandling = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Erro de validação",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    return res.status(500).json({ message: "Erro interno no servidor!" });
}

// Exemplo de como usar o Zods

// const bodySchema = z.object({
//         idade: z.number({
//             // No Zod 4, usamos a propriedade 'error' com uma função
//             error: (issue) =>
//                 issue.input === undefined
//                     ? "Idade é obrigatória e não foi informada!"
//                     : "Idade deve ser um número!",
//         }).min(18, "Deve ter pelo menos 18 anos!")
//     })
//     const { idade } = bodySchema.parse(req.body || {});