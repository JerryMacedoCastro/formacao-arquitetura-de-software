drop schema if exists app cascade;

create schema app;

create table app.contract (
    contract_id uuid primary key,
    customer_name text not null,
    property_value numeric not null,
    down_payment numeric not null,
    financed_amount numeric not null,
    interest_rate numeric not null,
    number_of_installments integer not null,
    type text not null,
    created_at timestamptz not null default now()
);

create table app.installment (
    installment_id uuid primary key,
    contract_id uuid not null references app.contract (contract_id),
    installment_number integer not null,
    amount numeric not null,
    interest numeric not null,
    amortization numeric not null,
    balance numeric not null,
    unique (contract_id, installment_number)
);
