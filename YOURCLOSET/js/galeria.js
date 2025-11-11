

const contenedor = document.getElementById('contenedor-productos');

function renderizarGaleria() {
    cargarInventario(); 
    
    if (!contenedor) return; 
    contenedor.innerHTML = ''; 

 
    const url = window.location.href;
   
    const esOfertas = url.includes('#ofertas');
    
    
    const productosAMostrar = inventario.filter(producto => {
        
        if (producto.stock <= 0) return false; 

        if (esOfertas) {
          
            return producto.isOferta === true; 
        } else {
      
            return true;
        }
    });


    const tituloPrincipal = document.querySelector('main h2 strong'); 
    if (tituloPrincipal) {
         tituloPrincipal.textContent = esOfertas ? 'OFERTAS EXCLUSIVAS' : 'NUESTRO CATALOGO';
    }


    if (productosAMostrar.length === 0) {
        contenedor.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 50px;">¡Ups! No hay ' + (esOfertas ? 'ofertas' : 'productos') + ' disponibles para mostrar. Vuelve pronto.</p>';
        return;
    }


    productosAMostrar.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        
   
        card.innerHTML = `
            <img class="imgcambio" 
                    src="${producto.imagen}" 
                    data-src-original="${producto.imagen}" 
                    data-src-over="${producto.imagen}" 
                    alt="${producto.nombre}">
            
            <center>
                
            
                
                <p>${producto.nombre}</p>
                <p class="precio">Precio: S/ ${producto.precio.toFixed(2)}</p>
                
                <div style="display: flex; justify-content: center; gap: 10px; margin: 10px 0; align-items: center;">
                    <label for="qty-${producto.id}">Cantidad:</label>
                    <input type="number" 
                           id="qty-${producto.id}" 
                           value="1" 
                           min="1" 
                           max="${producto.stock}" 
                           style="width: 60px; padding: 5px; text-align: center; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <button class="btn-agregar" 
                        data-id="${producto.id}" 
                        data-nombre="${producto.nombre}" 
                        data-precio="${producto.precio.toFixed(2)}">
                    Añadir al Carrito
                </button>
            </center>
        `;
        contenedor.appendChild(card);
    });
    
 
    if (typeof conectarBotonesCarrito === 'function') {
        conectarBotonesCarrito();
    }
    conectarHoverImagenes();

}

function conectarHoverImagenes() {
    const imgCambio = document.querySelectorAll('.imgcambio');
    imgCambio.forEach(img => {
        const originalSrc = img.getAttribute('data-src-original');
        const overSrc = img.getAttribute('data-src-over'); 

        img.addEventListener('mouseover', () => { img.src = overSrc; });
        img.addEventListener('mouseout', () => { img.src = originalSrc; });
    });
}

function conectarBotonesCarrito() {

    const contenedorProductos = document.getElementById('contenedor-productos');
    
    if (!contenedorProductos) return;

    contenedorProductos.addEventListener('click', (event) => {
        
        const botonAgregar = event.target.closest('.btn-agregar');
        
        if (botonAgregar) {
            const id = botonAgregar.getAttribute('data-id');
            const nombre = botonAgregar.getAttribute('data-nombre');
            const precio = botonAgregar.getAttribute('data-precio'); 
            
        
            const inputCantidad = document.getElementById(`qty-${id}`);
            let cantidad = inputCantidad ? parseInt(inputCantidad.value) : 1;
            
          
            if (typeof agregarAlCarrito === 'function') {
              
                window.agregarAlCarrito(id, nombre, precio, cantidad); 
                
                
                if (inputCantidad) {
                    inputCantidad.value = 1;
                }
            }
        }
    });
}



function desvanecer
()
{
    document.querySelector("#banner").style.opacity="0";
    document.querySelector("#banner").style.transition="all 2s";
    setTimeout("girar()",1500);
}
 var x=0;

function girar() {
    x++;
    if (x > 4) x = 1;
    document.querySelector("#banner").src = "../imagenes/banner/banner/banner" + x + ".png"; 
    document.querySelector("#banner").style.opacity = "100%";
    document.querySelector("#banner").style.transition = "all 2s";
    setTimeout(desvanecer, 1500);
}

document.body.setAttribute("onload","desvanecer(), girar()");





var refranes=[
    "Elige lo mejor para tu pequeña! ¡Descuentos exclusivos en vestidos, conjuntos y accesorios para niñas",
    "Celebra la dulzura de la infancia con nuestras promociones especiales! ¡Compra 2 prendas y llévate la tercera gratisen todo quiere, todo lo pierde", 
    "Por compras mayores a s/ 200 obtén el 10% de descuento!"];

var indice=0;
setInterval(muestra,1500);

function muestra() {
    indice++;
    if(indice>=refranes.length)
    {
        indice=0;
    }
    document.getElementById("salida").innerHTML=refranes[indice];
}


document.addEventListener('DOMContentLoaded', renderizarGaleria);

window.addEventListener('hashchange', renderizarGaleria);




const KEY_CLIENTE_LOGGED_IN = 'cliente_logged_in';


function verificarSesionYAbrirCarrito() {

    const estaLogueado = localStorage.getItem(KEY_CLIENTE_LOGGED_IN) === 'true';

    if (estaLogueado) {

        window.location.href = '../pagina/cliente_dashboard.html'; 
        
    } else {

        window.location.href = '../pagina/login_cliente.html';
    }
}




function agregarAlCarrito(id, nombre, precio, cantidad = 1) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ id, nombre, precio: parseFloat(precio), cantidad });
    }


    localStorage.setItem('carrito', JSON.stringify(carrito));


    actualizarContadorCarrito();


    console.log(`🛍️ Producto agregado:`, { id, nombre, precio, cantidad });
}


function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


     const totalArticulos = carrito.reduce((total, item) => total + item.cantidad, 0);

    const contador = document.getElementById('contador-carrito');
    if (contador) {

     contador.textContent = totalArticulos;
    }

   console.log(`🧮 Total de unidades EN EL BOTÓN: ${totalArticulos}`);
}


document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);
