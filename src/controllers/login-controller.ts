import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { z } from "zod";
import bcrypt from "bcrypt";
import { authConfig } from "@/utils/authConfig";
import { sign } from "jsonwebtoken";

const loginSchema = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});



class LoginController {
    async create(request: Request, response: Response) {
        const { email, senha } = loginSchema.parse(request.body);

        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            throw new AppError("Usuario não encontrado", 404);
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            throw new AppError("Senha incorreta", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        // Gerar o token JWT
        const token = sign({ role: usuario.role ?? "COLABORADOR" }, secret, {
            subject: String(usuario.id),
            expiresIn: expiresIn as any
        });

        const { senha: _, ...usuarioSemSenha } = usuario;

        return response.status(200).json({ message: "Login realizado com sucesso", usuario: usuarioSemSenha, token });
    }
}

export { LoginController };
