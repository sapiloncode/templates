-- CREATE SCHEMA public AUTHORIZATION pg_database_owner;
CREATE TYPE public."Gender" AS ENUM ('Male', 'Female', 'Other');

CREATE SEQUENCE public.accounts__id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE public.accounts_seq INCREMENT BY 1 MINVALUE 20 MAXVALUE 9223372036854775807 START 20 CACHE 1 NO CYCLE;

CREATE TABLE public.accounts (
    id int4 DEFAULT nextval('accounts_seq' :: regclass) NOT NULL,
    created timestamp(0) NULL,
    email text NULL,
    photo text NULL,
    title text NULL,
    "firstName" text NULL,
    "lastName" text NULL,
    "birthDate" date NULL,
    mobile text NULL,
    company text NULL,
    "gender" public."Gender" NULL,
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
);