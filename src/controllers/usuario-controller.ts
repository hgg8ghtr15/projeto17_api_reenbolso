import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import bcrypt from "bcrypt";

const createUsuarioSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    role: z.enum(["ADMIN", "COLABORADOR"]),
});

const filterUsuarioSchema = z.object({
    role: z.enum(["ADMIN", "COLABORADOR"]).optional(),
    email: z.email("Email inválido").optional(),
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
});

const usuarioJaExiste = async (email: string) => {
    const usuario = await prisma.usuario.findUnique({
        where: { email },
    })
    if (usuario) {
        throw new AppError("Usuario já cadastrado", 400);
    }
    return usuario
}

class UsuarioController {

    async create(request: Request, response: Response) {
        const { name, email, senha, role } = createUsuarioSchema.parse(request.body);

        await usuarioJaExiste(email);

        const senhaHash = await bcrypt.hash(senha, 10);

        const newUsuario = await prisma.usuario.create({
            data: {
                name,
                email,
                senha: senhaHash,
                role,
            },
        });

        const { senha: _, ...usuario } = newUsuario;

        return response.status(201).json({ message: "Usuario criado com sucesso", usuario });
    }

    async index(request: Request, response: Response) {
        const { role, email, name } = filterUsuarioSchema.parse(request.query);

        const usuarios = await prisma.usuario.findMany({
            where: {
                role,
                email,
                name: name ? { contains: name, mode: "insensitive" } : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return response.status(200).json({
            message: `Foram encontrados ${usuarios.length} usuarios!`,
            usuarios
        });
    }
}

export { UsuarioController };