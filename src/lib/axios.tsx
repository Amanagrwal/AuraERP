import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const authStr = localStorage.getItem("auth");

    if (authStr) {
      const auth = JSON.parse(authStr);

      if (auth?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired / invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

export default api;



// authAxios.ts
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

