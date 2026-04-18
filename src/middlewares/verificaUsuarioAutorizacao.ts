import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";


export function verificaUsuarioAutorizacao(roles: string[]) {
    return (request: Request, response: Response, next: NextFunction) => {

        if (!request.usuario) {
            throw new AppError("Usuario não autenticado!", 401);
        }


        if (!roles.includes(request.usuario.role)) {
            throw new AppError("Usuario sem permissão para realizar esta ação!", 403);
        }

        next();
    }
}