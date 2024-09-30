import { describe, it } from "mocha";
import assert from "node:assert";
import { authData, getJWTFromCookies, request } from "./helpers/common.js";

describe("user auth", () => {
  let refreshToken: string;

  afterEach(function () {
    if (this.currentTest?.state !== "passed") {
      console.error("\nAuth tests failed. Stopping all the other tests.");
      process.exit(1);
    }
  });

  it("POST /login: expect 200, a token, and a cookie", async () => {
    const response = await request.post("/login", { data: authData });

    assert.strictEqual(response.status, 200);
    assert.ok((await response.json()).token);

    refreshToken = getJWTFromCookies(response);
    assert.ok(refreshToken);
  });

  it("GET /refresh: expect 200, a token, and a different cookie", async () => {
    // If a new refresh token is immediately requested with the same payload,
    // it won't differ from the first one since their expiration times are the same.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await request.get("/refresh", {
      headers: refreshToken ? { Cookie: "jwt=" + refreshToken } : {},
    });

    assert.strictEqual(response.status, 200);
    assert.ok((await response.json()).token);

    const previousRefreshToken = refreshToken;
    refreshToken = getJWTFromCookies(response);

    assert.notStrictEqual(previousRefreshToken, refreshToken);
  });

  it("GET /logout: expect 204 and no cookie", async () => {
    const response = await request.get("/logout", {
      headers: refreshToken ? { Cookie: "jwt=" + refreshToken } : {},
    });

    assert.strictEqual(response.status, 204);
    assert.ok(!getJWTFromCookies(response));
  });
});

describe("user registration", () => {
  it("POST /register: expect 409 (the user exists)", async () => {
    const response = await request.post("/register", {
      data: { ...authData, user: "Example User" },
    });

    assert.strictEqual(response.status, 409);
  });
});
