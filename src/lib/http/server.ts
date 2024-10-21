import express from "express";
import logger from "../../lib/logger";
import { Server as HttpServer } from "node:http";
import { registerControllers } from "../../lib/http/decorators";

export default class BaseServer {
  #app: express.Application;
  #server: HttpServer;
  #logger = logger("Server");

  constructor() {
    this.#app = express();
    this.#middlewares();
  }

  get app() {
    return this.#app;
  }

  registerRoutes(): Promise<void> {
    return registerControllers(this.#app);
  }

  #middlewares(): void {
    this.#app.use(express.json());
  }

  listen(port: number): void {
    this.#server = this.#app.listen(port, () => this.#logger.info(`listen at port ${port}`));
  }

  close() {
    return this.#server.close();
  }
}
