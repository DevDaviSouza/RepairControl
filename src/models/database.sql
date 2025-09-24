create table priority(
    priority_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ds_priority       text
);

create table Customers(
    customers_id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nm_customer       text,
    ds_phone          varchar(19),
    ds_mail         text,
    nm_cpf          varchar(14)
);

CREATE TABLE Enterprises(
    enterprise_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nm_enterprise       varchar(200),
    ep_fantasy          varchar(200),
    ep_cnpj             varchar(19)
);

CREATE TABLE Users(
    user_id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nm_user             text,
    ds_email            text,
    ds_senha            text,
    enterprise_id       INT,
    FOREIGN KEY (enterprise_id) REFERENCES Enterprises(enterprise_id)
);

CREATE TABLE Orders(
    order_id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id     INT,
    ds_model        text,
    ds_color        text,
    dt_year         INT,
    DS_PLATE        varchar(7),
    qtd_repair      INT,
    qtd_painting    INT,
    dt_order        TIMESTAMP,
    dt_completion   TIMESTAMP,
    dt_delivered    TIMESTAMP,
    bt_delivered    bool,
    ds_services     text,
    priority_id     INT,
    vl_total        DECIMAL,
    enterprise_id   INT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customers_id),
    FOREIGN KEY (priority_id) REFERENCES priority(priority_id),
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id)
);

CREATE TABLE Payments(
    payment_id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id        INT,
    vl_total        DECIMAL,
    vl_payment      DECIMAL,
    vl_reamining    DECIMAL,
    ds_payment      TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);