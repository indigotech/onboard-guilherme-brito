# Onboard - Guilherme Brito
## Descrição
Este é o projeto feito por `Guilherme Brito` durante o período de onboard na Taqtile. Trata-se do desenvolvimento de uma aplicação Back-end simples, a fim de trabalhar conceitos importantes para a integração em projetos da empresa de maneira prática.

## Ferramentas e ambiente
O projeto se trata de uma aplicação GraphQL feita em `Node` com `Typescript`, cujo gerenciador de pacotes utilizado para o desenvolvimento foi o `npm`.
Além disso, faz-se uso da biblioteca `Apollo Server` para o servidor e do `Prisma` como ORM para interação do servidor com a base de dados.
Por sua vez, a base de dados, localmente, foi criada com o uso de `Docker`, a fim de agilizar o desenvolvimento, sendo o `PostgreSQL` a base de dados escolhida.
O projeto conta, ainda, com `Lint` e `Prettier` configurados, a fim de padronizar o desenvolvimento feito.
A seguir, seguem alguns detalhes das versões usadas de cada ferramenta:
- `Node`: 18.17.1
- `npm`: 9.6.7
- Biblioteca `graphql`: 16.9.0
- `Apollo Server`: 4.11.0
- `Prisma`: 5.19.1
- Imagem do `PostgreSQL`: 16.4
## Guia para execução e debug
Para instalar as dependências do projeto, basta executar o comando `npm install` na raíz do projeto.

Feito isso, deve-se criar a base de dados local com as suas respectivas tabelas, para isso, é preciso ter o `Docker` instalado em sua máquina.
Para criar a base de dados, basta executar o comando `docker compose up -d` na raíz do projeto. Caso queira encerrar os _containers_, é preciso rodar `docker compose stop`.
As credencias de acesso ao banco podem ser encontradas no arquivo `docker-compose.yml`, especificamente no campo `environment`, as quais serão úteis para a criação das tabelas e que podem ser usadas, também, para gerenciamento dos dados com outra ferramenta, como o `DBeaver`.

Para que a aplicação estabeleca uma conexão com a base de dados, é preciso criar um arquivo `.env` na raíz do projeto com o parâmetro `DATABASE_URL`. Para isso, é preciso adicionar a seguinte linha nesse arquivo:

``` DATABASE_URL=postgresql://{usuario}:{senha}@{host}:{porta}/{base_dados} ```
- usuario: Nome do usuário para conectar na base de dados desejada - pode ser encontrado no arquivo `docker-compose.yml` -> `environment` -> `POSTGRES_USER`
- senha: Senha do usuário usado para se conectar na base de dados desejada - pode ser encontrada no arquivo `docker-compose.yml` -> `environment` -> `POSTGRES_PASSWORD`
- host: Host em que a base de dados pode ser acessado - como no desenvolvimento local são rodados containers na própria máquina, esse campo é `localhost`
- porta: Porta do host na qual se acessa a base de dados - pode ser encontrada no arquivo `docker-compose.yml` -> `ports` -> Primeiro número deste campo
- base_dados: Nome da base de dados que a aplicação se conectará - pode ser encontrada no arquivo `docker-compose.yml` -> `environment` -> `POSTGRES_DB`

Feito isso, caso seu banco de dados local não tenha nenhuma tabela criada, pode-se criá-las com o comando `prisma migrate dev --name init` na raíz do projeto.

Para rodar o servidor, pode-se executar o comando `npm start`, o qual inicia o servidor no `localhost:4000`. Para o desenvolvimento, é recomendado rodar o comando `npm run dev`, o qual inicializa o servidor no mesmo local, mas com _live reload_.