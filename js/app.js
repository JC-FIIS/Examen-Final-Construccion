// ACCIONES AL HACER CLICK
/*ocument.addEventListener("DOMContentLoaded", () => {
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
*/
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnLogin");
  const user = document.getElementById("user");
  const pass = document.getElementById("pass");

  if (!btn || !user) return;

  const login = () => {
    if (!user.value.trim()) {
      alert("Ingrese un usuario válido");
      user.focus();
      return;
    }

    // CARGA 0.5s
    btn.disabled = true;
    btn.textContent = "Cargando...";

    setTimeout(() => {
      localStorage.setItem("ventas_user", user.value.trim());
      location.href = "principal.html";
    }, 500); // 0.5 segundos
  };

  btn.onclick = login;
  [user, pass].forEach(i =>
    i?.addEventListener("keydown", e => e.key === "Enter" && login())
  );
});
