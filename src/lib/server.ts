import BaseServer from "../lib/http/server"
import createLogger from "./logger"

export default class Server {
  #logger = createLogger("SERVER")
  #server: BaseServer

  get app() {
    return this.#server.app
  }

  /**
   *
   * @param {Number} port
   *
   */
  bootstrap = async (port: number = 80, callback: () => any = () => {}): Promise<void> => {
    try {
      this.#server = new BaseServer();
      await this.#server.registerRoutes()
      this.#server.listen(port)
      return callback()
    } catch (error) {
      this.#logger.error(error)
    }
  }

  close = () => {
    this.#server.close()
  }
}
