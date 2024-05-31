


BankProject

Descrição
O BankProject é uma aplicação de exemplo que utiliza Node.js, Express, GraphQL e MongoDB Atlas para fornecer uma API GraphQL para gerenciamento de usuários e contas bancárias. Este projeto serve como um exemplo de como configurar um servidor GraphQL com autenticação e conexão a um banco de dados MongoDB hospedado no MongoDB Atlas.

Funcionalidades
Criação de usuários: Permite a criação de novos usuários.
Login de usuários: Autenticação de usuários existentes.
Gerenciamento de contas bancárias: Associar contas bancárias a usuários e gerenciar o saldo das contas.
Tecnologias Utilizadas
Node.js
Express
GraphQL
Mongoose (ODM para MongoDB)
MongoDB Atlas
dotenv (para gerenciamento de variáveis de ambiente)
Pré-requisitos
Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

Node.js (v14 ou superior)
npm (geralmente vem com o Node.js)
Conta no MongoDB Atlas
Como Executar
Clone este repositório para o seu ambiente local.
Instale as dependências usando o comando npm install.
Configure as variáveis de ambiente no arquivo .env com suas credenciais do MongoDB Atlas.
Inicie o servidor usando o comando npm start.
Acesse a API GraphQL em http://localhost:4000/graphql para interagir com os endpoints.
Estrutura do Projeto
src/: Contém os arquivos do código-fonte da aplicação.
index.js: Arquivo principal que inicia o servidor Express e configura o GraphQL.
Models/: Contém os modelos Mongoose para usuários e contas bancárias.
resolvers/: Contém os resolvers GraphQL para diferentes funcionalidades.
typeDefs.js: Arquivo que define os tipos e operações GraphQL.
test/: Pasta que contém os arquivos de teste para os resolvers.
Testes

O projeto inclui testes automatizados para garantir o bom funcionamento das funcionalidades. Para executar os testes, utilize o comando npm test.



