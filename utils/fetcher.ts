import { useEffect } from "react";
import { AxiosError } from "axios";
import useAxios from "axios-hooks";
import getConfig from "next/config";
import { ExecuteWithErrorHandling, IConfig } from "@types";

export function fetcher<DataType>(config: {
  method: string;
  url: string;
  data?: DataType;
}): [
  {
    data: any;
    loading: boolean;
    error: AxiosError<any, DataType> | null;
  },
  ExecuteWithErrorHandling
] {
  const { API_URL } = getConfig().publicRuntimeConfig as IConfig;

  const [{ data, loading, error }, execute] = useAxios(
    {
      method: config.method,
      url: API_URL + config.url,
      data: config.data,
    },
    { manual: true }
  );

  const executeWithErrorHandling: ExecuteWithErrorHandling = async (
    config?,
    options?
  ) => {
    try {
      await execute(config, options);
    } catch {}
  };

  useEffect(() => {
    if (!error || error.code === "ERR_NETWORK") return;

    throw error;
  }, [error]);

  return [{ data, loading, error }, executeWithErrorHandling];
}
