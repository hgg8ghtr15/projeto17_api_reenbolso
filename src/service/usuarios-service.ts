import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import bcrypt from "bcrypt";

interface CreateUsuarioRequest {
    name: string;
    email: string;
    senha: string;
    role: "ADMIN" | "COLABORADOR";
}

interface FilterUsuarioRequest {
    role?: "ADMIN" | "COLABORADOR";
    email?: string;
    name?: string;
}

interface DeleteUsuarioRequest {
    id: string;
}

interface UpdateUsuarioRequest {
    id: string;
    name?: string;
    email?: string;
    role?: "ADMIN" | "COLABORADOR";
}


class UsuariosService {
    private async findByEmail(email: string) {
        return await prisma.usuario.findUnique({
            where: { email },
        });
    }

    private async findById(id: string) {
        return await prisma.usuario.findUnique({
            where: { id },
        });
    }

    async create({ name, email, senha, role }: CreateUsuarioRequest) {
        const usuarioJaExiste = await this.findByEmail(email);

        if (usuarioJaExiste) {
            throw new AppError("Usuario já cadastrado", 400);
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const newUsuario = await prisma.usuario.create({
            data: {
                name,
                email,
                senha: senhaHash,
                role,
            },
        });

        // Remove a senha do retorno
        const { senha: _, ...usuarioSemSenha } = newUsuario;

        return usuarioSemSenha;
    }

    async index({ role, email, name }: FilterUsuarioRequest) {
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

        return usuarios;
    }

    async delete({ id }: DeleteUsuarioRequest) {
        const usuario = await this.findById(id);

        if (!usuario) {
            throw new AppError("Usuario não encontrado", 404);
        }

        await prisma.usuario.delete({
            where: { id },
        });

        return { message: "Usuario deletado com sucesso" };
    }

    async update({ id, name, email, role }: UpdateUsuarioRequest) {
        const usuario = await this.findById(id);

        if (!usuario) {
            throw new AppError("Usuario não encontrado", 404);
        }

        if (email) {
            const usuarioJaExiste = await this.findByEmail(email);

            if (usuarioJaExiste) {
                throw new AppError("O e-mail não pode ser alterado para um e-mail já cadastrado", 400);
            }
        }

        const updatedUsuario = await prisma.usuario.update({
            where: { id },
            data: {
                name,
                email,
                role,
            },
        });

        const { senha: _, ...usuarioSemSenha } = updatedUsuario;

        return usuarioSemSenha;
    }
}

export { UsuariosService };
