import { HttpMethod } from "./enums";
import { ApiAdapterDto } from "./dto";

export class ApiAdapterService {
  async connection<T>(apiAdapterDto: ApiAdapterDto<T>): Promise<T> {
    const { url, method, action, data, headers, queryParams } = apiAdapterDto;

    const startTime = performance.now();
    let endTime: number | undefined;
    try {
      const fetchOptions: RequestInit = {
        method: method,
      };

      if (method === HttpMethod.POST) {
        fetchOptions.body = JSON.stringify(data);
        fetchOptions.headers = {
          "Content-Type": "application/json",
          ...headers?.toHeaders(),
        };
      } else if (headers) {
        fetchOptions.headers = headers?.toHeaders();
      }

      const queryString = queryParams ? new URLSearchParams(queryParams).toString() : "";
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const response = await fetch(fullUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: T = (await response.json()) as T;
      return responseData;
    } catch (error: unknown) {
      endTime = performance.now();
      const duration = endTime - startTime;
      const durationInSeconds = duration / 1000;

      console.error(
        {
          ejecution: action,
          url: url,
          data: data ? data : null,
          duration: durationInSeconds.toFixed(3),
          error: error,
        },
        `ERROR= ApiConnection ${action}`,
      );

      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      throw new Error(`Error on ${action}: ${errorMessage}`);
    } finally {
      endTime = performance.now();
      const duration = endTime - startTime;
      const durationInSeconds = duration / 1000;
      console.log("EJECUTION_TIME=", action, `${durationInSeconds.toFixed(3)}s`);
    }
  }
}
