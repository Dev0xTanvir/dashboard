import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/${
    import.meta.env.VITE_BASE_API
  }`,
  withCredentials: true,
});

axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.request.use(
  (responce) => {
    return responce;
  },
  async (error) => {
    try {
      const originalrequest = error.config;
      if (error.responce?.status === 401 && !originalrequest._retry) {
        originalrequest._retry = true;
        const res = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newaccesstoken = res.data.accesToken;
        localStorage.setItem("accesToken", newaccesstoken);
      }
    } catch (error) {}
  }
);
export { api };
