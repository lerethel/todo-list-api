import jwt, { JwtPayload } from "jsonwebtoken";
import { describe, it } from "mocha";
import assert from "node:assert";
import { authData, getJWTFromCookies, request } from "./helpers/common.js";

describe("/auth", () => {
  let refreshToken: string;

  afterEach(function () {
    if (this.currentTest?.state !== "passed") {
      console.error("\nAuth tests failed. Stopping all the other tests.");
      process.exit(1);
    }
  });

  it("POST /login: expect 200, a token, and a cookie", async () => {
    const response = await request.post("/auth/login", { data: authData });

    assert.strictEqual(response.status, 200);
    assert.ok((await response.json()).token);

    refreshToken = getJWTFromCookies(response);
    assert.ok(refreshToken);
  });

  it("GET /refresh: expect 200, a token, and a different cookie", async () => {
    // If a new refresh token is immediately requested with the same payload,
    // it won't differ from the first one since their expiration times are the same.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await request.get("/auth/refresh", { refreshToken });

    assert.strictEqual(response.status, 200);
    assert.ok((await response.json()).token);

    const previousRefreshToken = refreshToken;
    refreshToken = getJWTFromCookies(response);

    assert.notStrictEqual(previousRefreshToken, refreshToken);
  });

  it("POST /logout: expect 204 and no cookie", async () => {
    const response = await request.post("/auth/logout", { refreshToken });

    assert.strictEqual(response.status, 204);
    assert.ok(!getJWTFromCookies(response));
  });
});

describe("/user: account management", () => {
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
  let user: unknown;

  describe("create", () => {
    it("POST /: expect 201", async () => {
      const response = await request.post("/user", { data: userData });
      assert.strictEqual(response.status, 201);
    });

    it("POST /: expect 409", async () => {
      const response = await request.post("/user", { data: userData });
      assert.strictEqual(response.status, 409);
    });
  });

  describe("new user login", () => {
    it("POST /auth/login: expect 200, a token, and a cookie", async () => {
      const response = await request.post("/auth/login", { data: userData });

      assert.strictEqual(response.status, 200);

      accessToken = (await response.json()).token;
      refreshToken = getJWTFromCookies(response);
      user = (jwt.decode(accessToken) as JwtPayload).user;

      assert.ok(accessToken);
      assert.ok(refreshToken);
      assert.ok(user);
    });
  });

  describe("read", () => {
    it("GET /: expect 200", async () => {
      const response = await request.get("/user", { accessToken });
      const data = await response.json();

      assert.strictEqual(response.status, 200);
      assert.ok(data.name);
      assert.ok(data.email);
    });
  });

  describe("update", () => {
    it("PUT /name: expect 200", async () => {
      const response = await request.put("/user/name", {
        data: modifiedUserNameData,
        accessToken,
      });

      assert.strictEqual(response.status, 200);
    });

    it("PUT /email: expect 200", async () => {
      const response = await request.put("/user/email", {
        data: modifiedUserEmailData,
        accessToken,
      });

      assert.strictEqual(response.status, 200);
    });

    it("PUT /password: expect 200", async () => {
      const response = await request.put("/user/password", {
        data: modifiedUserPasswordData,
        accessToken,
      });

      assert.strictEqual(response.status, 200);
      // Change the password back since it will be needed.
      await request.put("/user/password", {
        data: originalUserPasswordData,
        accessToken,
      });
    });

    it("PUT /email: expect 409", async () => {
      const response = await request.put("/user/email", {
        data: authData,
        accessToken,
      });

      assert.strictEqual(response.status, 409);
    });

    it("PUT /password: expect 400 (wrong current password)", async () => {
      const response = await request.put("/user/password", {
        data: { ...modifiedUserPasswordData, password: "wrong_password" },
        accessToken,
      });

      assert.strictEqual(response.status, 400);
    });

    it("PUT /password: expect 400 (new password not confirmed)", async () => {
      const response = await request.put("/user/password", {
        data: { ...modifiedUserPasswordData, "new-password": "not_confirmed" },
        accessToken,
      });

      assert.strictEqual(response.status, 400);
    });
  });

  describe("invalid token", () => {
    it("GET /: expect 403", async () => {
      const response = await request.get("/user", {
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("PUT /name: expect 403", async () => {
      const response = await request.put("/user/name", {
        data: modifiedUserNameData,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("PUT /email: expect 403", async () => {
      const response = await request.put("/user/email", {
        data: modifiedUserEmailData,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("PUT /password: expect 403", async () => {
      const response = await request.put("/user/password", {
        data: modifiedUserPasswordData,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });

    it("DELETE /: expect 403", async () => {
      const response = await request.delete("/user", {
        data: userData,
        refreshToken,
        accessToken: refreshToken,
      });

      assert.strictEqual(response.status, 403);
    });
  });

  describe("delete", () => {
    it("DELETE /: expect 204", async () => {
      const response = await request.delete("/user", {
        data: userData,
        refreshToken,
        accessToken,
      });

      assert.strictEqual(response.status, 204);
    });
  });

  describe("after deletion", () => {
    it("GET /: expect 404", async () => {
      const response = await request.get("/user", { accessToken });

      assert.strictEqual(response.status, 404);
    });

    it("PUT /name: expect 404", async () => {
      const response = await request.put("/user/name", {
        data: modifiedUserNameData,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });

    it("PUT /email: expect 404", async () => {
      const response = await request.put("/user/email", {
        data: modifiedUserEmailData,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });

    it("PUT /password: expect 404", async () => {
      const response = await request.put("/user/password", {
        data: modifiedUserPasswordData,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });

    it("DELETE /: expect 404", async () => {
      const response = await request.delete("/user", {
        data: userData,
        refreshToken,
        accessToken,
      });

      assert.strictEqual(response.status, 404);
    });
  });
});
