import "reflect-metadata";
import { glob } from "glob";
import { Request, Response, NextFunction } from "express";
import { readFile } from "fs/promises";
import logger from "../../../lib/logger";

const _logger = logger("controller");

const controllers: any[] = [];

export function Controller(prefix: string = ""): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata("prefix", prefix, target);
    controllers.push(target);
  };
}

function createRouteDecorator(method: string) {
  return (path: string): MethodDecorator => {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      Reflect.defineMetadata("route", { method, path }, target, propertyKey);

      const originalMethod = descriptor.value as (req: Request, res: Response, next: NextFunction) => any;

      descriptor.value = function (req: Request, res: Response, next: NextFunction) {
        return originalMethod.apply(this, [req, res, next]);
      };
    };
  };
}

export const Get = (path: string = "") => createRouteDecorator("get")(path);
export const Post = (path: string = "") => createRouteDecorator("post")(path);
export const Put = (path: string = "") => createRouteDecorator("put")(path);
export const Delete = (path: string = "") => createRouteDecorator("delete")(path);
export const Patch = (path: string = "") => createRouteDecorator("patch")(path);
export const Options = (path: string = "") => createRouteDecorator("options")(path);
export const Head = (path: string = "") => createRouteDecorator("head")(path);

export async function loadControllers() {
  const basePath = process.cwd();
  const files = glob.sync(`${basePath}/**/*.ts`, { ignore: "**/node_modules/**" });

  for (const file of files) {
    const content = await readFile(file, "utf-8");

    if (/@Controller/.test(content)) await import(file);
  }
}

export async function registerControllers(app: Express.Application) {
  await loadControllers();

  for (const controller of controllers) {
    const instance = new controller();
    const prefix = Reflect.getMetadata("prefix", controller);
    const prototype = Object.getPrototypeOf(instance);

    for (const methodName of Object.getOwnPropertyNames(prototype)) {
      const route = Reflect.getMetadata("route", prototype, methodName);

      if (route) {
        const { method, path } = route;

        _logger.log(`${controller.name}::${method.toUpperCase()} => ${prefix}${path}`);

        app[method](`${prefix}${path}`, (req: Request, res: Response, next: NextFunction) => {
          instance[methodName](req, res, next);
        });
      }
    }
  }
}
