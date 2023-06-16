import { BASE_API_URL } from "@/config/endpoint";
import useUserStore from "@/stores/useUser";
import axios, { AxiosHeaders, AxiosInstance } from "axios";

// const apiCall = {
//   init() {
//     axios.defaults.baseURL = BASE_API_URL;
//     const { token } = useSession();

//     if (token) this.setHeader(token);
//   },
//   setHeader(token: string) {
//     axios.defaults.headers.common.Authorization = `Bearer ${token}`;
//   },
//   post(resource: string, params: string) {
//     return axios.post(resource, params);
//   },
//   get(resource: string) {
//     return axios.get(resource);
//   }
// };

// import { getToken } from "@/utils/jwt-utils";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    Accept: "application/json",
  },
});
// apiClient.defaults.headers["Authorization"] = "test";
/**
 * TODO
 * Will updated if real api already exist with token
 */

const FetchToken = () => {
  const { token } = useUserStore();
  if (!token) return;

  return token;
};

apiClient.interceptors.request.use(
  async (request) => {
    // const token = getToken();

    // if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    // if (token) {
    if (FetchToken()) {
        (request.headers as AxiosHeaders).set("Authorization", `${FetchToken()}`);
        
    }
    (request.headers as AxiosHeaders).set("accept", `application/json`);
    // }
    return request;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

const apiCall = {
  get(resource: string, params?: any) {
    return apiClient.get(resource, params);
  },
  post(resource: string, params: any, config?: any) {
    return apiClient.post(resource, params, config);
  },
  put(resource: string, params: string) {
    return apiClient.put(resource, params);
  },
  patch(resource: string, params: any) {
    return apiClient.patch(resource, params);
  },
  delete(resource: string) {
    return apiClient.delete(resource);
  },
};

export default apiCall;

// export default apiCall;
