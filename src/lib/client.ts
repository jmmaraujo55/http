import logger from "./logger";

type TFetch = (endpoint: string, options?: RequestInit) => Promise<Response>;

export default class Fetch {
  static #logger = logger("Fetch");

  static create(baseURL: string, defaultOptions: RequestInit = {}): TFetch {
    return async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
      const url = `${baseURL}${endpoint}`;
      const mergedOptions: RequestInit = {
        ...defaultOptions,
        ...options,
      };

      try {
        return fetch(url, mergedOptions);
      } catch (error) {
        this.#logger.error("Fetch error:", error);
        throw error;
      }
    };
  }
}
