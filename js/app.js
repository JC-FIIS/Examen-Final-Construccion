// ACCIONES AL HACER CLICK
document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const userInput = document.getElementById("user");

  if (!btnLogin) return;

  btnLogin.addEventListener("click", () => {
    const user = (userInput?.value || "demo").trim() || "demo";
    localStorage.setItem("ventas_user", user);

    // REDIRECCIONA AL INICIO
    window.location.href = "inicio.html";
  });
});
