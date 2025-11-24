import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decryptData } from "./utils";

export const rootUrl = import.meta.env.VITE_APP_BASE_API_URL;

function getAccessToken() {
  return decryptData("nccToken");
}
axios.interceptors.request.use((request) => {
  request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  return request;
});
export class ApiService {
  static async getData(url: string) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };
    const config = {
      headers,
    };
    const response = await axios.get(`${rootUrl}/${url}`, config);
    return response;
  }

  static async postData(url: string, data: object) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };

    const config = {
      headers,
    };

    const response = await axios.post(`${rootUrl}/${url}`, data, config);
    return response;
  }
  static async patchData(url: string, data: object) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };

    const config = {
      headers,
    };

    const response = await axios.patch(`${rootUrl}/${url}`, data, config);
    return response;
  }

  static async deleteData(url: string, data: object) {
    const headers = {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    };

    const config = {
      headers,
      data,
    };

    return await axios.delete(`${rootUrl}/${url}`, config);
  }
}

const AxiosInterceptorsSetup = (navigate: any) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 404) {
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export default function AxiosInterceptorNavigate() {
  let navigate = useNavigate();
  AxiosInterceptorsSetup(navigate);
  return <></>;
}
