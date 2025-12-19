// JS PARA ACOMODAR Y RESALTAR OPCIONES
document.addEventListener("DOMContentLoaded", () => {
  const userLabel = document.getElementById("userLabel");
  const btnLogout = document.getElementById("btnLogout");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));

  // VALIDA SI HAY SESION
  const user = localStorage.getItem("ventas_user");
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  if (userLabel) userLabel.textContent = `Usuario: ${user}`;

  // MARCO LA OPCION QUE ESTE SELECCIONADA
  const filename = (window.location.pathname.split("/").pop() || "").toLowerCase();
  const current =
    filename.includes("vender") ? "vender" :
    filename.includes("inicio") ? "inicio" :
    "inicio";

  navItems.forEach(a => {
    a.classList.toggle("active", a.dataset.page === current);
  });

  btnLogout?.addEventListener("click", () => {
    localStorage.removeItem("ventas_user");
    window.location.href = "index.html";
  });
});
