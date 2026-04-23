import { Request, Response } from "express";
import { z } from "zod";
import { UsuariosService } from "@/service/usuarios-service";

const createUsuarioSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("Email inválido").trim().toLowerCase(),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    role: z.enum(["ADMIN", "COLABORADOR"]),
});

const filterUsuarioSchema = z.object({
    role: z.enum(["ADMIN", "COLABORADOR"]).optional(),
    email: z.email("Email inválido").trim().toLowerCase().optional(),
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
});

const updateUsuarioSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
    email: z.email("Email inválido").trim().toLowerCase().optional(),
    role: z.enum(["ADMIN", "COLABORADOR"]).optional(),
});

const idSchema = z.object({
    id: z.string("ID inválido"),
});

class UsuarioController {
    constructor(private usuariosService: UsuariosService) { }

    async create(request: Request, response: Response) {
        const { name, email, senha, role } = createUsuarioSchema.parse(request.body);
        const usuario = await this.usuariosService.create({ name, email, senha, role });

        return response.status(201).json({
            message: "Usuario criado com sucesso",
            usuario
        });
    }

    async index(request: Request, response: Response) {
        const { role, email, name } = filterUsuarioSchema.parse(request.query);
        const usuarios = await this.usuariosService.index({ role, email, name });

        return response.status(200).json({
            message: `Foram encontrados ${usuarios.length} usuarios!`,
            usuarios
        });
    }

    async delete(request: Request, response: Response) {
        const { id } = idSchema.parse(request.params);
        const usuario = await this.usuariosService.delete({ id });

        return response.status(200).json({
            message: "Usuario deletado com sucesso",
            usuario
        });
    }

    async update(request: Request, response: Response) {
        const { id } = idSchema.parse(request.params);
        const { name, email, role } = updateUsuarioSchema.parse(request.body);
        const usuario = await this.usuariosService.update({ id, name, email, role });

        return response.status(200).json({
            message: "Usuario atualizado com sucesso",
            usuario
        });
    }
}

export { UsuarioController };