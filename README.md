## Artisans Main Service

#### Patterns (Naive knowledge to get hands dirty):

- Shared Database
- RabbitMQ for event driven messaging
- Zipkin or Jeager for tracing
- Api gateway for external api consumption
- Poly repo for code management

#### [ERD](https://dbdiagram.io/d/631f94530911f91ba59207e2)

### Future Features

1. Admin microservice using RPC for communication
2. Project id serverless file uploads (later stuff)

#### [DB SCHEMA DOCS](https://dbdocs.io/oolat31/Artisans)

#### [Postman Docs](https://documenter.getpostman.com/view/16498899/2s83zcTmmm#f6e3ed65-5139-4b5e-8907-da7ab745d622)

#### Questions ?

- How would transactions work when using a shared database and a lock as been applied on the current accessed row by a separate service?
