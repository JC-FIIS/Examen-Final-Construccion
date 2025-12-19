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


document.addEventListener("DOMContentLoaded", () => {
    const btnFactura = document.getElementById("btnAbrirFactura");

    if (btnFactura) {
        btnFactura.addEventListener("click", (e) => {
            e.preventDefault(); // Evita que la página se recargue
            console.log("Generando factura...");
            generarFactura();
        });
    } else {
        console.error("No se encontró el botón con ID 'btnAbrirFactura'");
    }
});

function generarFactura() {
    // Captura de datos con valores por defecto si están vacíos
    const cliente = document.getElementById("f-input-nombre")?.value || "Cliente General";
    const ruc = document.getElementById("f-input-documento")?.value || "00000000000";
    const fecha = new Date().toLocaleDateString();

    // Cálculo de ejemplo (puedes conectarlo a tu tabla de productos después)
    // Usamos LaTeX para la fórmula: $$Total = Subtotal + (Subtotal \times 0.18)$$
    const subtotal = 100.00; 
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    // Insertar en el modal
    const modal = document.getElementById("modalFactura");
    if (modal) {
        document.getElementById("f-cliente").textContent = cliente;
        document.getElementById("f-documento").textContent = ruc;
        document.getElementById("f-fecha").textContent = fecha;
        
        // Totales con formato de moneda
        document.getElementById("f-subtotal").textContent = subtotal.toFixed(2);
        document.getElementById("f-igv").textContent = igv.toFixed(2);
        document.getElementById("f-total").textContent = total.toFixed(2);

        modal.style.display = "flex";
    } else {
        alert("Error: No se encontró la estructura del modal en el HTML.");
    }
}

function cerrarModal() {
    document.getElementById("modalFactura").style.display = "none";
}

