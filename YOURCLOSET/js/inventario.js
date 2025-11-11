
const USER_ADMIN = 'admin';
const PASS_ADMIN = '12345';
const KEY_LOGGED_IN = 'inventario_logged_in';

const RUTA_BASE_INVENTARIO = '../general/';
const RUTA_BASE = RUTA_BASE_INVENTARIO;


const loginContainer = document.getElementById('login-container');
const gestionContainer = document.getElementById('gestion-inventario-container');
const formLogin = document.getElementById('form-login');
const inventarioItems = document.getElementById('inventario-items');


const formProducto = document.getElementById('form-producto');
const vistaPreviaElement = document.getElementById('vista-previa'); 
const nombreArchivoActual = document.getElementById('nombre-archivo-actual'); 
const imagenFile = document.getElementById('imagen-file'); 
const imagenNombreHidden = document.getElementById('imagen-nombre'); 
const proveedorSelect = document.getElementById('proveedor-producto'); 


const formProveedor = document.getElementById('form-proveedor'); 


const errorMensaje = document.getElementById('mensaje-error-inventario'); 


window.mostrarMensajeStatus = function(mensaje, esError = false) {
    if (!errorMensaje) return; 
    
    errorMensaje.textContent = mensaje;
    errorMensaje.style.color = esError ? '#cc0000' : '#38761d'; 
    errorMensaje.style.fontWeight = 'bold';
    errorMensaje.setAttribute('data-showing', 'true');
    
    setTimeout(() => {
        errorMensaje.textContent = '';
        errorMensaje.style.color = '';
        errorMensaje.style.fontWeight = '';
        errorMensaje.removeAttribute('data-showing');
    }, 4000); 
}


function generarNuevoId() {
    window.cargarInventario(); 
    if (window.inventario.length === 0) {
        return 'PROD-1000'; 
    }
    const maxId = window.inventario.reduce((max, prod) => {
        const numPart = prod.id.split('-')[1]; 
        const num = parseInt(numPart) || 0;
        return num > max ? num : max;
    }, 0);
    const nuevoNumero = maxId + 1;
    return `PROD-${nuevoNumero}`;
}


window.handleImageUpload = function(files) {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            imagenNombreHidden.value = base64Image; 
            mostrarVistaPrevia(base64Image, file.name); 
        };
        reader.readAsDataURL(file);
    } else {
        imagenNombreHidden.value = '';
        mostrarVistaPrevia('', ''); 
    }
}

window.mostrarVistaPrevia = function(contenidoImagen, nombreArchivo = '') {
    if (vistaPreviaElement) {
        if (contenidoImagen) {
            const esBase64 = contenidoImagen.startsWith('data:image');
            vistaPreviaElement.src = esBase64 ? contenidoImagen : RUTA_BASE + contenidoImagen;
            vistaPreviaElement.style.display = 'block';
            
            if (nombreArchivoActual) {
                 const displayNombre = esBase64 ? 'Imagen cargada' : nombreArchivo;
                 nombreArchivoActual.textContent = displayNombre.length > 20 ? displayNombre.substring(0, 17) + '...' : displayNombre;
            }
        } else {
            vistaPreviaElement.src = '';
            vistaPreviaElement.style.display = 'none';
            if (nombreArchivoActual) {
                nombreArchivoActual.textContent = '';
            }
        }
    }
}


window.limpiarFormularioInventario = function() {
    document.getElementById('producto-id').value = '';
    document.getElementById('nombre-producto').value = '';
    document.getElementById('categoria-producto').value = ''; 
    document.getElementById('precio-producto').value = '';
    document.getElementById('stock-producto').value = '';

    document.getElementById('stock-minimo').value = 5; 
    document.getElementById('proveedor-producto').value = ''; 
    
    mostrarVistaPrevia(''); 
    if (imagenFile) imagenFile.value = ''; 
    imagenNombreHidden.value = ''; 

    if (!errorMensaje || !errorMensaje.getAttribute('data-showing')) {
        if (errorMensaje) {
            errorMensaje.textContent = ''; 
            errorMensaje.style.color = '';
            errorMensaje.style.fontWeight = '';
        }
    }
}




function cargarProveedoresEnFormulario(productoIdProveedor = '') {
    if (!proveedorSelect) {
        console.error("Elemento 'proveedor-producto' no encontrado.");
        return;
    }
    
    window.cargarProveedores(); 
    
    proveedorSelect.innerHTML = '<option value="">-- Seleccione un Proveedor --</option>';
    
    if (window.proveedores && window.proveedores.length > 0) {
        window.proveedores.forEach(prov => {
            const option = document.createElement('option');
            option.value = prov.id;
            option.textContent = `${prov.nombre} (${prov.contacto})`; 
            
            if (prov.id === productoIdProveedor) {
                option.selected = true;
            }
            proveedorSelect.appendChild(option);
        });
    } else {
        proveedorSelect.innerHTML += '<option value="" disabled>No hay proveedores. Agregue uno primero.</option>';
    }
}

window.cargarProveedoresEnFormulario = function(productoIdProveedor = '') {

    if (!proveedorSelect) {
        console.error("Elemento 'proveedor-producto' no encontrado. Verifique el ID en el HTML y la constante en inventario.js.");
        return;
    }
    

    window.cargarProveedores(); 
    

    proveedorSelect.innerHTML = '<option value="">-- Seleccione un Proveedor --</option>';
    

    if (window.proveedores && window.proveedores.length > 0) {
        window.proveedores.forEach(prov => {
            const option = document.createElement('option');
            option.value = prov.id;
            option.textContent = `${prov.nombre} (${prov.contacto})`; 
            

            if (prov.id === productoIdProveedor) {
                option.selected = true;
            }
            proveedorSelect.appendChild(option);
        });
    } else {
    
        proveedorSelect.innerHTML += '<option value="" disabled>No hay proveedores. Agregue uno primero.</option>';
    }
}


window.limpiarFormularioProveedor = function() {
    const btnGuardarProv = document.getElementById('btn-guardar-prov');
    if (formProveedor) formProveedor.reset();
    const provIdInput = document.getElementById('proveedor-id');
    if (provIdInput) provIdInput.value = ''; 

    if (btnGuardarProv) btnGuardarProv.textContent = '+ Agregar Proveedor';
}


window.editarProveedor = function(id) {
    const btnGuardarProv = document.getElementById('btn-guardar-prov');
    
    window.cargarProveedores(); 
    const proveedor = window.proveedores.find(p => p.id === id);
    
    if (proveedor) {
      
        document.getElementById('proveedor-id').value = proveedor.id;
        
      
        document.getElementById('nombre-empresa').value = proveedor.nombre;
        document.getElementById('contacto-proveedor').value = proveedor.contacto;
        document.getElementById('telefono-proveedor').value = proveedor.telefono;
        document.getElementById('email-proveedor').value = proveedor.email || '';
        
     
        if (btnGuardarProv) btnGuardarProv.textContent = 'Guardar Cambios';
        
      
        window.scrollTo(0, 0); 
    }
}



function guardarProveedor(event) {
    event.preventDefault();

    const id = document.getElementById('proveedor-id').value; 
    const nombre = document.getElementById('nombre-empresa').value.trim();
    const contacto = document.getElementById('contacto-proveedor').value.trim();
    const telefono = document.getElementById('telefono-proveedor').value.trim();
    const email = document.getElementById('email-proveedor').value.trim();

    if (!nombre || !contacto || !telefono) {
        window.mostrarMensajeStatus('❌ Por favor, complete los campos obligatorios del proveedor.', true);
        return;
    }
    
    const proveedorData = { nombre, contacto, telefono, email };
    let mensaje;
    let proveedorExistente = window.proveedores.find(p => p.id === id); 

    if (proveedorExistente) {
       
        Object.assign(proveedorExistente, proveedorData); 
        mensaje = `✅ Proveedor ${nombre} actualizado con éxito.`;
    } else {
        const nuevoId = window.generarNuevoIdProveedor(); 
        const nuevoProveedor = { id: nuevoId, ...proveedorData };
        window.proveedores.push(nuevoProveedor); 
        mensaje = `✅ Proveedor ${nombre} agregado con éxito. ID: ${nuevoId}`;
    }

    window.guardarProveedores(); 
    
    window.mostrarMensajeStatus(mensaje, false);
    
    if (window.renderizarProveedores) window.renderizarProveedores(); 
    cargarProveedoresEnFormulario(); 
    window.limpiarFormularioProveedor(); 
}



function guardarProducto(event) {
    event.preventDefault();

    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('nombre-producto').value.trim();
    const categoria = document.getElementById('categoria-producto').value;
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const stock = parseInt(document.getElementById('stock-producto').value);
    const stockMinimo = parseInt(document.getElementById('stock-minimo').value);
    const id_proveedor = document.getElementById('proveedor-producto').value;
    
    let imagenData = imagenNombreHidden.value.trim(); 
    errorMensaje.textContent = ''; 

    let productoExistente = window.inventario.find(p => p.id === id); 

    if (productoExistente && imagenFile && imagenFile.files.length === 0) {
        imagenData = productoExistente.imagen; 
    } 

    if (!nombre || !categoria || isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0 || isNaN(stockMinimo) || stockMinimo < 1 || !id_proveedor) {
        mostrarMensajeStatus('❌ Por favor, complete todos los campos (Nombre, Categoría, Stock, Proveedor).', true);
        return;
    }
     if (!imagenData) {
        mostrarMensajeStatus('❌ Por favor, suba/seleccione una imagen para el producto.', true);
        return;
     }

    const nuevoProductoData = {
        nombre, categoria, precio, stock, stockMinimo, id_proveedor, imagen: imagenData 
    };

    let mensaje;

    if (productoExistente) {
        Object.assign(productoExistente, nuevoProductoData);
        mensaje = '✅ Producto actualizado con éxito.';
    } else {
        const nuevoProducto = { id: generarNuevoId(), ...nuevoProductoData };
        window.inventario.push(nuevoProducto);
        mensaje = '✅ Producto agregado con éxito. ID: ' + nuevoProducto.id;
    }

    window.guardarInventario(); 
    renderizarInventario();
    limpiarFormularioInventario();
    
    mostrarMensajeStatus(mensaje, false);
}


window.editarProducto = function(id) { 
    const producto = window.inventario.find(p => p.id === id);
    if (producto) {
        limpiarFormularioInventario(); 

        document.getElementById('producto-id').value = producto.id;
        document.getElementById('nombre-producto').value = producto.nombre;
        document.getElementById('categoria-producto').value = producto.categoria; 
        document.getElementById('precio-producto').value = producto.precio;
        document.getElementById('stock-producto').value = producto.stock;
        document.getElementById('stock-minimo').value = producto.stockMinimo || 5; 
        
        cargarProveedoresEnFormulario(producto.id_proveedor); 

        imagenNombreHidden.value = producto.imagen || '';
        mostrarVistaPrevia(producto.imagen, producto.imagen); 
        
        if (imagenFile) imagenFile.value = ''; 
        
        window.scrollTo(0, 0); 
    }
}

window.eliminarProducto = function(id) { 
    if (confirm('¿Está seguro de que desea eliminar este producto del inventario?')) {
        window.inventario = window.inventario.filter(p => p.id !== id);
        window.guardarInventario(); 
        renderizarInventario();
        mostrarMensajeStatus('✅ Producto eliminado con éxito.', false);
        limpiarFormularioInventario(); 
    }
}

function renderizarInventario() {
    if (!inventarioItems) return; 
    inventarioItems.innerHTML = '';
    
    window.cargarInventario(); 
    window.inventario.sort((a, b) => a.id.localeCompare(b.id)); 
    
    window.inventario.forEach(item => {
        const filaClase = (item.stock <= item.stockMinimo) ? 'alerta-stock' : '';
        
        const fila = document.createElement('tr');
        fila.className = filaClase; 
        
        let srcImagen = item.imagen ? item.imagen : ''; 
        if (srcImagen && !srcImagen.startsWith('data:image')) {
             srcImagen = RUTA_BASE + srcImagen; 
        }
        
        const proveedorInfo = window.getProveedorById(item.id_proveedor); 
        
        fila.innerHTML = `
            <td>${srcImagen ? `<img src="${srcImagen}" alt="${item.nombre}" style="width:50px; height:auto;">` : 'N/A'}</td>
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td>${item.categoria || 'N/A'}</td> 
            <td>S/. ${item.precio.toFixed(2)}</td>
            <td>${item.stock}</td>
            <td>${proveedorInfo ? proveedorInfo.nombre : 'N/A'}</td> 
            <td>
                <button onclick="editarProducto('${item.id}')" class="btn-editar">Editar</button>
                <button onclick="eliminarProducto('${item.id}')" class="btn-eliminar">Eliminar</button>
            </td>
        `;
        inventarioItems.appendChild(fila);
    });
}



function showGestionView() {
    if (loginContainer) loginContainer.style.display = 'none';
    if (gestionContainer) gestionContainer.style.display = 'block';
    
    window.cargarProveedores(); 
    cargarProveedoresEnFormulario(); 
    
    
    const rutaBaseAdminElement = document.getElementById('ruta-base-admin');
    if (rutaBaseAdminElement) rutaBaseAdminElement.textContent = RUTA_BASE;
    
    renderizarInventario();
    if (window.renderizarProveedores) window.renderizarProveedores(); 
}

function showLoginView() {
    if (loginContainer) loginContainer.style.display = 'block'; 
    if (gestionContainer) gestionContainer.style.display = 'none';
    if (formLogin) formLogin.reset();
}

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();

    if (user === USER_ADMIN && pass === PASS_ADMIN) {
        localStorage.setItem(KEY_LOGGED_IN, 'true');
        showGestionView();
    } else {
        alert('Credenciales incorrectas. (Usuario: admin / Contraseña: 12345)');
        if (formLogin) formLogin.reset();
    }
}


function volverAInventario() {

    window.location.href = 'inventario_login.html?r=' + new Date().getTime();
}



window.logoutInventario = function() { 
    localStorage.setItem(KEY_LOGGED_IN, 'false'); 
    showLoginView();
}
    

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem(KEY_LOGGED_IN) === 'true';
    if (isLoggedIn) {
        showGestionView();
    } else {
        showLoginView(); 
    }

    if (formLogin) formLogin.addEventListener('submit', handleLogin);
    if (formProducto) formProducto.addEventListener('submit', guardarProducto);
    if (formProveedor) formProveedor.addEventListener('submit', guardarProveedor);
});