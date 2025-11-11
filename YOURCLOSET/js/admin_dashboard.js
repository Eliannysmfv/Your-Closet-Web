
console.log("🟢 admin_dashboard.js cargado correctamente.");


const ADMIN_SESSION_KEY = 'admin_logged_in';
const KEY_INVENTARIO = 'inventario_productos';

const KEY_HISTORIAL_PEDIDOS = 'historialPedidos'; 

let prodIdCounter = 101;


const dashboardMenuView = document.getElementById('dashboard-menu-view');
const contentArea = document.getElementById('gestion-content-area');
const btnVolver = document.getElementById('btn-volver-dashboard');


function mostrarVista(vista) {

    document.querySelectorAll('.gestion-view').forEach(view => {
        view.style.display = 'none';
    });


    const targetView = document.getElementById(`${vista}-view`);
    if (targetView) {
        targetView.style.display = 'block';
        contentArea.style.display = 'block';
        dashboardMenuView.style.display = 'none';


        if (vista === 'inventario') {
            console.log("-> Vista Inventario seleccionada. Inicializando tabla.");
            renderizarTablaInventario();
        } else if (vista === 'pedidos') {
            console.log("-> Vista Pedidos seleccionada. Inicializando tabla.");
            renderizarTablaPedidos();
        } else if (vista === 'usuarios') {
            console.log("-> Vista Usuarios seleccionada. Inicializando tabla.");
            renderizarTablaUsuarios();
        }  else if (vista === 'reportes') {
            console.log("-> Vista Reportes seleccionada. Calculando métricas.");
            renderizarReportesVentas();
        }      
    }

    console.log(`Cambiando a la vista de Gestión: ${vista}`);
}

function volverAlDashboard() {
    dashboardMenuView.style.display = 'block'; 
    contentArea.style.display = 'none'; 
    console.log("Volviendo al Menú Principal.");
}


function obtenerInventario() {
    const inventario = JSON.parse(localStorage.getItem(KEY_INVENTARIO)) || [];

    if (inventario.length > 0) {
        const lastId = inventario[inventario.length - 1].id;
        const lastNumber = parseInt(lastId.split('-')[1]);
        if (!isNaN(lastNumber) && lastNumber >= prodIdCounter) {
            prodIdCounter = lastNumber + 1;
        }
    }
    return inventario;
}

function renderizarTablaInventario() {
    const inventario = obtenerInventario();
    const container = document.getElementById('inventario-tabla-container');
    if (!container) return;

    if (inventario.length === 0) {
        container.innerHTML = '<p style="color: #999;">Aún no hay productos en el inventario. Agregue uno usando el formulario de arriba.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th style="text-align: right;">Precio (S/.)</th>
                    <th style="text-align: center;">Stock</th>
                    <th style="text-align: center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    inventario.forEach(producto => {
        const estadoStock = producto.stock > 0 ? `<span style="color: #2ecc71;">${producto.stock}</span>` : `<span style="color: #e74c3c; font-weight: bold;">AGOTADO</span>`;
        html += `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td style="text-align: right;">${parseFloat(producto.precio).toFixed(2)}</td>
                <td style="text-align: center;">${estadoStock}</td>
                <td style="text-align: center;">
                    <button onclick="alert('Funcionalidad de Edición para: ${producto.id}')" style="background-color: #f39c12; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer;">Editar</button>
                    <button onclick="alert('Funcionalidad de Eliminación para: ${producto.id}')" style="background-color: #e74c3c; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer; margin-left: 5px;">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function handleCrearProducto(event) {
    event.preventDefault();
    const nombre = document.getElementById('prod-nombre').value;
    const precio = parseFloat(document.getElementById('prod-precio').value);
    const stock = parseInt(document.getElementById('prod-stock').value);
    const categoria = document.getElementById('prod-categoria').value;
    const descripcion = document.getElementById('prod-descripcion').value;

    const newId = `PROD-${prodIdCounter++}`; 

    const nuevoProducto = {
        id: newId,
        nombre: nombre,
        precio: precio.toFixed(2),
        stock: stock,
        categoria: categoria,
        descripcion: descripcion,
    };

    let inventario = obtenerInventario();
    inventario.push(nuevoProducto);
    localStorage.setItem(KEY_INVENTARIO, JSON.stringify(inventario));

    document.getElementById('form-crear-producto').reset();
    renderizarTablaInventario();
    
    alert(`✅ Producto ${newId} (${nombre}) agregado con éxito.`);
    document.getElementById('form-crear-producto-container').style.display = 'none';
    document.getElementById('btn-toggle-crear-producto').textContent = '+ Agregar Nuevo Producto';
    document.getElementById('btn-toggle-crear-producto').style.backgroundColor = '#2ecc71';
}

function toggleCrearProductoForm() {
    const container = document.getElementById('form-crear-producto-container');
    const button = document.getElementById('btn-toggle-crear-producto');

    if (container.style.display === 'none') {
        container.style.display = 'block';
        button.textContent = 'x Cancelar / Ocultar Formulario';
        button.style.backgroundColor = '#f1c40f'; 
        document.getElementById('prod-id').value = `PROD-${prodIdCounter}`;
    } else {
        container.style.display = 'none';
        button.textContent = '+ Agregar Nuevo Producto';
        button.style.backgroundColor = '#2ecc71';
    }
}



function obtenerPedidos() {
    const pedidos = JSON.parse(localStorage.getItem(KEY_HISTORIAL_PEDIDOS)) || [];
    return pedidos;
}


function renderizarTablaPedidos() {
    const filtroEstado = document.getElementById('filtro-estado').value;
    const todosLosPedidos = obtenerPedidos();
    const container = document.getElementById('pedidos-tabla-container');
    const conteo = document.getElementById('pedidos-conteo');
    
    if (!container || !conteo) return;


    const pedidosFiltrados = todosLosPedidos.filter(pedido => {
        if (filtroEstado === 'todos') {
            return true; 
        }
        return pedido.estado === filtroEstado; 
    });

    conteo.textContent = `Mostrando ${pedidosFiltrados.length} pedidos.`;

    if (pedidosFiltrados.length === 0) {
        container.innerHTML = `<p style="color: #999;">No hay pedidos en estado "${filtroEstado}".</p>`;
        return;
    }


    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; text-align: left;">
            <thead style="background-color: #34495e; color: white;">
                <tr>
                    <th style="padding: 12px; width: 10%;">ID Pedido</th>
                    <th style="padding: 12px; width: 15%;">Email Cliente</th>
                    <th style="padding: 12px; width: 15%;">Fecha</th>
                    <th style="padding: 12px; width: 15%; text-align: right;">Total (S/.)</th>
                    <th style="padding: 12px; width: 15%;">Origen</th>
                    <th style="padding: 12px; width: 15%; text-align: center;">Estado</th>
                    <th style="padding: 12px; width: 30%; text-align: center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    pedidosFiltrados.forEach(pedido => {
        const estadoColor = {
            'Pagado': '#2ecc71',
            'Enviado': '#3498db',
            'Entregado': '#8e44ad',
            'Pendiente de Pago': '#f39c12' 
        }[pedido.estado] || '#7f8c8d';

        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${pedido.id}</td>
                <td style="padding: 10px;">${pedido.emailCliente}</td>
                <td style="padding: 10px;">${pedido.fecha}</td>
                <td style="padding: 10px; text-align: right;">${parseFloat(pedido.total).toFixed(2)}</td>
                </td>
                <td style="padding: 10px; text-align: center;">${pedido.origen || 'WEB'}</td>
               
                </td>
                <td style="padding: 10px; text-align: center;">
                    <span style="color: ${estadoColor}; font-weight: bold;">${pedido.estado}</span>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="mostrarDetallesAdmin('${pedido.id}')" style="background-color: #2c3e50; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer;">Ver Detalles</button>
                    <select onchange="actualizarEstadoPedido('${pedido.id}', this.value)" style="padding: 5px; border-radius: 4px; margin-left: 5px;">
                        <option value="">Cambiar Estado</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                    </select>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}


function actualizarEstadoPedido(pedidoId, nuevoEstado) {
    if (!nuevoEstado || nuevoEstado === "") return;

    let pedidos = obtenerPedidos();
    const index = pedidos.findIndex(p => p.id === pedidoId);

    if (index !== -1) {
        pedidos[index].estado = nuevoEstado;
        
 
        localStorage.setItem(KEY_HISTORIAL_PEDIDOS, JSON.stringify(pedidos));
        
        alert(`Estado del pedido ${pedidoId} actualizado a: ${nuevoEstado}`);
        
    
        renderizarTablaPedidos(); 
    } else {
        console.error(`Error: Pedido con ID ${pedidoId} no encontrado.`);
    }
}


function mostrarDetallesAdmin(pedidoId) {
    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);

    if (!pedido) {
        alert("Detalles de pedido no encontrados.");
        return;
    }

    let productosDetalle = '--- Productos Comprados ---\n';
    

    (pedido.productos || []).forEach(p => {
        productosDetalle += `- ${p.nombre} (x${p.cantidad}) - S/. ${(p.cantidad * parseFloat(p.precio)).toFixed(2)}\n`;
    });

    const metodoPagoSeguro = pedido.metodoPago ?? 'NO REGISTRADO';
    
    const detalles = `
--- DETALLES DEL PEDIDO ${pedido.id} ---
Cliente: ${pedido.emailCliente}
Fecha: ${pedido.fecha}
Total: S/. ${parseFloat(pedido.total).toFixed(2)}
Estado: ${pedido.estado}
Método de Pago: ${metodoPagoSeguro.toUpperCase()}
---
${productosDetalle}
    `;

    alert(detalles);
}


    function generarIdPedidoTienda() {
        return `ORD-TND-${Math.floor(100000 + Math.random() * 900000)}`;
    }


    window.agregarFilaProducto = function() {
    const container = document.getElementById('productos-tienda-container');
    const newRow = document.createElement('div');
    newRow.classList.add('producto-fila');
    newRow.style.cssText = 'display: flex; gap: 10px; margin-top: 10px; align-items: center;';
    
    newRow.innerHTML = `
        <input type="text" data-type="nombre" placeholder="Nombre Prod." required style="flex: 3; padding: 8px;">
        <input type="number" data-type="precio" step="0.01" value="1.00" min="0.01" required style="flex: 1; padding: 8px;">
        <input type="number" data-type="cantidad" value="1" min="1" required style="flex: 0.5; padding: 8px;">
        <button type="button" onclick="this.parentNode.remove()" style="background-color: #e74c3c; color: white; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer;">X</button>
    `;
    container.appendChild(newRow);
    }


    function handlePedidoTienda(event) {
    event.preventDefault();

    const emailCliente = document.getElementById('cliente-tienda-email').value || 'TIENDA-00';
    const filasProducto = document.querySelectorAll('#productos-tienda-container .producto-fila');
    let productos = [];
    let totalPedido = 0;
    

    filasProducto.forEach(fila => {
        const nombre = fila.querySelector('[data-type="nombre"]').value;
        const precio = parseFloat(fila.querySelector('[data-type="precio"]').value) || 0;
        const cantidad = parseInt(fila.querySelector('[data-type="cantidad"]').value) || 0;

        if (nombre && cantidad > 0 && precio > 0) {
            productos.push({
                nombre: nombre,
                precio: precio.toFixed(2),
                cantidad: cantidad
            });
            totalPedido += (precio * cantidad);
        }
    });

    if (productos.length === 0) {
        alert("⚠️ Debe añadir al menos un producto válido para registrar la venta.");
        return;
    }

    const ordenId = generarIdPedidoTienda();

    const nuevoPedidoTienda = {
        id: ordenId,
        fecha: new Date().toLocaleString('es-PE', { 
            year: 'numeric', month: '2-digit', day: '2-digit', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        }),
        total: totalPedido.toFixed(2),
        estado: 'Pagado',
        productos: productos,
        metodoPago: 'PAGO EN TIENDA',
        emailCliente: emailCliente,
        origen: 'TIENDA' 
    };

    let historial = obtenerPedidos(); 
    historial.push(nuevoPedidoTienda);
    localStorage.setItem(KEY_HISTORIAL_PEDIDOS, JSON.stringify(historial));

    alert(`✅ Venta TIENDA #${ordenId} de S/. ${totalPedido.toFixed(2)} registrada con éxito.`);
    document.getElementById('form-pedido-tienda').reset();
    

    document.querySelectorAll('#productos-tienda-container .producto-fila').forEach(row => row.remove());
    window.agregarFilaProducto(); 


    renderizarTablaPedidos(); 
}



    document.addEventListener('DOMContentLoaded', () => {
        
     
        const ADMIN_SESSION_KEY = 'admin_logged_in';
        if (localStorage.getItem(ADMIN_SESSION_KEY) !== 'true') {
            alert('Acceso denegado. Por favor, inicie sesión.');
            window.location.href = '../pagina/login_admin.html'; 
            return; 
        }
        console.log("✅ Sesión de administrador verificada.");



        const btnLogout = document.getElementById('btn-cerrar-sesion-admin');
        if(btnLogout) {
            btnLogout.addEventListener('click', () => {
                localStorage.removeItem(ADMIN_SESSION_KEY);
                window.location.href = '../pagina/login_admin.html'; 
            });
        }

       
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('click', () => {
                const moduleName = card.getAttribute('data-module');
                mostrarVista(moduleName);
            });
        });

        const btnVolver = document.getElementById('btn-volver-dashboard');
        if (btnVolver) {
            btnVolver.addEventListener('click', volverAlDashboard);
        }
        
        
        volverAlDashboard(); 
        
   
        const btnToggle = document.getElementById('btn-toggle-crear-producto');
        if (btnToggle) {
            btnToggle.addEventListener('click', toggleCrearProductoForm);
        }
        const formCrear = document.getElementById('form-crear-producto');
        if (formCrear) {
            formCrear.addEventListener('submit', handleCrearProducto);
        }
        
        const filtroEstado = document.getElementById('filtro-estado');
        if (filtroEstado) {
            filtroEstado.addEventListener('change', renderizarTablaPedidos);
        }
        
        const formTienda = document.getElementById('form-pedido-tienda');
        if (formTienda) {
            formTienda.addEventListener('submit', handlePedidoTienda);
        }

        console.log("✅ Admin Dashboard inicializado con todos los listeners cargados.");
    });

   

    const KEY_USUARIOS_REGISTRADOS = 'usuarios_registrados'; 

   
    const USUARIOS_INICIALES = [
        
        { id: 'USER-001', email: 'admin@closet.com', password: 'admin', nombre: 'Admin', rol: 'Administrador', fechaRegistro: '2024-01-01 10:00:00', estado: 'Activo' },
        
        { id: 'USER-002', email: 'cliente@prueba.com', password: '1234', nombre: 'Cliente de Prueba', rol: 'Cliente', fechaRegistro: '2024-05-15 14:30:00', estado: 'Activo' },
        { id: 'USER-003', email: 'cliente2@mail.com', password: '4321', nombre: 'Carlos Ruiz', rol: 'Cliente', fechaRegistro: '2024-08-20 09:10:00', estado: 'Activo' } // Cambiado a Activo por defecto
    ];

    
    function getNextUserId(usuarios) {
      
        const userIds = usuarios
            .map(u => u.id)
            .filter(id => id); 

        let maxNumber = 0;
        
       
        userIds.forEach(id => {
         
            const parts = id.split('-');
            if (parts.length === 2) {
                const number = parseInt(parts[1]);
                if (!isNaN(number) && number > maxNumber) {
                    maxNumber = number;
                }
            }
        });

    
        const nextNumber = maxNumber + 1;
        return 'USER-' + String(nextNumber).padStart(3, '0');
    }



    function obtenerUsuarios() {
        let usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS_REGISTRADOS));
        
        if (!usuarios || usuarios.length === 0) {
      
            localStorage.setItem(KEY_USUARIOS_REGISTRADOS, JSON.stringify(USUARIOS_INICIALES));
            usuarios = USUARIOS_INICIALES;
        }

        return usuarios;
    }


    function handleCrearUsuario(event) {
        event.preventDefault();
        const nombre = document.getElementById('user-nombre-c').value.trim();
        const email = document.getElementById('user-email-c').value.trim();
        const password = document.getElementById('user-password-c').value.trim();
        const rol = document.getElementById('user-rol-c').value;
        const estado = document.getElementById('user-estado-c').value;
        const mensaje = document.getElementById('crear-usuario-mensaje');

        let usuarios = obtenerUsuarios();


        if (usuarios.some(user => user.email === email)) {
            mensaje.textContent = '❌ Error: Este email ya está registrado.';
            mensaje.style.color = '#e74c3c';
            return;
        }


        const nuevoUsuario = {
            id: getNextUserId(usuarios),
            email: email,
            password: password,
            nombre: nombre,
            rol: rol,
            estado: estado,
            fechaRegistro: new Date().toISOString().slice(0, 10)
        };


        usuarios.push(nuevoUsuario);
        localStorage.setItem(KEY_USUARIOS_REGISTRADOS, JSON.stringify(usuarios));
        
        mensaje.textContent = `✅ Usuario ${nuevoUsuario.id} creado con éxito.`;
        mensaje.style.color = '#2ecc71';
        

        document.getElementById('form-crear-usuario').reset();
        renderizarTablaUsuarios();
        

        setTimeout(() => {
            document.getElementById('form-crear-usuario-container').style.display = 'none';
            document.getElementById('btn-toggle-crear-usuario').textContent = '+ Agregar Nuevo Usuario';
            document.getElementById('btn-toggle-crear-usuario').style.backgroundColor = '#2ecc71';
            mensaje.textContent = '';
        }, 1500);
    }


    function renderizarTablaUsuarios() {
        const usuarios = obtenerUsuarios();
        const container = document.getElementById('usuarios-tabla-container'); 

        if (!container) return;

        let html = `
            <button id="btn-toggle-crear-usuario" style="margin-bottom: 15px; padding: 10px 20px; background-color: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">
                + Agregar Nuevo Usuario
            </button>
            
            <div id="form-crear-usuario-container" style="display: none; border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
                <h4>Crear Nuevo Usuario</h4>
                <form id="form-crear-usuario" style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <input type="text" id="user-nombre-c" placeholder="Nombre" required style="flex: 1; min-width: 150px; padding: 8px;">
                    <input type="email" id="user-email-c" placeholder="Email" required style="flex: 1; min-width: 150px; padding: 8px;">
                    <input type="password" id="user-password-c" placeholder="Contraseña" required style="flex: 1; min-width: 150px; padding: 8px;">
                    <select id="user-rol-c" required style="flex: 1; min-width: 100px; padding: 8px;">
                        <option value="Cliente">Cliente</option>
                        <option value="Administrador">Administrador</option>
                    </select>
                    <select id="user-estado-c" required style="flex: 1; min-width: 100px; padding: 8px;">
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <button type="submit" style="padding: 8px 15px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Usuario</button>
                    <div id="crear-usuario-mensaje" style="width: 100%; margin-top: 10px;"></div>
                </form>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; text-align: left;">
                <thead style="background-color: #586071; color: white;">
                    <tr>
                        <th style="padding: 12px; width: 10%;">ID</th>
                        <th style="padding: 12px; width: 20%;">Email</th>
                        <th style="padding: 12px; width: 20%;">Nombre</th>
                        <th style="padding: 12px; width: 10%; text-align: center;">Rol</th>
                        <th style="padding: 12px; width: 10%; text-align: center;">Estado</th>
                        <th style="padding: 12px; width: 30%; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        usuarios.forEach(user => {
          
            const estadoColor = user.estado === 'Activo' ? '#2ecc71' : '#e74c3c';
            const rolColor = user.rol === 'Administrador' ? '#3498db' : '#7f8c8d';

            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${user.id}</td>
                    <td style="padding: 10px;">${user.email}</td>
                    <td style="padding: 10px;">${user.nombre}</td>
                    <td style="padding: 10px; text-align: center;"><span style="color: ${rolColor}; font-weight: bold;">${user.rol}</span></td>
                    <td style="padding: 10px; text-align: center;"><span style="color: ${estadoColor}; font-weight: bold;">${user.estado}</span></td>
                    <td style="padding: 10px; text-align: center;">
                        <button onclick="mostrarFormularioEdicion('${user.id}')" 
                            style="background-color: #f39c12; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer;">
                            Editar (U)
                        </button>
                        <button onclick="cambiarEstadoUsuario('${user.id}', '${user.estado}')" 
                            style="background-color: #e74c3c; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer; margin-left: 5px;">
                            ${user.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                        </button>
                        <button onclick="eliminarUsuario('${user.id}')" 
                            style="background-color: #c0392b; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer; margin-left: 5px;">
                            Eliminar (D)
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
        

        document.getElementById('btn-toggle-crear-usuario').onclick = toggleCrearUsuarioForm;
        document.getElementById('form-crear-usuario').onsubmit = handleCrearUsuario;
    }



    window.mostrarFormularioEdicion = function(userId) {
        const usuarios = obtenerUsuarios();
        const user = usuarios.find(u => u.id === userId);
        if (!user) {
            alert("Usuario no encontrado.");
            return;
        }


        const formHtml = `
            <div id="modal-edicion" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
                <div style="background: white; padding: 30px; border-radius: 8px; width: 400px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <h4>Editar Usuario: ${user.id}</h4>
                    <form id="form-editar-usuario">
                        <input type="hidden" id="edit-id" value="${user.id}">
                        
                        <label>Nombre:</label>
                        <input type="text" id="edit-nombre" value="${user.nombre}" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                        
                        <label>Email:</label>
                        <input type="email" id="edit-email" value="${user.email}" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                        
                        <label>Contraseña (Dejar vacío para no cambiar):</label>
                        <input type="password" id="edit-password" placeholder="••••••••" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                        
                        <label>Rol:</label>
                        <select id="edit-rol" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                            <option value="Cliente" ${user.rol === 'Cliente' ? 'selected' : ''}>Cliente</option>
                            <option value="Administrador" ${user.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
                        </select>
                        
                        <label>Estado:</label>
                        <select id="edit-estado" required style="width: 100%; padding: 8px; margin-bottom: 20px;">
                            <option value="Activo" ${user.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                            <option value="Inactivo" ${user.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                        </select>
                        
                        <button type="submit" style="padding: 10px 15px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Cambios</button>
                        <button type="button" onclick="document.getElementById('modal-edicion').remove()" style="padding: 10px 15px; background-color: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Cancelar</button>
                        <div id="edicion-mensaje" style="margin-top: 10px;"></div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', formHtml);
        document.getElementById('form-editar-usuario').addEventListener('submit', handleEditarUsuario);
    }


    function handleEditarUsuario(event) {
        event.preventDefault();
        
        const id = document.getElementById('edit-id').value;
        const nombre = document.getElementById('edit-nombre').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const password = document.getElementById('edit-password').value.trim(); // Puede estar vacío
        const rol = document.getElementById('edit-rol').value;
        const estado = document.getElementById('edit-estado').value;
        const mensaje = document.getElementById('edicion-mensaje');

        let usuarios = obtenerUsuarios();
        const index = usuarios.findIndex(u => u.id === id);

        if (index === -1) {
            mensaje.textContent = '❌ Error: Usuario no encontrado.';
            mensaje.style.color = '#e74c3c';
            return;
        }

        usuarios[index].nombre = nombre;
        usuarios[index].email = email;
        usuarios[index].rol = rol;
        usuarios[index].estado = estado;
        
        if (password) {
            usuarios[index].password = password; 
        }


        localStorage.setItem(KEY_USUARIOS_REGISTRADOS, JSON.stringify(usuarios));

        mensaje.textContent = '✅ Usuario actualizado con éxito.';
        mensaje.style.color = '#2ecc71';

   
        setTimeout(() => {
            document.getElementById('modal-edicion').remove();
            renderizarTablaUsuarios(); 
        }, 1000);
    }



    window.eliminarUsuario = function(userId) {
        if (!confirm(`⚠️ ¿Está seguro que desea ELIMINAR permanentemente al usuario ${userId}? Esta acción es irreversible.`)) {
            return;
        }
        
        let usuarios = obtenerUsuarios();
        const index = usuarios.findIndex(u => u.id === userId);

        if (index !== -1) {
       
            usuarios.splice(index, 1); 
            localStorage.setItem(KEY_USUARIOS_REGISTRADOS, JSON.stringify(usuarios));
            alert(`✅ Usuario ${userId} eliminado permanentemente.`);
            renderizarTablaUsuarios();
        } else {
            alert('❌ Error: Usuario no encontrado.');
        }
    }



    function toggleCrearUsuarioForm() {
        const container = document.getElementById('form-crear-usuario-container');
        const button = document.getElementById('btn-toggle-crear-usuario');

        if (container.style.display === 'none' || !container.style.display) {
            container.style.display = 'block';
            button.textContent = 'x Cancelar / Ocultar Formulario';
            button.style.backgroundColor = '#f1c40f';
        } else {
            container.style.display = 'none';
            button.textContent = '+ Agregar Nuevo Usuario';
            button.style.backgroundColor = '#2ecc71';
        }
    }

    function calcularMetricasDeVentas() {
        const pedidos = obtenerPedidos().filter(p => p.estado !== 'Pendiente de Pago'); // Solo contar pedidos pagados

        let totalVentas = 0;
        let totalPedidos = pedidos.length;
        let totalProductosVendidos = 0;
        const ventasPorOrigen = { 'WEB': 0, 'TIENDA': 0 };
        const ventasPorCategoria = {};

        pedidos.forEach(pedido => {
            const total = parseFloat(pedido.total) || 0;
            totalVentas += total;


            const origen = pedido.origen || 'WEB';
            ventasPorOrigen[origen] = (ventasPorOrigen[origen] || 0) + total;


            (pedido.productos || []).forEach(prod => {
                const cantidad = parseInt(prod.cantidad) || 0;
                const precio = parseFloat(prod.precio) || 0;
                totalProductosVendidos += cantidad;
                

                const categoriaSimulada = prod.nombre.includes('Vestido') ? 'Vestidos' : 
                                        prod.nombre.includes('Blusa') ? 'Blusas' : 
                                        'Otros'; 
                
                ventasPorCategoria[categoriaSimulada] = (ventasPorCategoria[categoriaSimulada] || 0) + (cantidad * precio);
            });
        });

        return {
            totalVentas: totalVentas.toFixed(2),
            totalPedidos: totalPedidos,
            totalProductosVendidos: totalProductosVendidos,
            ventasPorOrigen: ventasPorOrigen,
            ventasPorCategoria: ventasPorCategoria
        };
    }


    function renderizarReportesVentas() {
        const metricas = calcularMetricasDeVentas();
        const container = document.getElementById('reportes-container'); 

        if (!container) return;


        const categoriasHtml = Object.entries(metricas.ventasPorCategoria)
            .sort(([, a], [, b]) => b - a) 
            .map(([categoria, total]) => `<li>${categoria}: <b>S/. ${parseFloat(total).toFixed(2)}</b></li>`)
            .join('');

     
        const origenHtml = `
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 5px;">Ventas Web: <b>S/. ${parseFloat(metricas.ventasPorOrigen['WEB'] || 0).toFixed(2)}</b></li>
                <li style="margin-bottom: 5px;">Ventas Tienda: <b>S/. ${parseFloat(metricas.ventasPorOrigen['TIENDA'] || 0).toFixed(2)}</b></li>
            </ul>
        `;



        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                
                <div class="report-card" style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>Ventas Totales 💰</h4>
                    <p style="font-size: 2em; color: #2ecc71; font-weight: bold;">S/. ${metricas.totalVentas}</p>
                </div>
                
                <div class="report-card" style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>Total Pedidos ✅</h4>
                    <p style="font-size: 2em; color: #3498db; font-weight: bold;">${metricas.totalPedidos}</p>
                </div>
                
                <div class="report-card" style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>Productos Vendidos 📦</h4>
                    <p style="font-size: 2em; color: #f39c12; font-weight: bold;">${metricas.totalProductosVendidos}</p>
                </div>

            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                
                <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h4>Ventas por Origen (WEB vs. TIENDA)</h4>
                    ${origenHtml}
                </div>

                <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h4>Top Categorías de Venta</h4>
                    <ul style="padding-left: 20px;">
                        ${categoriasHtml.length > 0 ? categoriasHtml : '<li>No hay datos de categorías disponibles.</li>'}
                    </ul>
                </div>

            </div>
        `;
    }