-- CreateTable
CREATE TABLE "public"."priority" (
    "priority_id" SERIAL NOT NULL,
    "ds_priority" TEXT,

    CONSTRAINT "priority_pkey" PRIMARY KEY ("priority_id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "customers_id" SERIAL NOT NULL,
    "nm_customer" TEXT,
    "ds_phone" VARCHAR(19),
    "ds_mail" TEXT,
    "nm_cpf" VARCHAR(14),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customers_id")
);

-- CreateTable
CREATE TABLE "public"."enterprises" (
    "enterprise_id" SERIAL NOT NULL,
    "nm_enterprise" VARCHAR(200),
    "ep_fantasy" VARCHAR(200),
    "ep_cnpj" VARCHAR(19),

    CONSTRAINT "enterprises_pkey" PRIMARY KEY ("enterprise_id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "user_id" SERIAL NOT NULL,
    "nm_user" TEXT,
    "ds_email" TEXT,
    "ds_senha" TEXT,
    "enterprise_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "order_id" SERIAL NOT NULL,
    "customer_id" INTEGER,
    "ds_model" TEXT,
    "ds_color" TEXT,
    "dt_year" INTEGER,
    "ds_plate" VARCHAR(7),
    "qtd_repair" INTEGER,
    "qtd_painting" INTEGER,
    "dt_order" TIMESTAMP(6),
    "dt_completion" TIMESTAMP(6),
    "dt_delivered" TIMESTAMP(6),
    "bt_delivered" BOOLEAN,
    "ds_services" TEXT,
    "priority_id" INTEGER,
    "vl_total" DECIMAL,
    "enterprise_id" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "payment_id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "vl_total" DECIMAL,
    "vl_payment" DECIMAL,
    "vl_reamining" DECIMAL,
    "ds_payment" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "public"."enterprises"("enterprise_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("customers_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "public"."enterprises"("enterprise_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "public"."priority"("priority_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
