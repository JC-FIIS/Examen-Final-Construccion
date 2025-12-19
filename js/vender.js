// js/vender.js
document.addEventListener("DOMContentLoaded", () => {
  const btnAdd = document.getElementById("btnAdd");
  const btnPay = document.getElementById("btnPay");

  btnAdd?.addEventListener("click", () => {
    alert("Agregar (demo). Aquí luego iría el carrito/tabla.");
  });

  btnPay?.addEventListener("click", () => {
    alert("Cobrar (demo). Aquí luego iría total, pago, vuelto, etc.");
  });
});
