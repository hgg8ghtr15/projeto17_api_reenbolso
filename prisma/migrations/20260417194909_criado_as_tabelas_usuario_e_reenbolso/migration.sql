-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USUARIO');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('ALIMENTACAO', 'TRANSPORTE', 'HOSPEDAGEM', 'SERVICOS', 'OUTROS');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SOLICITADO', 'APROVADO', 'REPROVADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USUARIO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reembolsos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "categoria" "Categoria" NOT NULL DEFAULT 'OUTROS',
    "nomearquivo" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'SOLICITADO',
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reembolsos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "reembolsos" ADD CONSTRAINT "reembolsos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
