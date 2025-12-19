// ventas.js - Sistema Completo de Ventas con Navegación Mejorada

// ==================== NAVEGACIÓN ====================

// Mostrar dashboard al cargar
window.onload = function () {
    mostrarDashboard();
    inicializarEventos();
};

// Abrir / cerrar combo Ventas
function toggleVentas() {
    const submenu = document.getElementById("ventasSubmenu");
    const chevron = document.getElementById("ventasChevron");

    if (submenu.style.display === "block") {
        submenu.style.display = "none";
        chevron.classList.remove("rotate");
    } else {
        submenu.style.display = "block";
        chevron.classList.add("rotate");
    }
}

// Mostrar dashboard
function mostrarDashboard() {
    document.getElementById("vistaDashboard").style.display = "block";
    document.getElementById("vistaVentas").style.display = "none";
    
    // Cerrar el submenú de ventas
    const submenu = document.getElementById("ventasSubmenu");
    const chevron = document.getElementById("ventasChevron");
    if (submenu) submenu.style.display = "none";
    if (chevron) chevron.classList.remove("rotate");
    
    // Cargar datos del dashboard
    setTimeout(() => {
        cargarUltimosComprobantes();
        actualizarEstadisticas();
    }, 100);
}

// Cargar vistas de ventas
function cargarVista(tipo) {
    // Ocultar dashboard y mostrar ventas
    document.getElementById("vistaDashboard").style.display = "none";
    document.getElementById("vistaVentas").style.display = "block";

    // Cambiar el título según el tipo
    const titulo = document.querySelector(".invoice-header h5");
    const btnFactura = document.querySelector('.invoice-header .btn-primary-custom');
    const btnBoleta = document.querySelector('.invoice-header .btn-danger-custom');
    const btnNota = document.querySelector('.invoice-header .btn-purple-custom');

    // Resaltar el botón activo
    if (btnFactura) btnFactura.style.opacity = '0.5';
    if (btnBoleta) btnBoleta.style.opacity = '0.5';
    if (btnNota) btnNota.style.opacity = '0.5';

    switch (tipo) {
        case "boleta":
            titulo.innerHTML = '<i class="fas fa-file-alt"></i> NUEVA BOLETA';
            if (btnBoleta) btnBoleta.style.opacity = '1';
            break;
        case "factura":
            titulo.innerHTML = '<i class="fas fa-file-invoice"></i> NUEVA FACTURA';
            if (btnFactura) btnFactura.style.opacity = '1';
            break;
        case "notaVenta":
            titulo.innerHTML = '<i class="fas fa-receipt"></i> NOTA DE VENTA';
            if (btnNota) btnNota.style.opacity = '1';
            break;
        case "notaCredito":
            titulo.innerHTML = '<i class="fas fa-undo"></i> NOTA DE CRÉDITO';
            break;
        case "notaDebito":
            titulo.innerHTML = '<i class="fas fa-redo"></i> NOTA DE DÉBITO';
            break;
    }
    
    // Limpiar formulario al cambiar de vista
    limpiarFormulario();
    
    // Reinicializar eventos después de cargar la vista
    setTimeout(() => {
        inicializarEventos();
    }, 100);
}

// ==================== VARIABLES GLOBALES ====================

let productos = [];
let subtotal = 0;
let descuentoTotal = 0;
let igv = 0;
let total = 0;

// ==================== INICIALIZACIÓN ====================

function inicializarEventos() {
    // Verificar que estamos en la vista de ventas
    const vistaVentas = document.getElementById('vistaVentas');
    if (!vistaVentas || vistaVentas.style.display === 'none') {
        return; // No inicializar si no está visible
    }

    // Botón buscar cliente
    const btnBuscarCliente = document.querySelector('#vistaVentas .input-group button');
    if (btnBuscarCliente) {
        btnBuscarCliente.removeEventListener('click', buscarCliente); // Evitar duplicados
        btnBuscarCliente.addEventListener('click', buscarCliente);
    }

    // Botones de agregar productos
    const btnsAgregarProductos = document.querySelectorAll('#vistaVentas .btn-primary-custom');
    btnsAgregarProductos.forEach(btn => {
        if (btn.textContent.includes('AGREGAR PRODUCTOS')) {
            btn.removeEventListener('click', mostrarModalProductos);
            btn.addEventListener('click', mostrarModalProductos);
        }
    });

    // Botón nuevo producto
    const btnsNuevoProducto = document.querySelectorAll('#vistaVentas .btn-info-custom');
    btnsNuevoProducto.forEach(btn => {
        if (btn.textContent.includes('NUEVO PRODUCTO')) {
            btn.removeEventListener('click', nuevoProducto);
            btn.addEventListener('click', nuevoProducto);
        }
    });

    // Botones de emisión en el header
    const btnEmitirFactura = document.querySelector('.invoice-header .btn-primary-custom');
    const btnEmitirBoleta = document.querySelector('.invoice-header .btn-danger-custom');
    const btnEmitirNota = document.querySelector('.invoice-header .btn-purple-custom');

    if (btnEmitirFactura) {
        btnEmitirFactura.removeEventListener('click', emitirFactura);
        btnEmitirFactura.addEventListener('click', emitirFactura);
    }
    if (btnEmitirBoleta) {
        btnEmitirBoleta.removeEventListener('click', emitirBoleta);
        btnEmitirBoleta.addEventListener('click', emitirBoleta);
    }
    if (btnEmitirNota) {
        btnEmitirNota.removeEventListener('click', emitirNotaVenta);
        btnEmitirNota.addEventListener('click', emitirNotaVenta);
    }

    // Toggle switch descuento
    const switchToggle = document.querySelector('#vistaVentas .switch');
    if (switchToggle) {
        switchToggle.removeEventListener('click', toggleDescuento);
        switchToggle.addEventListener('click', toggleDescuento);
    }

    // Input de descuento
    const inputDescuento = document.querySelector('#vistaVentas .table-row input[type="number"]');
    if (inputDescuento) {
        inputDescuento.removeEventListener('input', aplicarDescuento);
        inputDescuento.addEventListener('input', aplicarDescuento);
    }

    // Botones región selva
    const btnRegionNo = document.querySelector('#vistaVentas .btn-region-no');
    const btnRegionYes = document.querySelector('#vistaVentas .btn-region-yes');
    
    if (btnRegionNo) {
        btnRegionNo.removeEventListener('click', toggleBienesSelva);
        btnRegionNo.addEventListener('click', toggleBienesSelva);
    }
    if (btnRegionYes) {
        btnRegionYes.removeEventListener('click', toggleServiciosSelva);
        btnRegionYes.addEventListener('click', toggleServiciosSelva);
    }

    // Cargar productos guardados y actualizar resumen
    cargarProductosGuardados();
    actualizarResumen();
}

// ==================== GESTIÓN DE CLIENTES ====================

function buscarCliente() {
    const numeroDoc = document.querySelector('#vistaVentas input[placeholder="Ingrese número de documento..."]').value;
    
    if (!numeroDoc) {
        alert('Por favor ingrese un número de documento');
        return;
    }

    // Simulación de búsqueda (en producción: API SUNAT/RENIEC)
    if (numeroDoc.length === 8) {
        // DNI
        document.querySelector('#vistaVentas input[placeholder="Ingrese nombre o razón social..."]').value = 'CLIENTE DE PRUEBA';
        document.querySelector('#vistaVentas input[placeholder="Ingrese la dirección..."]').value = 'AV. PRINCIPAL 123, LIMA';
        document.querySelector('#vistaVentas input[placeholder="Ingrese su número de celular..."]').value = '987654321';
        document.querySelector('#vistaVentas input[placeholder="Ingrese código de ubigeo..."]').value = '150101';
        alert('✅ Cliente encontrado correctamente');
    } else if (numeroDoc.length === 11) {
        // RUC
        document.querySelector('#vistaVentas input[placeholder="Ingrese nombre o razón social..."]').value = 'EMPRESA DEMO S.A.C.';
        document.querySelector('#vistaVentas input[placeholder="Ingrese la dirección..."]').value = 'JR. COMERCIO 456, LIMA';
        document.querySelector('#vistaVentas input[placeholder="Ingrese su número de celular..."]').value = '987654321';
        document.querySelector('#vistaVentas input[placeholder="Ingrese código de ubigeo..."]').value = '150101';
        alert('✅ Empresa encontrada correctamente');
    } else {
        alert('❌ Número de documento inválido.\nDNI: 8 dígitos | RUC: 11 dígitos');
    }
}

// ==================== GESTIÓN DE PRODUCTOS ====================

function mostrarModalProductos() {
    const producto = prompt('📦 Ingrese el nombre del producto:');
    if (!producto) return;
    
    const cantidad = parseFloat(prompt('🔢 Ingrese la cantidad:', '1'));
    if (!cantidad || cantidad <= 0) {
        alert('❌ Cantidad inválida');
        return;
    }
    
    const precio = parseFloat(prompt('💰 Ingrese el precio unitario (S/):', '0'));
    if (!precio || precio <= 0) {
        alert('❌ Precio inválido');
        return;
    }

    agregarProducto({
        codigo: 'PROD' + Date.now(),
        nombre: producto,
        cantidad: cantidad,
        precio: precio,
        unidad: 'UND'
    });
    
    alert('✅ Producto agregado correctamente');
}

function agregarProducto(producto) {
    productos.push(producto);
    renderizarProductos();
    guardarProductos();
    actualizarResumen();
}

function renderizarProductos() {
    const buttonGroup = document.querySelector('#vistaVentas .button-group');
    if (!buttonGroup) return;
    
    let existingTable = document.querySelector('#vistaVentas .productos-table');
    
    if (existingTable) {
        existingTable.remove();
    }

    if (productos.length === 0) return;

    const table = document.createElement('div');
    table.className = 'productos-table';
    table.style.marginTop = '10px';
    table.style.border = '1px solid #ddd';
    table.style.borderRadius = '4px';
    table.style.overflow = 'hidden';
    
    let html = `
        <div style="display: grid; grid-template-columns: 100px 1fr 80px 150px 150px 100px; gap: 10px; padding: 10px; background: #0d6efd; color: white; font-weight: bold; font-size: 11px;">
            <div>CÓDIGO</div>
            <div>DESCRIPCIÓN</div>
            <div>CANT.</div>
            <div>P. UNITARIO</div>
            <div>SUBTOTAL</div>
            <div>ACCIONES</div>
        </div>
    `;

    productos.forEach((prod, index) => {
        const subtotalProd = prod.cantidad * prod.precio;
        html += `
            <div style="display: grid; grid-template-columns: 100px 1fr 80px 150px 150px 100px; gap: 10px; padding: 10px; background: white; border-bottom: 1px solid #eee; align-items: center; font-size: 12px;">
                <div>${prod.codigo}</div>
                <div>${prod.nombre}</div>
                <div>${prod.cantidad}</div>
                <div>S/ ${prod.precio.toFixed(2)}</div>
                <div style="font-weight: bold;">S/ ${subtotalProd.toFixed(2)}</div>
                <div>
                    <button onclick="eliminarProducto(${index})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    });

    table.innerHTML = html;
    buttonGroup.parentNode.insertBefore(table, buttonGroup);
}

function eliminarProducto(index) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        productos.splice(index, 1);
        renderizarProductos();
        guardarProductos();
        actualizarResumen();
    }
}

function nuevoProducto() {
    alert('📝 Funcionalidad de registro de nuevo producto en desarrollo.\n\n💡 Por ahora use "Agregar Productos" para añadir items a la factura.');
}

// ==================== DESCUENTOS ====================

function toggleDescuento() {
    const input = document.querySelector('#vistaVentas .table-row input[type="number"]');
    const switchEl = document.querySelector('#vistaVentas .switch');
    
    if (switchEl.classList.contains('active')) {
        input.disabled = false;
    } else {
        input.disabled = true;
        input.value = 0;
        aplicarDescuento();
    }
}

function aplicarDescuento() {
    const inputDescuento = document.querySelector('#vistaVentas .table-row input[type="number"]');
    const descuentoPorcentaje = parseFloat(inputDescuento?.value) || 0;
    descuentoTotal = (subtotal * descuentoPorcentaje) / 100;
    actualizarResumen();
}

// ==================== RESUMEN Y CÁLCULOS ====================

function actualizarResumen() {
    subtotal = productos.reduce((sum, prod) => sum + (prod.cantidad * prod.precio), 0);
    
    const inputDescuento = document.querySelector('#vistaVentas .table-row input[type="number"]');
    const descuentoPorcentaje = parseFloat(inputDescuento?.value) || 0;
    descuentoTotal = (subtotal * descuentoPorcentaje) / 100;
    
    const baseImponible = subtotal - descuentoTotal;
    igv = baseImponible * 0.18;
    total = baseImponible + igv;

    // Actualizar valores en el DOM
    const summaryRows = document.querySelectorAll('#vistaVentas .summary-row');
    if (summaryRows[0]) summaryRows[0].querySelector('span:last-child').textContent = descuentoTotal.toFixed(2);
    if (summaryRows[1]) summaryRows[1].querySelector('span:last-child').textContent = igv.toFixed(2);
    if (summaryRows[2]) summaryRows[2].querySelector('span:last-child').textContent = total.toFixed(2);
}

// ==================== EMISIÓN DE COMPROBANTES ====================

function emitirFactura() {
    if (!validarEmision()) return;

    const factura = {
        tipo: 'FACTURA',
        serie: document.querySelectorAll('#vistaVentas .form-control-custom')[1].value,
        numero: generarNumeroComprobante(),
        fecha: document.querySelectorAll('#vistaVentas .form-control-custom')[2].value,
        cliente: obtenerDatosCliente(),
        productos: productos,
        subtotal: subtotal,
        descuento: descuentoTotal,
        igv: igv,
        total: total,
        metodoPago: document.querySelector('#vistaVentas .select-medium').value,
        observaciones: document.querySelector('#vistaVentas textarea').value
    };

    guardarComprobante(factura);
    alert(`✅ FACTURA EMITIDA CORRECTAMENTE\n\n📄 Serie-Número: ${factura.serie}-${factura.numero}\n👤 Cliente: ${factura.cliente.nombre}\n💰 Total: S/ ${factura.total.toFixed(2)}`);
    limpiarFormulario();
}

function emitirBoleta() {
    if (!validarEmision()) return;

    const boleta = {
        tipo: 'BOLETA',
        serie: 'B001',
        numero: generarNumeroComprobante(),
        fecha: document.querySelectorAll('#vistaVentas .form-control-custom')[2].value,
        cliente: obtenerDatosCliente(),
        productos: productos,
        subtotal: subtotal,
        descuento: descuentoTotal,
        igv: igv,
        total: total
    };

    guardarComprobante(boleta);
    alert(`✅ BOLETA EMITIDA CORRECTAMENTE\n\n📄 Serie-Número: ${boleta.serie}-${boleta.numero}\n💰 Total: S/ ${boleta.total.toFixed(2)}`);
    limpiarFormulario();
}

function emitirNotaVenta() {
    if (productos.length === 0) {
        alert('⚠️ Debe agregar al menos un producto');
        return;
    }

    const nota = {
        tipo: 'NOTA DE VENTA',
        numero: generarNumeroComprobante(),
        fecha: new Date().toLocaleDateString(),
        productos: productos,
        total: total
    };

    guardarComprobante(nota);
    alert(`✅ NOTA DE VENTA EMITIDA\n\n📄 Número: ${nota.numero}\n💰 Total: S/ ${nota.total.toFixed(2)}`);
    limpiarFormulario();
}

// ==================== VALIDACIONES ====================

function validarEmision() {
    if (productos.length === 0) {
        alert('⚠️ Debe agregar al menos un producto');
        return false;
    }

    const numeroDoc = document.querySelector('#vistaVentas input[placeholder="Ingrese número de documento..."]').value;
    const nombreCliente = document.querySelector('#vistaVentas input[placeholder="Ingrese nombre o razón social..."]').value;

    if (!numeroDoc || !nombreCliente) {
        alert('⚠️ Debe completar los datos del cliente');
        return false;
    }

    return true;
}

function obtenerDatosCliente() {
    return {
        tipoDoc: document.querySelectorAll('#vistaVentas .form-control-custom')[0].value,
        numeroDoc: document.querySelector('#vistaVentas input[placeholder="Ingrese número de documento..."]').value,
        nombre: document.querySelector('#vistaVentas input[placeholder="Ingrese nombre o razón social..."]').value,
        direccion: document.querySelector('#vistaVentas input[placeholder="Ingrese la dirección..."]').value
    };
}

// ==================== REGIÓN SELVA ====================

function toggleBienesSelva() {
    const btn = document.querySelector('#vistaVentas .btn-region-no');
    if (btn.textContent.includes('NO')) {
        btn.innerHTML = '<i class="fas fa-check"></i> ¿Bienes Región Selva? SÍ';
        btn.style.background = '#28a745';
    } else {
        btn.innerHTML = '<i class="fas fa-times"></i> ¿Bienes Región Selva? NO';
        btn.style.background = '#dc3545';
    }
}

function toggleServiciosSelva() {
    const btn = document.querySelector('#vistaVentas .btn-region-yes');
    if (btn.textContent.includes('NO')) {
        btn.innerHTML = '<i class="fas fa-check"></i> ¿Servicios Región Selva? SÍ';
        btn.style.background = '#28a745';
    } else {
        btn.innerHTML = '<i class="fas fa-times"></i> ¿Servicios Región Selva? NO';
        btn.style.background = '#dc3545';
    }
}

// ==================== ALMACENAMIENTO ====================

function generarNumeroComprobante() {
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [];
    return String(comprobantes.length + 1).padStart(8, '0');
}

function guardarComprobante(comprobante) {
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [];
    comprobantes.push({
        ...comprobante,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('comprobantes', JSON.stringify(comprobantes));
}

function guardarProductos() {
    localStorage.setItem('productosTemp', JSON.stringify(productos));
}

function cargarProductosGuardados() {
    const productosGuardados = localStorage.getItem('productosTemp');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
        renderizarProductos();
    }
}

// ==================== UTILIDADES ====================

function limpiarFormulario() {
    productos = [];
    localStorage.removeItem('productosTemp');
    
    // Limpiar campos
    const inputs = document.querySelectorAll('#vistaVentas input[type="text"]');
    inputs.forEach(input => input.value = '');
    
    const textarea = document.querySelector('#vistaVentas textarea');
    if (textarea) textarea.value = '';
    
    const inputDescuento = document.querySelector('#vistaVentas .table-row input[type="number"]');
    if (inputDescuento) inputDescuento.value = 0;
    
    // Limpiar tabla de productos
    const existingTable = document.querySelector('#vistaVentas .productos-table');
    if (existingTable) existingTable.remove();
    
    actualizarResumen();
}

// ==================== DASHBOARD ====================

function cargarUltimosComprobantes() {
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [];
    const tabla = document.getElementById('tablaComprobantes');
    
    if (!tabla) return;
    
    if (comprobantes.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" style="padding: 30px; text-align: center; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                    No hay comprobantes emitidos aún
                </td>
            </tr>
        `;
        return;
    }
    
    const ultimos = comprobantes.slice(-5).reverse();
    
    tabla.innerHTML = ultimos.map(comp => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">
                <span style="background: ${comp.tipo === 'FACTURA' ? '#0d6efd' : comp.tipo === 'BOLETA' ? '#dc3545' : '#6f42c1'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                    ${comp.tipo}
                </span>
            </td>
            <td style="padding: 12px;">${comp.serie || 'N/A'}-${comp.numero}</td>
            <td style="padding: 12px;">${comp.cliente?.nombre || 'N/A'}</td>
            <td style="padding: 12px;">${comp.fecha || new Date(comp.timestamp).toLocaleDateString()}</td>
            <td style="padding: 12px; text-align: right; font-weight: bold;">S/ ${comp.total?.toFixed(2) || '0.00'}</td>
        </tr>
    `).join('');
}

function actualizarEstadisticas() {
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [];
    
    const hoy = new Date();
    const mesActual = comprobantes.filter(c => {
        const fechaComp = new Date(c.timestamp);
        return fechaComp.getMonth() === hoy.getMonth() && fechaComp.getFullYear() === hoy.getFullYear();
    });
    
    const facturas = mesActual.filter(c => c.tipo === 'FACTURA').length;
    const boletas = mesActual.filter(c => c.tipo === 'BOLETA').length;
    const totalMes = mesActual.reduce((sum, c) => sum + (c.total || 0), 0);
    
    console.log('📊 Estadísticas:', { facturas, boletas, totalMes });
}