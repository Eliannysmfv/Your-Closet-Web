
console.log("🟣 pago.js cargado correctamente");


if (typeof KEY_TOTAL_PAGO === 'undefined') {
    const KEY_TOTAL_PAGO = 'totalPedido';
}
if (typeof KEY_CARRITO === 'undefined') {
   const KEY_CARRITO = 'carrito';
}
const KEY_CORRELATIVE_ID = 'ordenIdCorrelativo'; 


const KEY_HISTORIAL = 'historialPedidos';

let generatedOrderId = ''; 



function cargarTotalAPagar() {
    console.log("✅ [PAGO.JS]: Intentando cargar total desde localStorage...");

   
    let totalMonto = localStorage.getItem(KEY_TOTAL_PAGO);

  
    if (!totalMonto) {
        const carrito = JSON.parse(localStorage.getItem(KEY_CARRITO)) || [];
        totalMonto = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * parseInt(item.cantidad || 0)), 0);
        console.log("⚠️ [PAGO.JS]: No se encontró total guardado, se recalculó desde carrito:", totalMonto);
    }

    const totalElemento = document.getElementById('pago-total-monto');
    if (totalElemento) {
        totalElemento.textContent = `S/. ${parseFloat(totalMonto || 0).toFixed(2)}`;
    }


    localStorage.setItem(KEY_TOTAL_PAGO, parseFloat(totalMonto || 0).toFixed(2));
}


function generarNumeroOrden() {
    const numeroAleatorio = Math.floor(100000 + Math.random() * 900000); 
    const numeroOrden = `ORD-${numeroAleatorio}`;
    const elementoOrden = document.getElementById('pago-numero-orden');

    if (elementoOrden) {
        elementoOrden.textContent = numeroOrden;
        console.log("🧾 Número de orden generado:", numeroOrden);
    } else {
        console.warn("⚠️ No se encontró el elemento con id 'pago-numero-orden'");
    }
}




function validarSoloNumeros(event) {

    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}


function validarFechaVencimiento(event) {
    const input = event.target;
    let value = input.value;
    

    value = value.replace(/[^0-9/]/g, ''); 
    

    if (event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') {
        input.value = value;
        return;
    }


    if (value.length >= 2 && !value.includes('/')) {

        value = value.substring(0, 2) + '/' + value.substring(2);
    }


    if (value.length > 5) {
        value = value.substring(0, 5);
    }

    input.value = value;
}





function obtenerSiguienteIdCorrelativo() {
    let currentId = parseInt(localStorage.getItem(KEY_CORRELATIVE_ID)) || 1001;
    const orderId = `ORD-${currentId}`;
    localStorage.setItem(KEY_CORRELATIVE_ID, currentId + 1);
    return orderId;
}




document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 DOM listo, iniciando carga de total...");
    cargarTotalAPagar();
    generarNumeroOrden();



    const formPago = document.getElementById('checkout-form');
    if (formPago) {
    
        formPago.addEventListener('submit', handlePago); 
        console.log("✅ Listener de formulario de pago adjuntado.");
    }


const numeroTarjetaInput = document.getElementById('numeroTarjeta');
const fechaVencimientoInput = document.getElementById('fechaVencimiento');
const cvvInput = document.getElementById('cvv');

if (numeroTarjetaInput) {
    numeroTarjetaInput.addEventListener('input', validarSoloNumeros);
    numeroTarjetaInput.maxLength = 16; 
}

if (cvvInput) {
    cvvInput.addEventListener('input', validarSoloNumeros);
    cvvInput.maxLength = 4;
}

if (fechaVencimientoInput) {
    fechaVencimientoInput.addEventListener('input', validarFechaVencimiento);
    fechaVencimientoInput.maxLength = 5; 
}

console.log("✅ Validaciones de números y fecha de pago adjuntadas.");



});




function handlePago(event) {
    event.preventDefault();
    console.log("-> 1. handlePago() INICIADO.");

    const form = document.getElementById('checkout-form');
    
    
    if (!form.checkValidity()) {
        form.reportValidity(); 
        return;
    }

  
    const carritoActual = JSON.parse(localStorage.getItem(KEY_CARRITO)) || [];
    const totalMonto = localStorage.getItem(KEY_TOTAL_PAGO);
    const emailCliente = localStorage.getItem('usuario_actual_email') || 'Invitado'; 
    const ordenId = document.getElementById('pago-numero-orden').textContent; 

    if (carritoActual.length === 0 || !totalMonto || totalMonto === '0.00') {
        alert("Error: El carrito está vacío o el total es cero. No se puede procesar el pago.");
        return;
    }
    

    const nuevoPedido = {
        id: ordenId,

        fecha: new Date().toLocaleString('es-PE', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        }),
        total: totalMonto,
        estado: 'Pagado', 
        productos: carritoActual,
        metodoPago: 'Tarjeta de Crédito', 
        emailCliente: emailCliente, 

    
        origen: 'WEB'
    };
    

    let historial = JSON.parse(localStorage.getItem(KEY_HISTORIAL)) || [];
    historial.push(nuevoPedido);
    localStorage.setItem(KEY_HISTORIAL, JSON.stringify(historial));
    

    localStorage.removeItem(KEY_CARRITO);
    localStorage.removeItem(KEY_TOTAL_PAGO);
    localStorage.setItem('contadorCarrito', '0'); 


    alert(`✅ ¡Pago Exitoso!\nOrden #${ordenId} de S/. ${totalMonto} ha sido registrada.`);
    

    window.location.href = 'cliente_dashboard.html'; 
}