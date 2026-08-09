drop schema if exists app;

create schema app;

create table app.depth (
    market_id text,
    side text,
    price numeric,
    quantity numeric,
    primary key (market_id, side, price)
);
