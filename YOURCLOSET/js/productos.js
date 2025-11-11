
const KEY_INVENTARIO = 'inventario_productos';
const KEY_PROVEEDORES = 'inventario_proveedores';


const RUTA_INVIERNO = '../general/invierno/'; 
const RUTA_NAVIDAD = '../general/navidad/';   
const RUTA_VERANO = '../general/verano/';     
const RUTA_NUEVA_COLECCION = '../general/nuevacoleccion/'; 
const RUTA_OFERTAS = '../general/ofertas/';
const RUTA_BASE_IMAGENES = RUTA_INVIERNO;



let proveedores = [
    { id: 'PROV-100', nombre: 'Textiles del Norte', contacto: 'Ana López', telefono: '987654321', email: 'analo@tn.com' },
    { id: 'PROV-101', nombre: 'Moda Rápida SAC', contacto: 'Carlos Díaz', telefono: '999888777', email: 'carlos@mr.com' },
];

let inventario = [

//

    { 
        id: 'PROD-1000', 
        nombre: 'Vestido Flor Morada', 
        categoria: 'Vestidos', 
        precio: 59.90, 
        stock: 12, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_INVIERNO + 'foto1.jpg', 
        isOferta: false 
    },
    { 
        id: 'PROD-1001', 
        nombre: 'Pantalón Negro Básico', 
        categoria: 'Pantalones', 
        precio: 79.90, 
        stock: 10, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-101', 
        imagen: RUTA_INVIERNO + 'foto9.jpg', 
        isOferta: false 
    },
    

    { 
        id: 'PROD-1002', 
        nombre: 'Vestido Rojo Festivo', 
        categoria: 'Vestidos', 
        precio: 85.00, 
        stock: 8, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_NAVIDAD + 'imagen6.jpg', 
        isOferta: false 
    },
    { 
        id: 'PROD-1003', 
        nombre: 'Conjunto Azul Marino', 
        categoria: 'Conjuntos', 
        precio: 120.50, 
        stock: 5, 
        stockMinimo: 3, 
        id_proveedor: 'PROV-101', 
        imagen: RUTA_NAVIDAD + 'imagen8.jpg', 
        isOferta: false 
    },
    

    { 
        id: 'PROD-1004', 
        nombre: 'Top Verano Rayas', 
        categoria: 'Tops', 
        precio: 35.00, 
        stock: 15, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_VERANO + 'verano1.jpg', 
        isOferta: false 
    },

     { 
        id: 'PROD-1000', 
        nombre: 'Vestido Flor Morada', 
        categoria: 'Vestidos', 
        precio: 59.90, 
        stock: 12, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_INVIERNO + 'foto5.jpg', 
        isOferta: false 
    },
    { 
        id: 'PROD-1001', 
        nombre: 'Pantalón Negro Básico', 
        categoria: 'Pantalones', 
        precio: 79.90, 
        stock: 10, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-101', 
        imagen: RUTA_INVIERNO + 'foto2.jpg',
        isOferta: false 
    },
    

    { 
        id: 'PROD-1002', 
        nombre: 'Vestido Rojo Festivo', 
        categoria: 'Vestidos', 
        precio: 85.00, 
        stock: 8, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_NAVIDAD + 'imagen14.jpg', 
        isOferta: false 
    },
    { 
        id: 'PROD-1003', 
        nombre: 'Conjunto Azul Marino', 
        categoria: 'Conjuntos', 
        precio: 120.50, 
        stock: 5, 
        stockMinimo: 3, 
        id_proveedor: 'PROV-101', 
        imagen: RUTA_NAVIDAD + 'imagen10.jpg', 
        isOferta: false 
    },
    

    { 
        id: 'PROD-1004', 
        nombre: 'Top Verano Rayas', 
        categoria: 'Tops', 
        precio: 35.00, 
        stock: 15, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_VERANO + 'verano9.jpg', 
        isOferta: false 
    },
        { 
        id: 'PROD-1003', 
        nombre: 'Conjunto Azul Marino', 
        categoria: 'Conjuntos', 
        precio: 120.50, 
        stock: 5, 
        stockMinimo: 3, 
        id_proveedor: 'PROV-101', 
        imagen: RUTA_NAVIDAD + 'imagen12.jpg', 
        isOferta: false 
    },
    
 
    { 
        id: 'PROD-1004', 
        nombre: 'Top Verano Rayas', 
        categoria: 'Tops', 
        precio: 35.00, 
        stock: 15, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_VERANO + 'verano11.jpg', 
        isOferta: false 
    },


    //
    { 
        id: 'PROD-1005', 
        nombre: 'Vestido Básico en Liquidación', 
        categoria: 'Vestidos', 
        precio: 45.00, 
        stock: 30, 
        stockMinimo: 10, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_OFERTAS + 'imagen1.jpg', 
        isOferta: true 
    },
    { 
        id: 'PROD-1006', 
        nombre: 'Polera Deportiva 2x1', 
        categoria: 'Tops', 
        precio: 55.00, 
        stock: 50, 
        stockMinimo: 10, 
        id_proveedor: 'PROV-101', 
        imagen: RUTA_OFERTAS + 'conjuntos1.jpg', 
        isOferta: true 
    },
    
   
    { 
        id: 'PROD-1007', 
        nombre: 'Falda de Invierno 50% OFF', 
        categoria: 'Faldas', 
        precio: 60.00, 
        stock: 12, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_OFERTAS + 'conjunto2.jpg', 
        isOferta: true 
    },
     { 
        id: 'PROD-1007', 
        nombre: 'Falda de Invierno 50% OFF', 
        categoria: 'Faldas', 
        precio: 60.00, 
        stock: 12, 
        stockMinimo: 5, 
        id_proveedor: 'PROV-100', 
        imagen: RUTA_OFERTAS + 'foto16.jpg',
        isOferta: true 
    },





   
];


window.cargarProveedores = function() {
    const proveedoresJSON = localStorage.getItem(KEY_PROVEEDORES);
    if (proveedoresJSON) {
        proveedores = JSON.parse(proveedoresJSON);
    } else {
        window.guardarProveedores();
    }
}

window.guardarProveedores = function() {
    localStorage.setItem(KEY_PROVEEDORES, JSON.stringify(proveedores));
}

window.getProveedorById = function(id) {
    window.cargarProveedores(); 
    const prov = proveedores.find(p => p.id === id);
    return prov || null;
}

window.generarNuevoIdProveedor = function() {
    window.cargarProveedores(); 
    if (proveedores.length === 0) {
        return 'PROV-100'; 
    }
    
    const maxId = proveedores.reduce((max, prov) => {
        const num = parseInt(prov.id.replace('PROV-', '')) || 0;
        return num > max ? num : max;
    }, 0);
    
    const nuevoNumero = maxId + 1;
    return `PROV-${nuevoNumero}`;
}



window.cargarInventario = function() {
    const inventarioJSON = localStorage.getItem(KEY_INVENTARIO);
    if (inventarioJSON) {
        inventario = JSON.parse(inventarioJSON);
    } else {
        window.guardarInventario();
    }
}

window.guardarInventario = function() {
    localStorage.setItem(KEY_INVENTARIO, JSON.stringify(inventario));
}


const tablaProveedores = document.getElementById('proveedores-registrados'); 

window.renderizarProveedores = function() {
    if (!tablaProveedores) return; 
    
    window.cargarProveedores();
    tablaProveedores.innerHTML = ''; 
    
    window.proveedores.forEach(prov => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${prov.id}</td>
            <td>${prov.nombre}</td>
            <td>${prov.contacto}</td>
            <td>${prov.telefono}</td>
            <td>${prov.email}</td>
            <td>
                
                <button onclick="window.editarProveedor('${prov.id}')" class="btn-editar-prov">Editar</button>
                <button onclick="window.eliminarProveedor('${prov.id}')" class="btn-eliminar">Eliminar</button>
            </td>
        `;
        tablaProveedores.appendChild(fila);
    });
}

window.eliminarProveedor = function(id) {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
        window.proveedores = window.proveedores.filter(p => p.id !== id);
        window.guardarProveedores();
        window.renderizarProveedores();
        

        if (window.mostrarMensajeStatus) {
            window.mostrarMensajeStatus('✅ Proveedor eliminado con éxito.', false);
        }
    }
}



window.cargarInventario();
window.cargarProveedores();
window.RUTA_BASE_IMAGENES = RUTA_BASE_IMAGENES;
window.inventario = inventario; 
window.proveedores = proveedores;