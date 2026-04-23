import { Categoria, Status } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { DiskStorage } from "@/utils/disk-storage";

interface CreateReembolsoRequest {
    titulo: string;
    descricao: string;
    valor: number;
    categoria: Categoria;
    nomearquivo: string;
    userId: string;
}

interface IndexReembolsoRequest {
    name?: string;
    userId?: string;
    categoria?: Categoria;
    status?: Status;
    skip: number;
    take: number;
    page: number;
}

interface FindByIdRequest {
    id: string;
}

interface UpdateComprovanteRequest {
    id: string;
    nomearquivo: string;
}

class ReembolsoService {
    async create({ titulo, descricao, valor, categoria, nomearquivo, userId }: CreateReembolsoRequest) {

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
        });

        if (!usuario) {
            throw new AppError("Usuario não encontrado", 404);
        }

        const reembolso = await prisma.reembolso.create({
            data: {
                titulo,
                descricao,
                valor,
                categoria,
                nomearquivo,
                userId: usuario.id
            },
        });

        return reembolso;
    }

    /**
     * Lista reembolsos com suporte a filtros e paginação.
     * 
     * @param skip - Quantidade de registros a serem "pulados" (Offset). 
     *               Calculado no controller como: (page - 1) * take.
     * @param take - Quantidade de registros a serem retornados por página (Limit).
     * @param page - O número da página atual (usado para retorno de metadados).
     */
    async index({ name, userId, categoria, status, skip, take, page }: IndexReembolsoRequest) {
        // Objeto de filtros reutilizável para a listagem e para a contagem total
        const where = {
            user: {
                name: {
                    contains: name,
                },
            },
            ...userId && { userId },
            ...categoria && { categoria },
            ...status && { status },
        };

        // Busca os registros paginados no banco de dados
        const reembolsos = await prisma.reembolso.findMany({
            skip, // Pula os registros das páginas anteriores
            take, // Pega apenas a quantidade definida para a página atual
            where,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Conta o total de registros que atendem aos filtros (sem paginação)
        // Isso é essencial para saber o total de páginas disponíveis.
        const totalItems = await prisma.reembolso.count({ where });

        // Calcula o total de páginas: Divide o total de itens pela quantidade por página e arredonda para cima.
        const totalPages = Math.ceil(totalItems / take);

        const pagination = {
            page,           // Página atual
            perPage: take,  // Itens por página
            totalPages,     // Total de páginas no total
            totalItems,     // Total de registros encontrados no banco
        }

        return { reembolsos, pagination };
    }

    async show({ id }: FindByIdRequest) {

        const reembolso = await prisma.reembolso.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!reembolso) {
            throw new AppError("Reembolso não encontrado", 404);
        }

        return { message: "Reembolso encontrado com sucesso", reembolso };
    }

    async delete({ id }: FindByIdRequest) {
        const reembolsoExistente = await prisma.reembolso.findUnique({
            where: { id },
        });

        if (!reembolsoExistente) {
            throw new AppError("Reembolso não encontrado", 404);
        }


        await prisma.reembolso.delete({
            where: { id },
        });

        if (reembolsoExistente.nomearquivo) {
            await new DiskStorage().deleteFileInUpload(reembolsoExistente.nomearquivo)
        }

        return { message: "Reembolso deletado com sucesso" };
    }

    async updateComprovante({ id, nomearquivo }: UpdateComprovanteRequest) {

        const reembolsoExistente = await prisma.reembolso.findUnique({
            where: { id },
        });

        if (!reembolsoExistente) {
            throw new AppError("Reembolso não encontrado", 404);
        }

        if (reembolsoExistente.nomearquivo) {
            await new DiskStorage().deleteFileInUpload(reembolsoExistente.nomearquivo)
        }

        const reembolso = await prisma.reembolso.update({
            where: { id },
            data: {
                nomearquivo,
            },
        });

        if (!reembolso) {
            throw new AppError("Reembolso não encontrado", 404);
        }

        return reembolso;
    }

}

export { ReembolsoService };