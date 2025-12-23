import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { accessToken } = JSON.parse(auth);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 → logout
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Token expired or invalid → clear auth
      localStorage.removeItem("auth");

      // Optional: prevent infinite redirect
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
