# Benchmark: Either Pattern vs Exception Throwing (Node.js)

Este repositório contém benchmarks de performance, uso de memória e testes de carga via Locust comparando o tratamento de erros usando o **padrão funcional Either (`Left` / `Right`)** versus o **lançamento de exceções (`throw` / `catch`)**.

---

## 💡 Por que utilizar o padrão `Either` em vez de `throw`?

O lançamento de exceções (`throw`) é uma prática comum em muitas linguagens, porém no desenvolvimento de software moderno — especialmente em arquiteturas baseadas em Node.js / TypeScript — o uso do padrão `Either` traz grandes vantagens técnicas e arquiteturais:

### 1. 🚀 Performance de CPU e Consumo de RAM Superior
- **Sem Stack Trace Unwinding**: Quando uma exceção é lançada (`throw new Error()`), o V8 precisa pausar o fluxo de execução normal para capturar a pilha de chamadas (*stack trace*), instanciar um objeto `Error` complexo e procurar um bloco `catch` correspondente no *call stack*.
- **Empiricamente Provado**: Em nossos testes de 200.000 iterações:
  - **Either (Left)**: ~12.45 ms | ~3.49 bytes/op
  - **Throw Exception**: ~512.99 ms | ~3.69 bytes/op (**~41x mais lento**)
- Sob alta carga em APIs de produção (medido via Locust), endpoints baseados em `Either` entregam **maior throughput (RPS)** e **menor latência mediana/p95**.

### 2. 🛡️ Segurança de Tipos e Assinatura Explicita de Métodos
- Com `throw`, o contrato do método omite quais erros podem ser lançados. O chamador não tem garantias em tempo de compilação de que tratou todas as falhas possíveis.
- Com `Either<Error, Data>`, o erro potencial faz parte da **assinatura da função**. O compilador/desenvolvedor é forçado a tratar tanto o caminho de sucesso (`Right`) quanto o de falha (`Left`), eliminando erros não capturados (*unhandled exceptions* ou *uncaught rejections*).

### 3. 🎯 Princípio da Responsabilidade: "Exceções são para o Inesperado"
- **Falhas de Negócio são Resultados Esperados**: Regras de negócio como `SaldoInsuficiente`, `UsuarioNaoEncontrado` ou `EmailJaCadastrado` **não são anomalias** do sistema — são resultados previstos da aplicação. Tratá-las como exceções quebra a semântica da linguagem.
- **Exceções Legítimas**: Reservadas para falhas infraestruturais críticas ou imprevisíveis (ex: queda da rede, falha de hardware, banco fora do ar, estouro de memória).

### 4. 🧩 Controle de Fluxo Previsível e Funcional
- `throw` funciona como um `goto` não-local: interrompe abruptamente o fluxo e pula diversos quadros de pilha de chamada até encontrar um bloco `catch`.
- O `Either` mantém o fluxo de execução linear, determinístico e sem efeitos colaterais ocultos, facilitando testes unitários e refatorações seguras.

---

## 📊 Resultados do Benchmark

### Benchmark de Memória e CPU (200.000 iterações)

| Fluxo de Teste | Tempo (200k ops) | Heap Utilizado | Alocação por Op |
| :--- | :--- | :--- | :--- |
| **Either Success (Right)** | **12.49 ms** | 3.74 MB | ~2.26 bytes/op |
| **Either Error (Left)** | **12.45 ms** | 3.98 MB | ~3.49 bytes/op |
| **Exception Success (Try sem Throw)** | **2.46 ms** | 3.57 MB | ~1.13 bytes/op |
| **Exception Error (Throw & Catch)** | **512.99 ms** | 4.06 MB | ~3.69 bytes/op |

---

## 💻 Como Rodar o Projeto

### 1. Instalação das Dependências
```bash
yarn
# ou
npm install
```

### 2. Executar os Testes Unitários e de Integração (Jest)
```bash
npm test
```

### 3. Executar o Benchmark de Memória (Node.js expose-gc)
```bash
node --expose-gc benchs/memory.js
```

### 4. Iniciar a API HTTP (Express)
```bash
npm start
# Servidor rodará em http://localhost:3333
```

Endpoints disponíveis:
- `GET /api/either/success` (Retorna HTTP 200 via `Right`)
- `GET /api/either/error` (Retorna HTTP 400 via `Left`)
- `GET /api/exception/success` (Retorna HTTP 200)
- `GET /api/exception/error` (Lança exceção capturada pelo middleware)
- `GET /api/metrics/memory` (Métricas de RAM/Heap do processo)

### 5. Executar o Teste de Carga (Locust)
- **Modo Headless**:
  ```bash
  .venv/bin/locust -f locustfile.py --headless -u 100 -r 20 --run-time 30s --host http://localhost:3333
  ```
- **Modo Web UI**:
  ```bash
  .venv/bin/locust -f locustfile.py --host http://localhost:3333
  # Acesse http://localhost:8089 no seu navegador
  ```