import { AxiosRequestConfig } from "axios";
import { RefetchOptions } from "axios-hooks";

export interface IConfig {
  DEVICE: "web" | "android";
  API_URL: string;
}

export type ExecuteWithErrorHandling = (
  config?: string | AxiosRequestConfig<any> | undefined,
  options?: RefetchOptions
) => Promise<void>;
