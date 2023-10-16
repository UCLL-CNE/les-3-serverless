if (!isAuthenticated()) {
  alert("Need to be authenticated.");
  window.location.replace("/login.html");
}