import { Millisecond } from "italia-ts-commons/lib/units";

export interface IConfig {
  AFM_MARKETPLACE_HOST: string;
  AFM_MARKETPLACE_BASEPATH: string;
}

export function getConfig(param: keyof IConfig): string | Millisecond {
  /*eslint-disable */
  if (!("_env_" in window)) {
    throw new Error("Missing configuration");
  }
  // eslint-disable-next-line: no-any
  if (!(window as any)._env_[param]) {
    throw new Error("Missing required environment variable: " + param);
  }
  // eslint-disable-next-line: no-any
  return (window as any)._env_[param];
}
