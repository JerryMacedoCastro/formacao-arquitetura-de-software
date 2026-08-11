drop schema if exists app;

create schema app;

create table app.balance (
    account_id uuid,
    asset_id text,
    quantity numeric,
    primary key (account_id, asset_id)
);

create table app.deposit (
    deposit_id uuid,
    account_id uuid,
    asset_id text,
    quantity numeric,
    status text,
    credit_card_holder text,
    credit_card_number text,
    credit_card_exp_date text,
    credit_card_cvv text,
    created_at timestamptz,
    paid_at timestamptz,
    canceled_at timestamptz,
    primary key (deposit_id)
);

create table app.order (
    order_id uuid,
    account_id uuid,
    market_id text,
    side text,
    quantity numeric,
    price numeric,
    fill_quantity numeric,
    fill_price numeric,
    status text,
    timestamp timestamptz,
    primary key (order_id)
);

create table app.trade (
    trade_id uuid,
    market_id text,
    buy_order_id uuid,
    sell_order_id uuid,
    side text,
    quantity numeric,
    price numeric,
    timestamp timestamptz,
    primary key (trade_id)
);
