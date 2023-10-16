const host = "https://cne-leesbare-link-function-app.azurewebsites.net/api";

const elements = {
  emailInput: document.querySelector("#email"),
  emailConfirmationInput: document.querySelector("#email-confirmation"),
  passwordInput: document.querySelector("#password"),
  passwordConfirmationInput: document.querySelector("#password-confirmation"),
  loginForm: document.querySelector("#login-form"),
  registerForm: document.querySelector("#register-form"),
  createForm: document.querySelector("#create-form"),
  linkInput: document.querySelector("#link"),
  mappingInput: document.querySelector("#mapping"),
  linkTable: document.querySelector("#link-table"),
}

const setAuthentication = (hash) => {
  localStorage.setItem("Authorization", hash);
}

const clearAuthentication = () => {
  localStorage.removeItem("Authorization");
}

const isAuthenticated = () => {
  return !!localStorage.getItem("Authorization");
}