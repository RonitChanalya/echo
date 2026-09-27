const API_BASE_URL = "http://localhost:5050/api";

let isRefreshing = false;

let refreshPromise: Promise<Response> | null = null;

const performRefresh = async (): Promise<Response> => {
  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  }

  return refreshPromise!;
};

export const api = async (
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> => {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",

    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),

      ...options.headers,
    },
  });

  if (
    response.status === 401 &&
    retry &&
    endpoint !== "/auth/login" &&
    endpoint !== "/auth/register" &&
    endpoint !== "/auth/refresh"
  ) {
    const refreshResponse = await performRefresh();

    if (refreshResponse.ok) {
      return api(endpoint, options, false);
    }
  }

  return response;
};