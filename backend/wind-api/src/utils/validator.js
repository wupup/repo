// utils/validator.js

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePhone(phoneNumber) {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(String(phoneNumber));
}

export function validateNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function validateInteger(value) {
  return Number.isInteger(Number(value));
}

export function validatePassword(password) {
  // At least 8 characters, one uppercase letter, one lowercase letter, one number and one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
}
