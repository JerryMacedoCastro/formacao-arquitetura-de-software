create schema app;

create table app.account (
    account_id uuid,
    name text,
    email text,
    document text,
    password text,
    primary key (account_id)
);
