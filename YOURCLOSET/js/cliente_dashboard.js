
const KEY_CARRITO = 'carrito';
const KEY_TOTAL_PAGO = 'totalPedido'; 
let carrito = JSON.parse(localStorage.getItem(KEY_CARRITO)) || [];

function guardarCarrito() {
    localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));

    if (window.actualizarContadorCarrito) {
        window.actualizarContadorCarrito();
    }
    

    if (document.getElementById('carrito-items-body')) {
        renderizarCarrito();
    }
}


window.agregarAlCarrito = function(id, nombre, precio, cantidad = 1) { 
    const cantidadAAgregar = parseInt(cantidad) || 1; 
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += cantidadAAgregar; 
    } else {
        carrito.push({ 
            id: id, 
            nombre: nombre, 
            precio: parseFloat(precio), 
            cantidad: cantidadAAgregar 
        });
    }

    guardarCarrito();
    alert(`${cantidadAAgregar} x ${nombre} añadido(s) al carrito.`); 
}


window.actualizarContadorCarrito = function() {
    const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);

    const contadorElemento = document.getElementById('contador-carrito'); 
    
    if (contadorElemento) {
        contadorElemento.textContent = totalItems;
    } 
}


window.renderizarCarrito = function() {

    const contenedorTabla = document.getElementById('carrito-items-body');
    const totalElemento = document.getElementById('carrito-total'); 


    if (!contenedorTabla || !totalElemento) return;

    contenedorTabla.innerHTML = ''; 
    let totalCarrito = 0;

    if (carrito.length === 0) {
        contenedorTabla.innerHTML = '<tr><td colspan="5" style="text-align: center;">Tu carrito de compras está vacío.</td></tr>';
        totalElemento.textContent = '0.00';
        return;
    }

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        totalCarrito += subtotal;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>S/. ${producto.precio.toFixed(2)}</td>
            <td>${producto.cantidad}</td>
            <td>S/. ${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn-eliminar-item" data-id="${producto.id}" style="background-color: #ec407a; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        contenedorTabla.appendChild(fila);
    });

    totalElemento.textContent = `S/. ${totalCarrito.toFixed(2)}`;

}


window.vaciarCarritoTotal = function() {
    if (confirm('¿Estás seguro que deseas vaciar todo el carrito?')) {
        carrito = []; 
        guardarCarrito();
        renderizarCarrito(); 
        alert('Carrito vaciado exitosamente.');
    }
}

window.calcularTotalCarrito = function() {
    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    return total; 
}


window.procederAPago = function() {
    const total = window.calcularTotalCarrito(); 

    if (total <= 0) {
        alert("El carrito está vacío. ¡Agrega productos para continuar!");
        return;
    }
    
    localStorage.setItem(KEY_TOTAL_PAGO, total.toFixed(2));
    

    window.location.href = 'pago.html'; 
}



document.addEventListener('DOMContentLoaded', () => {
    


    renderizarCarrito(); 


    const contenedorTabla = document.getElementById('carrito-items-body');

    if (contenedorTabla) {
        contenedorTabla.addEventListener('click', (e) => {
     
            const boton = e.target.closest('.btn-eliminar-item');
            
            if (boton) {
                const idAEliminar = boton.dataset.id;
                

                carrito = carrito.filter(item => item.id !== idAEliminar);
                
     
                guardarCarrito(); 
            }
        });
    }


    cargarDatosPerfil();


    
});



const KEY_CLIENTE_DATA = 'cliente_data'; 
function cargarDatosPerfil() {

const clienteDataJSON = localStorage.getItem(KEY_CLIENTE_DATA);
 
 if (clienteDataJSON) {
 const cliente = JSON.parse(clienteDataJSON);
 

 const nombreElemento = document.getElementById('perfil-nombre');
 const emailElemento = document.getElementById('perfil-email');
 const telefonoElemento = document.getElementById('perfil-telefono');
 const direccionElemento = document.getElementById('perfil-direccion');
 
 if (nombreElemento) {
 nombreElemento.textContent = cliente.nombre || 'No especificado';
 }
 if (emailElemento) {
 emailElemento.textContent = cliente.email || 'No especificado';
 }
 if (telefonoElemento) {
 telefonoElemento.textContent = cliente.telefono || 'No especificado';
 }
 if (direccionElemento) {
 direccionElemento.textContent = cliente.direccion || 'No especificada';
 }

 } else {

 console.warn('Advertencia: Cliente logueado pero sin datos de perfil. Redirigiendo.');
 window.logoutCliente(); 
}
}



window.renderizarHistorialPedidos = function() {
    const historialContentDiv = document.getElementById('historial-contenido');
    

    const USUARIO_ACTUAL_EMAIL = localStorage.getItem('usuario_actual_email');
   
    const historialGlobal = JSON.parse(localStorage.getItem('historialPedidos')) || [];

    const historialFiltrado = historialGlobal.filter(pedido => {

        return pedido.emailCliente === USUARIO_ACTUAL_EMAIL;
    });
    
    console.log(`[DASHBOARD] Usuario ${USUARIO_ACTUAL_EMAIL} cargando ${historialFiltrado.length} de ${historialGlobal.length} pedidos.`);


    if (!historialContentDiv) return;

    if (historialFiltrado.length === 0) { 
        historialContentDiv.innerHTML = `
            <h2>📦 Historial de Pedidos</h2>
            <p style="text-align: center; margin-top: 20px;">
                No tienes pedidos registrados. ¡Tu historial está vacío!
            </p>
        `;
        return;
    }


    let tablaHTML = `
        <h2>📦 Historial de Pedidos</h2>
        <table id="tabla-historial" style="width:100%; border-collapse: collapse; margin-top: 20px; font-size: 0.9em; color: #333;">
            <thead>
                <tr style="background-color: #d63384; color: white;">
                    <th style="border: 1px solid #d63384; padding: 10px; text-align: left;">ID Pedido</th>
                    <th style="border: 1px solid #d63384; padding: 10px; text-align: left;">Fecha</th>
                    <th style="border: 1px solid #d63384; padding: 10px; text-align: left;">Total</th>
                    <th style="border: 1px solid #d63384; padding: 10px; text-align: left;">Estado</th>
                    <th style="border: 1px solid #d63384; padding: 10px; text-align: left;">Detalles</th>
                </tr>
            </thead>
            <tbody>
    `;

    historialFiltrado.forEach(pedido => { 
        let estadoColor = 'gray';
        let backgroundColor = '#f8f8f8'; 
        
         if (pedido.estado === 'Pagado') {
            estadoColor = '#28a745'; 
            backgroundColor = '#e6ffec'; 
        } else if (pedido.estado === 'Pendiente de Pago') {
            estadoColor = '#ffc107'; 
            backgroundColor = '#fff8e1';
        } else if (pedido.estado === 'Enviado') {
            estadoColor = '#007bff'; 
        }

        tablaHTML += `
            <tr style="background-color: ${backgroundColor};">
                <td style="border: 1px solid #ccc; padding: 10px; color: #333;">${pedido.id}</td>
                <td style="border: 1px solid #ccc; padding: 10px; color: #333;">${pedido.fecha}</td>
                <td style="border: 1px solid #ccc; padding: 10px; color: #333;">S/. ${pedido.total}</td>
                <td style="border: 1px solid #ccc; padding: 10px; color: ${estadoColor}; font-weight: bold;">${pedido.estado}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">
                    <button onclick="mostrarDetallesPedido('${pedido.id}')" 
                                style="background-color: #d63384; color: white; border: none; padding: 5px 8px; cursor: pointer; border-radius: 3px; font-size: 0.8em;">
                        Ver
                    </button>
                </td>
            </tr>
        `;
    });

    tablaHTML += `
            </tbody>
        </table>
    `;

    historialContentDiv.innerHTML = tablaHTML;
};



window.mostrarDetallesPedido = function(idPedido) {
    const historialPedidos = JSON.parse(localStorage.getItem('historialPedidos')) || [];
    const pedido = historialPedidos.find(p => p.id === idPedido);

    if (pedido) {
        let detallesProductos = 'Productos: \n';
   
        (pedido.productos || []).forEach(item => { 
            detallesProductos += ` - ${item.nombre} (x${item.cantidad}) - S/. ${(item.precio * item.cantidad).toFixed(2)}\n`;
        });
        
  
        const metodoPagoSeguro = pedido.metodoPago ?? 'NO REGISTRADO'; 
        
        let mensajeAlerta = `
--- DETALLES DEL PEDIDO ${pedido.id} ---
Fecha: ${pedido.fecha}
Total: S/. ${pedido.total}
Estado: ${pedido.estado}
Método de Pago: ${metodoPagoSeguro.toUpperCase()}
---------------------------------
--- Productos Comprados ---
${detallesProductos}
        `;

        alert(mensajeAlerta);
    } else {
        alert('Detalles del pedido no encontrados.');
    }
};



window.logoutCliente = function() {
    console.log("🚪 Cerrando sesión del cliente...");

    localStorage.removeItem('cliente_logged_in');
    localStorage.removeItem('usuario_actual_email');
    localStorage.removeItem('cliente_data');

    localStorage.removeItem('carrito');
    localStorage.removeItem('totalPedido');


    const contadorCarrito = document.getElementById('contador-carrito');
    if (contadorCarrito) {
        contadorCarrito.textContent = '0';
    }


    console.log("🧹 Carrito y total eliminados correctamente. Redirigiendo...");


    window.location.href = '../pagina/login_cliente.html';
};


