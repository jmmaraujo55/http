import _debug from "debug";

const createLogger = (namespace: string) => {
  namespace = namespace.toUpperCase();
  const debug = _debug("HTTP").extend(`DEBUG:${namespace}`);
  const log = _debug("HTTP").extend(`LOG:${namespace}`);
  const info = _debug("HTTP").extend(`INFO:${namespace}`);
  const warn = _debug("HTTP").extend(`WARN:${namespace}`);
  const error = _debug("HTTP").extend(`ERROR:${namespace}`);

  debug.color = <any>4;
  log.color = <any>6;
  info.color = <any>2;
  warn.color = <any>3;
  error.color = <any>1;

  return {
    // @ts-expect-error
    debug: (...message: any) => debug(...message),
    // @ts-expect-error
    log: (...message: any) => log(...message),
    // @ts-expect-error
    info: (...message: any) => info(...message),
    // @ts-expect-error
    warn: (...message: any) => warn(...message),
    // @ts-expect-error
    error: (...message: any) => error(...message),
  };
};

export default createLogger;
