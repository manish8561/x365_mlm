
import * as CryptoJS from "crypto-js";
import { DATA_ENCRYPT_KEY } from "../_constants/index";

export const setCookie = (name, value, minutes) => {
  let expires = "";
  if (minutes) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

export const getCookie = c_name => {
  let i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
};

export const deleteCookie = (c_name, value, exdays) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() - exdays);
  var c_value =
    escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
};

// function removeZeroes(value) {
//   let str = value.toString();
//   let decimalVal = str.substr(str.lastIndexOf(".") + 1);
//   let value = str.substr(0, str.indexOf("."));
//   decimalVal.replace(/0/g, "");
//   decimalVal = decimalVal.replace(/0/g, "");
//   let orignalVal = value + "." + decimalVal;
//   return orignalVal;
// }

export const requestEncryption = data => {
  let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), DATA_ENCRYPT_KEY);
  return { data: ciphertext.toString() };
};

export function currencySymbol(currency) {
  switch (currency) {
    case "USD":
    case "CAD":
    case "AUD":
      return "$";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "EUR":
      return "€";
    default:
      break;
  }
}
