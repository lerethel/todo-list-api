import jwt from "jsonwebtoken";
import { describe, it } from "mocha";
import assert from "node:assert";
import { authData, getJWTFromCookies, request } from "./helpers/common.js";

describe("/users: auth", () => {
  let refreshToken: string;

  afterEach(function () {
    if (this.currentTest?.state !== "passed") {
      console.error("\nAuth tests failed. Stopping all the other tests.");
      process.exit(1);
    }
  });

  it("POST /login: expect 200, a token, and a cookie", async () => {
    const response = await request.post("/users/login", { data: authData });

    assert.strictEqual(response.status, 200);
    assert.ok((await response.json()).token);

    refreshToken = getJWTFromCookies(response);
    assert.ok(refreshToken);
  });

  it("GET /refresh: expect 200, a token, and a different cookie", async () => {
    // If a new refresh token is immediately requested with the same payload,
    // it won't differ from the first one since their expiration times are the same.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await request.get("/users/refresh", { refreshToken });

    assert.strictEqual(response.status, 200);
    assert.ok((await response.json()).token);

    const previousRefreshToken = refreshToken;
    refreshToken = getJWTFromCookies(response);

    assert.notStrictEqual(previousRefreshToken, refreshToken);
  });

  it("POST /logout: expect 204 and no cookie", async () => {
    const response = await request.post("/users/logout", { refreshToken });

    assert.strictEqual(response.status, 204);
    assert.ok(!getJWTFromCookies(response));
  });
});

describe("/users: account management", () => {
  const userData = {
    email: "new.user@example.com",
    password: "new_example",
    user: "New Example User",
  };

  const modifiedUserData = {
    // Use the same email to make sure there's no "user already exists" error.
    email: userData.email,
    password: "new_example_mod",
    user: "New Example User Mod.",
  };

  let accessToken: string;
  let refreshToken: string;
  let user: string;

  describe("create", () => {
    it("POST /register: expect 201, a token, and a cookie", async () => {
      const response = await request.post("/users/register", {
        data: userData,
      });

      assert.strictEqual(response.status, 201);

      accessToken = (await response.json()).token;
      refreshToken = getJWTFromCookies(response);
      user = (jwt.decode(accessToken) as jwt.JwtPayload).user;

      assert.ok(accessToken);
      assert.ok(refreshToken);
      assert.ok(user);
    });

    it("POST /register: expect 409", async () => {
      const response = await request.post("/users/register", {
        data: userData,
      });
      assert.strictEqual(response.status, 409);
    });
  });

  describe("read", () => {
    it("GET /me: expect 200", async () => {
      const response = await request.get("/users/me", { accessToken });
      const data = await response.json();

      assert.strictEqual(response.status, 200);
      assert.ok(data.user);
      assert.ok(data.email);
    });
  });

  describe("update", () => {
    it("PUT /me: expect 200", async () => {
      const response = await request.put("/users/me", {
        data: modifiedUserData,
        accessToken,
      });

      assert.strictEqual(response.status, 200);
    });

    it("PUT /me: expect 409", async () => {
      const response = await request.put("/users/me", {
        data: authData,
        accessToken,
      });

      assert.strictEqual(response.status, 409);
    });
  });

  describe("invalid token", () => {
    it("GET /me: expect 403", async () => {
      const response = await request.get("/users/me", {
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("PUT /me: expect 403", async () => {
      const response = await request.put("/users/me", {
        data: modifiedUserData,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("DELETE /me: expect 403", async () => {
      const response = await request.delete("/users/me", {
        refreshToken,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });
  });

  describe("delete", () => {
    it("DELETE /me: expect 204", async () => {
      const response = await request.delete("/users/me", {
        refreshToken,
        accessToken,
      });

      assert.strictEqual(response.status, 204);
    });
  });

  describe("after deletion", () => {
    it("GET /me: expect 404", async () => {
      const response = await request.get("/users/me", { accessToken });

      assert.strictEqual(response.status, 404);
    });

    it("PUT /me: expect 404", async () => {
      const response = await request.put("/users/me", {
        data: modifiedUserData,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });

    it("DELETE /me: expect 204", async () => {
      const response = await request.delete("/users/me", {
        refreshToken,
        accessToken,
      });

      assert.strictEqual(response.status, 204);
    });
  });
});
