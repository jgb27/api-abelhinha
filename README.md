# API de Gerenciamento da Abelhinha Pedagógica

Esta API é responsável por gerenciar as conexões do [Abelhinha Pedagógica](https://abelhinhapedagogica.vercel.app/). Ela foi desenvolvida usando Express para o servidor, MongoDB como banco de dados e AWS para o armazenamento de imagens.

## Configuração

Para usar esta API, você precisará configurar as seguintes variáveis de ambiente em um arquivo `.env`:

- `MONGO_URL`: URL de conexão com o banco de dados MongoDB.
- `MY_AWS_ACCESS_KEY`: Chave de acesso da AWS.
- `MY_AWS_SECRET_ACCESS_KEY`: Chave secreta de acesso da AWS.
- `MY_AWS_DEFAULT_REGION`: Região padrão da AWS.

## Rotas

### Autenticação

- `POST /login`: Faz login de um usuário.
- `POST /register`: Cria um novo usuário.
- `POST /verify`: Verifica a validade de um token de autenticação.

### Produtos

- `GET /product`: Obtém todos os produtos.
- `GET /product/name/:name`: Encontra produtos por nome.
- `GET /product/tag/:tag`: Encontra produtos por tag.
- `POST /product`: Adiciona um novo produto.
- `DELETE /product/:id`: Exclui um produto por ID.

## Controllers

Os controladores (controllers) da API estão localizados em seus respectivos arquivos:

- `ProductController.js`: Lida com operações relacionadas a produtos.
- `AuthController.js`: Lida com autenticação e geração de tokens.
- `UserController.js`: Lida com operações relacionadas a usuários.

## Uso

Certifique-se de configurar as variáveis de ambiente e execute a API usando Node.js ou outro ambiente de execução JavaScript compatível.

```bash
# Instale as dependências
npm install
or
yarn

# Inicie o servidor
npm start
or
yarn start
```
## Contribuindo

Se desejar contribuir para este projeto, siga estas etapas:

1. Crie um fork do repositório.
2. Clone o fork para o seu ambiente local.
3. Crie uma branch para a sua contribuição:

```bash
git checkout -b minha-contribuicao
```
4. Faça as alterações desejadas.
5. Commit e envie as alterações:
```bash
git commit -m "Adicionar funcionalidade XYZ"
```
6. Faça um push para o seu fork:
```bash
git push origin minha-contribuicao
```
7. Abra uma solicitação de pull (pull request) no repositório original.

## Autor

- Autor: João Gustavo S. Bispo

## Licença

Este projeto está licenciado sob a [Licença GPL 3.0](LICENSE).
