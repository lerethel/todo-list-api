import { after, before, describe, it } from "mocha";
import assert from "node:assert";
import { fakeObjectId, login, logout, request } from "./helpers/common.js";

describe("/todo: authed", () => {
  let accessToken: string;
  let refreshToken: string;
  let todoId: unknown;

  before(async () => ({ accessToken, refreshToken } = await login()));

  it("POST, expect 201 and an id", async () => {
    const response = await request.post("/todo", {
      data: { title: "Test title", description: "Test description" },
      accessToken,
    });

    assert.strictEqual(response.status, 201);
    todoId = (await response.json()).id;
    assert.ok(todoId);
  });

  it("GET, expect 200 and the id created by POST", async () => {
    const response = await request.get("/todo?page=1&limit=1&sort=-createdAt", {
      accessToken,
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual((await response.json()).data[0].id, todoId);
  });

  it("PUT, expect 200 and the same id", async () => {
    const response = await request.put("/todo/" + todoId, {
      data: { title: "Test title mod.", description: "Test description mod." },
      accessToken,
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual((await response.json()).id, todoId);
  });

  it("DELETE, expect 204", async () => {
    const response = await request.delete("/todo/" + todoId, { accessToken });
    assert.strictEqual(response.status, 204);
  });

  after(async () => await logout(refreshToken));
});

describe("/todo/invalid-id: authed", () => {
  let accessToken: string;
  let refreshToken: string;

  before(async () => ({ accessToken, refreshToken } = await login()));

  it("PUT, expect 400", async () => {
    const response = await request.put("/todo/invalid-id", {
      data: { title: "Test title mod.", description: "Test description mod." },
      accessToken,
    });

    assert.strictEqual(response.status, 400);
  });

  it("DELETE, expect 400", async () => {
    const response = await request.delete("/todo/invalid-id", { accessToken });
    assert.strictEqual(response.status, 400);
  });

  after(async () => await logout(refreshToken));
});

describe("/todo/non-existent-id: authed", () => {
  let accessToken: string;
  let refreshToken: string;

  before(async () => ({ accessToken, refreshToken } = await login()));

  it("PUT, expect 404", async () => {
    const response = await request.put("/todo/" + fakeObjectId, {
      data: { title: "Test title mod.", description: "Test description mod." },
      accessToken,
    });

    assert.strictEqual(response.status, 404);
  });

  it("DELETE, expect 404", async () => {
    const response = await request.delete("/todo/" + fakeObjectId, {
      accessToken,
    });
    assert.strictEqual(response.status, 404);
  });

  after(async () => await logout(refreshToken));
});

describe("/todo: unauthed", () => {
  it("POST, expect 401", async () => {
    const response = await request.post("/todo", {
      data: { title: "Test title", description: "Test description" },
    });

    assert.strictEqual(response.status, 401);
  });

  it("GET, expect 401", async () => {
    const response = await request.get("/todo?page=1&limit=1&sort=-createdAt");
    assert.strictEqual(response.status, 401);
  });

  it("PUT, expect 401", async () => {
    const response = await request.put("/todo/" + fakeObjectId, {
      data: { title: "Test title mod.", description: "Test description mod." },
    });

    assert.strictEqual(response.status, 401);
  });

  it("DELETE, expect 401", async () => {
    const response = await request.delete("/todo/" + fakeObjectId);
    assert.strictEqual(response.status, 401);
  });
});

describe("/todo: invalid token", () => {
  const accessToken = "invalid";

  it("POST, expect 403", async () => {
    const response = await request.post("/todo", {
      data: { title: "Test title", description: "Test description" },
      accessToken,
    });

    assert.strictEqual(response.status, 403);
  });

  it("GET, expect 403", async () => {
    const response = await request.get("/todo?page=1&limit=1&sort=-createdAt", {
      accessToken,
    });

    assert.strictEqual(response.status, 403);
  });

  it("PUT, expect 403", async () => {
    const response = await request.put("/todo/" + fakeObjectId, {
      data: { title: "Test title mod.", description: "Test description mod." },
      accessToken,
    });

    assert.strictEqual(response.status, 403);
  });

  it("DELETE, expect 403", async () => {
    const response = await request.delete("/todo/" + fakeObjectId, {
      accessToken,
    });
    assert.strictEqual(response.status, 403);
  });
});
