import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";
import { ApiAdapterService } from "./";
import { HttpMethod } from "./enums";

void (async () => {
  await describe("ApiAdapterService", () => {
    let service: ApiAdapterService;

    beforeEach(() => {
      service = new ApiAdapterService();
    });

    void it("should handle a successful GET request", async () => {
      const mockData = {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
      };

      mock.method(global, "fetch", (url: string | URL | Request, init?: RequestInit) => {
        assert.strictEqual(url, "https://localhost");
        assert.strictEqual(init?.method, "GET");

        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        } as Response;
      });

      const httpRequestArgs = {
        url: "https://localhost",
        method: HttpMethod.GET,
        action: "Test API",
      };

      const data = await service.connection(httpRequestArgs);
      assert.deepStrictEqual(data, mockData);
    });

    void it("should handle a successful POST request", async () => {
      const expectedData = {
        title: "foo",
        body: "bar",
        userId: 1,
        id: 101,
      };
      const postData = {
        title: "foo",
        body: "bar",
        userId: 1,
      };
      mock.method(global, "fetch", (url: string | URL | Request, init?: RequestInit) => {
        assert.strictEqual(url, "https://localhost");
        assert.strictEqual(init?.method, "POST");
        const expectedBody = JSON.stringify(postData);
        assert.strictEqual(init?.body, expectedBody);

        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve(expectedData),
        } as Response;
      });

      const httpRequestArgs = {
        url: "https://localhost",
        method: HttpMethod.POST,
        action: "Test PEM API",
        data: postData,
        headers: {
          toHeaders: () => ({ Authorization: "Bearer token" }),
        },
      };

      const resultData = await service.connection(httpRequestArgs);

      assert.deepStrictEqual(resultData, expectedData);
    });

    void it("should handle a failed request", async () => {
      mock.method(
        global,
        "fetch",
        () =>
          ({
            ok: false,
            status: 400,
            statusText: "Bad Request",
          }) as Response,
      );

      const httpRequestArgs = {
        url: "https://localhost/failed",
        method: HttpMethod.GET,
        action: "Test Failed Request",
      };

      try {
        await service.connection(httpRequestArgs);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.strictEqual((error as Error).message, "Error on Test Failed Request: HTTP error! status: 400");
      }
    });

    void it("should include headers in a GET request if provided", async () => {
      const mockData = { message: "Success" };

      mock.method(global, "fetch", (_url: string | URL | Request, init?: RequestInit) => {
        assert.deepStrictEqual(init?.headers, { Authorization: "Bearer test-token", "Custom-Header": "value" });
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        } as Response;
      });

      const httpRequestArgs = {
        url: "https://localhost/headers",
        method: HttpMethod.GET,
        action: "Test Headers",
        headers: {
          toHeaders: () => ({ Authorization: "Bearer test-token", "Custom-Header": "value" }),
        },
      };

      await service.connection(httpRequestArgs);
    });

    void it("should include query parameters in the URL if provided", async () => {
      mock.method(global, "fetch", (url: string | URL | Request) => {
        assert.strictEqual(url, "https://localhost/query?param1=value1&param2=value2");
        return {
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response;
      });

      const httpRequestArgs = {
        url: "https://localhost/query",
        method: HttpMethod.GET,
        action: "Test Query Params",
        queryParams: {
          param1: "value1",
          param2: "value2",
        },
      };

      await service.connection(httpRequestArgs);
    });

    void it("should handle missing optional fields", async () => {
      const mockData = { message: "Success" };

      mock.method(
        global,
        "fetch",
        () =>
          ({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockData),
          }) as Response,
      );

      const httpRequestArgs = {
        url: "https://localhost/optional",
        method: HttpMethod.GET,
        action: "Test Optional Fields",
      };

      const data = await service.connection(httpRequestArgs);
      assert.deepStrictEqual(data, mockData);
    });
  });
})();
