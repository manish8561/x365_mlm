import { fetch } from "./Fetch";
import { API_HOST } from "../_constants";
import { getCookie } from "../_utils";

const userOverrideLang = getCookie('userOverrideLang') || 'en';

const getIp = () => {
  return fetch("get", "https://ipv4.jsonip.com");
};
const getLanguages = (ip) => {
  return fetch("get", `https://ipapi.co/${ip}/languages/`);
};
const saveStepFirst = data => {
  return fetch("post", `${API_HOST}paiid/saveStep1Form`, data, { userLang: userOverrideLang });
};
const validateToken = data => {
  return fetch("post", `${API_HOST}paiid/validateToken`, data, { userLang: userOverrideLang });
};
const resendEmailVerification = data => {
  return fetch("post", `${API_HOST}paiid/resendEmail`, data, { userLang: userOverrideLang });
};
const getAdminBanks = data => {
  return fetch("post", `${API_HOST}paiid/admin/bankDetails`, data);
};
const sendPaymentInstruction = data => {
  return fetch("post", `${API_HOST}paiid/paymentInstructionsEmail`, data);
};
const getMerchantDetails = name => {
  return fetch("get", `${API_HOST}paiid/merchantDetails/${name}`, {}, { userLang: userOverrideLang });
};
const getkycDetails = id => {
  return fetch("post", `${API_HOST}paiid/admin/getKycDataSumSub`, {
    kycId: id
  });
};
const updateUserLanguage = data => {
  return fetch("post", `${API_HOST}paiid/updateUserLanguage`, data);
};

//
export const UserService = {
  getIp,
  saveStepFirst,
  validateToken,
  resendEmailVerification,
  getAdminBanks,
  sendPaymentInstruction,
  getMerchantDetails,
  getkycDetails,
  getLanguages,
  updateUserLanguage
};
