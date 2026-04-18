import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/utils/authConfig";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

interface LoginRequest {
    email: string;
    senha: string;
}

class LoginService {
    async execute({ email, senha }: LoginRequest) {
        console.log("email", email);

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

        return { message: "Login realizado com sucesso", usuario: usuarioSemSenha, token };
    }
}

export { LoginService };