import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
const secretKey = import.meta.env.VITE_SECRET_KEY;
const saveCookie = (cookieName: string, cookieValue: any) => {
  //setting cookie with expiry time
  document.cookie = cookieName + " = " + cookieValue + ";";
};
export const encryptData = (name: string, data: any) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  saveCookie(name, encrypted);
};
export const decryptData = (name: string) => {
  const encrypted = getCookie(name);
  if (encrypted) {
    // Decode the URL encoded cookie value
    const decodedEncrypted = decodeURIComponent(encrypted);
    const decrypted = CryptoJS.AES.decrypt(
      decodedEncrypted,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Error parsing decrypted data:", error);
      return null;
    }
  }
  return null;
};
export const getCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
export const deleteCookies = () => {
  const allCookies = document.cookie.split(";");

  for (let i = 0; i < allCookies.length; i++)
    document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
};

export const removeSingleCookie = (name: string) => {
  document.cookie = name + "=;expires=" + new Date(0).toUTCString();
};

export const getCookieData = (cookieName: string) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];
};
export const successMsg = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const normalFailMsg = (message: string) => {
  toast.dismiss();
  toast.error(message, {
    position: "top-center",
     autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const errorMsg = (message: string) => {
  toast.dismiss();
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const Logout = () => {
  deleteCookies();
};
export const showBootstrapModal = (elementId: string) => {
  const windowObj: any = window;
  const bootstrap: any = windowObj.bootstrap;
  // var myModalEl = document.querySelector(`#${elementId}`);
  // var modal = bootstrap.Modal.getOrCreateInstance(myModalEl);

  const bootstrapModal = new bootstrap.Modal(`#${elementId}`);
  bootstrapModal.show();
};
export const hideBootstrapModal = (elementId: string) => {
  const modalElement = document.getElementById(elementId);
  const windowObj: any = window;
  const bootstrapModal = windowObj.bootstrap.Modal.getOrCreateInstance(modalElement);
  
  if (bootstrapModal) bootstrapModal.hide();

  // Remove lingering Bootstrap modal backdrops
  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

  // Remove `modal-open` class and restore body scroll
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

export function formatDate(date: any) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear(); // Full year
  return `${day}/${month}/${year}`;
}
export const SearchData = (
  data: Array<any>,
  searchField: string,
  value: string
) => {
  if (data && searchField) {
    const filterData = data.filter((val) =>
      val[searchField]?.toLowerCase().includes(value.toLowerCase())
    );
    return filterData;
  }
};
export function parseDurationToMinutes(durationText: string): number {
  const hourMatch = durationText.match(/(\d+)\s*hour/);
  const minMatch = durationText.match(/(\d+)\s*min/);

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minMatch ? parseInt(minMatch[1]) : 0;

  return hours * 60 + minutes;
}
