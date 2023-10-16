const register = async () => {
  const email = elements.emailInput.value;
  const emailConfirmation = elements.emailConfirmationInput.value;
  const password = elements.passwordInput.value;
  const passwordConfirmation = elements.passwordConfirmationInput.value;

  if (email !== emailConfirmation) {
    alert("Email does not match confirmation.");
  } else if (password !== passwordConfirmation) {
    alert("Password does not match confirmation.");
  } else {
    const response = await fetch(`${host}/register`, {
      body: JSON.stringify({ email, password }),
      headers: {
        ["Content-Type"]: "application/json",
      },
      method: "POST",
    });

    const body = await response.json();

    if (response.status !== 201) {
      alert(body.message);
    } else {
      setAuthentication(btoa(`${email}:${password}`));
      window.location.replace("/dashboard.html");
    }
  }
};

elements.registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  register();
});
