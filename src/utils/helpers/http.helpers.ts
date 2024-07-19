import { ArrayElement } from "../types/index.types";
import { HttpServiceResolverError } from "../../http/__index__";

export function SWRFetcher<
  T extends (args: ArrayElement<Parameters<T>>) => Promise<{
    data: Awaited<ReturnType<T>>["data"];
    error: HttpServiceResolverError | null;
  }>
>(httpFunction: T, dto?: ArrayElement<Parameters<T>>) {
  return async () => {
    const { data, error } = await httpFunction(
      dto as ArrayElement<Parameters<T>>
    );

    if (error) {
      throw error;
    }
    return data;
  };
}
