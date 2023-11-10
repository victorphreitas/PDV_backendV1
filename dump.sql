create database pdv;


drop table if exists usuarios;
drop table if exists categorias;
drop table if exists produtos;
drop table if exists clientes;

create table usuarios(
  id serial primary key,
  nome text not null,
  email text unique not null,
  senha text not null
);

create table categorias(
  id serial primary key,
  descricao text not null
);

insert into categorias (descricao) 
values('Informática'), ('Celulares'), ('Beleza e Perfumaria'), 
('Mercado'), ('Livros e Papelaria'), ('Brinquedos'), ('Moda'),
('Bebê'), ('Games');


create table produtos(
  id serial primary key,
  descricao text not null,
  quantidade_estoque int not null,
  valor int not null,
  categoria_id int not null references categorias(id));
  
create table clientes(
  id serial primary key,
  nome text not null,
  email text not null unique,
  cpf text not null unique,
  cep text default null,
  rua text default null,
  numero text default null,
  bairro text default null,
  cidade text default null,
  estado text default null);