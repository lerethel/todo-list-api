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
    name: "New Example User",
  };

  const modifiedUserNameData = { name: "New Example User Mod." };

  const modifiedUserEmailData = {
    // Use the same email to make sure there's no "user already exists" error.
    email: userData.email,
    password: "new_example",
  };

  const modifiedUserPasswordData = {
    password: "new_example",
    "new-password": "new_example_mod",
    "confirmed-new-password": "new_example_mod",
  };

  const originalUserPasswordData = {
    password: "new_example_mod",
    "new-password": "new_example",
    "confirmed-new-password": "new_example",
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
      assert.ok(data.name);
      assert.ok(data.email);
    });
  });

  describe("update", () => {
    it("PUT /me/name: expect 200", async () => {
      const response = await request.put("/users/me/name", {
        data: modifiedUserNameData,
        accessToken,
      });

      assert.strictEqual(response.status, 200);
    });

    it("PUT /me/email: expect 200", async () => {
      const response = await request.put("/users/me/email", {
        data: modifiedUserEmailData,
        accessToken,
      });

      assert.strictEqual(response.status, 200);
    });

    it("PUT /me/password: expect 200", async () => {
      const response = await request.put("/users/me/password", {
        data: modifiedUserPasswordData,
        accessToken,
      });

      assert.strictEqual(response.status, 200);
      // Change the password back since it will be needed.
      await request.put("/users/me/password", {
        data: originalUserPasswordData,
        accessToken,
      });
    });

    it("PUT /me/email: expect 409", async () => {
      const response = await request.put("/users/me/email", {
        data: authData,
        accessToken,
      });

      assert.strictEqual(response.status, 409);
    });

    it("PUT /me/password: expect 400 (wrong current password)", async () => {
      const response = await request.put("/users/me/password", {
        data: { ...modifiedUserPasswordData, password: "wrong_password" },
        accessToken,
      });

      assert.strictEqual(response.status, 400);
    });

    it("PUT /me/password: expect 400 (new password not confirmed)", async () => {
      const response = await request.put("/users/me/password", {
        data: { ...modifiedUserPasswordData, "new-password": "not_confirmed" },
        accessToken,
      });

      assert.strictEqual(response.status, 400);
    });
  });

  describe("invalid token", () => {
    it("GET /me: expect 403", async () => {
      const response = await request.get("/users/me", {
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("PUT /me/name: expect 403", async () => {
      const response = await request.put("/users/me/name", {
        data: modifiedUserNameData,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("PUT /me/email: expect 403", async () => {
      const response = await request.put("/users/me/email", {
        data: modifiedUserEmailData,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("PUT /me/password: expect 403", async () => {
      const response = await request.put("/users/me/password", {
        data: modifiedUserPasswordData,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("POST /me/delete: expect 403", async () => {
      const response = await request.post("/users/me/delete", {
        data: userData,
        refreshToken,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });
  });

  describe("delete", () => {
    it("POST /me/delete: expect 204", async () => {
      const response = await request.post("/users/me/delete", {
        data: userData,
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

    it("PUT /me/name: expect 404", async () => {
      const response = await request.put("/users/me/name", {
        data: modifiedUserNameData,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });

    it("PUT /me/email: expect 404", async () => {
      const response = await request.put("/users/me/email", {
        data: modifiedUserEmailData,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });

    it("PUT /me/password: expect 404", async () => {
      const response = await request.put("/users/me/password", {
        data: modifiedUserPasswordData,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });

    it("POST /me/delete: expect 404", async () => {
      const response = await request.post("/users/me/delete", {
        data: userData,
        refreshToken,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });
  });
});
