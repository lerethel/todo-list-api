type LocalRequest = (
  url: string,
  options?: RequestInit & { token?: string; data?: Record<string, string> }
) => Promise<Response>;

const requestLocal: LocalRequest = (url, options = {}) => {
  options.headers = new Headers(options.headers);

  if (options.data) {
    options.body = JSON.stringify(options.data);
    options.headers.set("Content-Type", "application/json");
    delete options.data;
  }

  if (options.token) {
    options.headers.set("Authorization", "Bearer " + options.token);
    delete options.token;
  }

  return fetch("http://localhost:3000" + url, options);
};

export const request: Record<string, LocalRequest> = {};

["post", "get", "put", "delete"].forEach((method) => {
  request[method] = (url, options) => requestLocal(url, { ...options, method });
});

export const fakeObjectId = "2d9779cdcf7e4bf217880c9b";

export const authData = { email: "user@example.com", password: "example" };

export const login = async () => {
  const response = await request.post("/users/login", { data: authData });
  return {
    accessToken: (await response.json()).token,
    refreshToken: getJWTFromCookies(response),
  };
};

export const logout = (refreshToken: string) =>
  request.post("/users/logout", { headers: { Cookie: "jwt=" + refreshToken } });

export const getJWTFromCookies = (response: Response) =>
  response.headers.getSetCookie()[0]?.match(/jwt=([^;]+?);/)?.[1] ?? "";
