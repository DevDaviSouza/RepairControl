-- CreateEnum
CREATE TYPE "public"."statusOrder_enum" AS ENUM ('RECEBIDO', 'ORCAMENTO', 'APROVADO', 'ANDAMENTO', 'AGUARDANDO_PECA', 'FINALIZADO', 'ENTREGUE');

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "status_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."statusOrder" (
    "status_id" SERIAL NOT NULL,
    "ds_status" "public"."statusOrder_enum" NOT NULL,

    CONSTRAINT "statusOrder_pkey" PRIMARY KEY ("status_id")
);

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."statusOrder"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
