import CryptoJS from "crypto-js";
const ENCRYPTION_KEY = CryptoJS.enc.Utf8.parse(
  import.meta.env.VITE_ENCRYPTION_KEY
);
const ENCRYPTION_IV = CryptoJS.enc.Utf8.parse(
  import.meta.env.VITE_ENCRYPTION_IV
);

export const encrypt = (data) => {
  const phrase = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(phrase, ENCRYPTION_KEY, {
    iv: ENCRYPTION_IV,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  const returnData = encrypted.toString();
  return returnData;
};

export const decrypt = (encryptedData) => {
  let returnData = {};
  try {
    var plaintextData = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY, {
      iv: ENCRYPTION_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryped = plaintextData.toString(CryptoJS.enc.Utf8);

    if (decryped) {
      returnData = JSON.parse(decryped);
    }
  } catch (error) {
    // console.log("CATCH", encryptedData);
  }
  return returnData;
};

// Store data in local storage with encryption form
export const storeLocalStorageData = (newData) => {
  const decryptData = decrypt(localStorage.authData || {});
  localStorage.authData = encrypt({ ...decryptData, ...newData });
};

// Get data from local storage which return decrypt data
export function getDataFromLocalStorage(key = "") {
  let returnValue = "";
  if (localStorage.authData) {
    const localObjectData = decrypt(localStorage.authData);
    if (key) {
      returnValue = localObjectData[key] ? localObjectData[key] : "";
    } else {
      returnValue = localObjectData;
    }
  }
  return returnValue;
}

export function getHeaderData() {
  let header = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const localStorageData = getDataFromLocalStorage();
  if (localStorageData?.token) {
    header = {
      ...header,
      ...{ Authorization: `Bearer ${getDataFromLocalStorage("token")}` },
    };
  }
  // if (localStorageData?.username) {
  //   const { username, password } = localStorageData;
  //   const authString = `${username}:${password}`;
  //   header = {
  //     ...header,
  //     Authorization: `Basic ${btoa(authString)}`,
  //   };
  // }
  return header;
}

// Trim all left space from string
export const trimLeftSpace = (value) => value.replace(/^\s+/g, "");

// convert string into title case
export const titleCaseString = (value) => {
  if (typeof value !== "string") return "";
  return value.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase()); // Capital first character of each word
};

export const getInitials = (name) => {
  if (!name) return "";
  const initials = name?.slice(0, 2)?.toUpperCase();
  return initials;
};
export const getInitialsVal = (name) => {
  if (!name) return "";
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
  return initials;
};
export const getYearByCount = (startYear, endYear) => {
  let returnValue = [];
  while (startYear <= endYear) {
    returnValue.push(`${startYear++}`);
  }
  return returnValue;
};
export const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const isBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!isBirthdayPassed) {
    age--;
  }

  return age;
};

export const calculateAgeVal = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let ageYears = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    ageYears--;
  }

  let monthsDiff = today.getMonth() - birthDate.getMonth();

  if (monthsDiff < 0) {
    monthsDiff += 12;
  }
  let daysDiff = today.getDate() - birthDate.getDate();

  if (daysDiff < 0) {
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    daysDiff += prevMonth.getDate();
    monthsDiff--;
    if (monthsDiff < 0) {
      monthsDiff = 11;
      ageYears--;
    }
  }
  if (ageYears < 1 && today.getMonth() === birthDate.getMonth()) {
    return `${daysDiff} day`;
  }

  if (ageYears < 1) {
    return `${monthsDiff} month, ${daysDiff} day`;
  }
  return `${ageYears} year`;
};

export const handleExport = (headers, rowdata, fileName) => {
  // Convert data to CSV format
  const rows = rowdata.map((row) =>
    headers.map((key) => (key in row ? row[key] : ""))
  );

  const csvContent = [
    headers.join(","), // Add headers
    ...rows.map((row) => row.join(",")), // Add rows
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL after the download is triggered
  URL.revokeObjectURL(url);
};

export const generateRandomPassword = (length = 9) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};
// Helper function to lighten hex color
export const lightenHexColor = (hex, percent) => {
  // Remove the hash (#) if it exists
  hex = hex.replace(/^#/, "");

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Lighten the color by the specified percentage
  r = Math.min(255, r + (255 - r) * percent);
  g = Math.min(255, g + (255 - g) * percent);
  b = Math.min(255, b + (255 - b) * percent);

  // Convert back to hex
  r = Math.round(r).toString(16).padStart(2, "0");
  g = Math.round(g).toString(16).padStart(2, "0");
  b = Math.round(b).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
};

export const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  return "#" + randomColor.padStart(6, "0");
};

export const getDeviceToken = () => {
  let deviceToken = localStorage.getItem("device_token");
  if (!deviceToken) {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    deviceToken = Array.from(array, (num) => num.toString(16)).join("-");
    storeLocalStorageData({ deviceToken });
  }
  return deviceToken;
};
