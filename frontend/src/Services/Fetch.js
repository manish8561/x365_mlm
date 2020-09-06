import axios from "axios";
import { toast } from "../components/Toast/Toast";
import { requestEncryption } from "../_utils";
export { _fetch as fetch };

function handleError(error, reject) {
  if (!error) {
    setTimeout(() => {
      toast.error("Something went wrong, Please try again");
    }, 2000);
  }
  if (error) {
    if (error.data === "jwt expired") {
      toast.error("Session expired");
      setTimeout(() => {
        localStorage.clear();
        window.location.reload();
      }, 2000);
    }
  }
  reject(error);
  return;
}

function handleResponse(successs, resolve) {
  resolve(successs);
  return;
}

function setMehod(method, path, body, options, params) {
  let config = {};
  if (options) {
    if (options.jwt) {
      config.headers = {
        "api-access-token": options.jwt,

      };
    }
    // setting user language in the api header.
    if (options.userLang) {
      if (config.headers) {
        config.headers['api-user-lang'] = options.userLang;
      } else {
        config.headers = {
          "api-user-lang": options.userLang,
        };
      }
    }
  }

  params = params ? "?" + new URLSearchParams(params).toString() : "";
  if (method === "get" || method === "delete") {
    return axios[method](`${path}${params}`, config);
  }
  if (method === "post" || method === "put") {
    let data = requestEncryption(body);
    // let data = (body);
    return axios[method](`${path}`, data, config);
  }
}

function _fetch(method, path, body, options, params) {
  return new Promise((resolve, reject) => {
    return setMehod(method, path, body, options, params)
      .then(function (response) {
        handleResponse(response, resolve);
        return;
      })
      .catch(function (error) {
        // return handleError(error);
        handleError(error.response, reject);
        return;
      });
  });
}
