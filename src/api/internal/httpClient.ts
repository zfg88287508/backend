import axios, { Axios, AxiosResponse } from "axios";
import { message } from "antd";
import { getToken, clearToken } from "../../utils/index";

export class HttpClient {
  axios: Axios;

  constructor(url: string) {
    this.axios = axios.create({
      baseURL: url,
      timeout: 15000,
      withCredentials: false,
    });

    //拦截器注册
    this.axios.interceptors.request.use(
      (config) => {
        const token = getToken();
        token && (config.headers.Authorization = "Bearer " + token);
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        let status = response.data.status; //HTTP状态码
        let code = response.data.code; //业务返回代码
        let msg = response.data.msg; //错误消息

        if (code === 0) {
          return Promise.resolve(response);
        } else {
          message.error(msg);
          return Promise.reject(response);
        }
      },
      // 当http的状态码非0
      (error) => {
        let status = error.response.status;
        if (status === 401) {
          clearToken();
          // 跳转到登录界面
        } else if (status === 404) {
          // 跳转到404页面
        } else if (status === 403) {
          // 跳转到无权限页面
        } else if (status === 500) {
          // 跳转到500异常页面
        }
        return Promise.reject(error.response);
      }
    );
  }

  get(url: string, params: object) {
    return new Promise((resolve, reject) => {
      this.axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }

  destroy(url: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .delete(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }

  post(url: string, params: object) {
    return new Promise((resolve, reject) => {
      this.axios
        .post(url, params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }

  put(url: string, params: object) {
    return new Promise((resolve, reject) => {
      this.axios
        .put(url, params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }
}

const APP_URL = process.env.REACT_APP_URL || "";

const client = new HttpClient(APP_URL);

export default client;