/*
  Warnings:

  - Added the required column `ds_priority` to the `priority` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."priority_enum" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- AlterTable
ALTER TABLE "public"."priority" DROP COLUMN "ds_priority",
ADD COLUMN     "ds_priority" "public"."priority_enum" NOT NULL;
