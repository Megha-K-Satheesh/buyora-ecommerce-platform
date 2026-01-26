// src/utils/toastHelper.js
import { toast } from "react-toastify";

// Success toast
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};

// Error toast
export const showError = (message, options = {}) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};

// Info toast
export const showInfo = (message, options = {}) => {
  toast.info(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};
