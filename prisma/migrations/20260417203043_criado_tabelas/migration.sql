/*
  Warnings:

  - The values [USUARIO] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'COLABORADOR');
ALTER TABLE "public"."usuarios" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "usuarios" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "usuarios" ALTER COLUMN "role" SET DEFAULT 'COLABORADOR';
COMMIT;

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "role" SET DEFAULT 'COLABORADOR';
