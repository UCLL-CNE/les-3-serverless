const login = async () => {
  const email = elements.emailInput.value;
  const password = elements.passwordInput.value;

  const response = await fetch(`${host}/login`, {
    body: JSON.stringify({ email, password }),
    headers: {
      ["Content-Type"]: "application/json",
    },
    method: "POST",
  });

  const body = await response.json();

  if (response.status !== 200) {
    alert(body.message);
  } else {
    setAuthentication(btoa(`${email}:${password}`));
    window.location.replace("/dashboard.html");
  }
};

elements.loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
