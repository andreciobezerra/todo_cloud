# Description

Made with NestJS Framework, with these implementation details:

* Using cookie based JWT authentication
* Using guards to attach userId to request object
* Using guards to secure tasks ownership
* Repository pattern to improve flexibility, extensibility and decoupling between layers
* For security a contract of usability of repositories, was created a generic interface
* For errors uniformity and a future error tracing functionality, was added an exceptions filter at global context of application

## Installation and Running

Before installation, make sure that you have and appropriated .env.development file on dev-env folder. For sake of practicality, I will send one attached at e-mail.

### Using Node and Postgres

* Install both lts versions of tools
* Run npm install
* Run npm i -g nest-cli
* Run npm start:dev
* Run npm run migration:run

### Using Docker

* Run docker compose -f dev-env/dev.yml up --build
