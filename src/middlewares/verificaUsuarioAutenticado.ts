import { AppError } from "@/utils/AppError";
import { authConfig } from "@/config/authConfig";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
    sub: string;
    role: string;
}

export function verificaUsuarioAutenticado(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token não fornecido", 401);
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer") {
        throw new AppError("Token inválido", 401);
    }

    try {
        const { sub, role } = verify(token, authConfig.jwt.secret) as TokenPayload;

        // Adiciona o usuário ao objeto request para isso prescisa criar o arquivo express.d.ts 
        request.usuario = {
            id: sub,
            role,
        };

    } catch (error) {
        throw new AppError("Token inválido", 401);
    }

    next();
}