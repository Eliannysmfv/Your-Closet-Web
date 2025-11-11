
console.log("🟣 Script login_cliente.js cargado correctamente");


const KEY_CLIENTE_LOGGED_IN = 'cliente_logged_in';
const KEY_USUARIOS_REGISTRADOS = 'usuarios_registrados';
const KEY_LIMPIAR_CAMPOS = 'limpiar_campos_login'; 


function limpiarCamposLogin() {

    const debeLimpiar = localStorage.getItem(KEY_LIMPIAR_CAMPOS);

    if (debeLimpiar === 'true') {
        const emailField = document.getElementById('cliente-email');
        const passwordField = document.getElementById('cliente-password');

        if (emailField) {
            emailField.value = '';
        }
        if (passwordField) {
            passwordField.value = '';
        }
        
    
        localStorage.removeItem(KEY_LIMPIAR_CAMPOS);
        console.log("🧹 Campos de login limpiados y bandera eliminada.");
    }
}



function handleClientLogin(event)
{
    event.preventDefault();
    
    console.log("🚀 handleClientLogin() ejecutándose...");
    const email = document.getElementById('cliente-email').value.trim();
    const password = document.getElementById('cliente-password').value.trim();
    const errorDisplay = document.getElementById('cliente-error');
    
    errorDisplay.textContent = '';
    

    const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS_REGISTRADOS)) || [];
    

    const usuarioEncontrado = usuarios.find(user => 
        user.email === email && user.password === password && user.rol === 'Cliente' && user.estado === 'Activo'
    );
    
    if (usuarioEncontrado)
    {
        
    
        localStorage.setItem(KEY_CLIENTE_LOGGED_IN, 'true');
        localStorage.setItem('usuario_actual_email', usuarioEncontrado.email);
        
 
        const datosCliente =
        {
            id: usuarioEncontrado.id, 
            nombre: usuarioEncontrado.nombre,
            email: usuarioEncontrado.email,
            telefono: usuarioEncontrado.telefono || 'N/A',
            direccion: usuarioEncontrado.direccion || 'N/A'
        };
        localStorage.setItem('cliente_data', JSON.stringify(datosCliente));
        
        errorDisplay.textContent= '✅ Ingreso exitoso. Redirigiendo...';
        errorDisplay.style.color= '#4CAF50';
        
   
        setTimeout(()=> {
            window.location.href= 'cliente_dashboard.html';
        }, 800);
        
    } else if (usuarios.find(user => user.email === email && user.rol === 'Administrador')) {
       
        errorDisplay.textContent = '❌ Credenciales válidas, pero debes usar la sección de Login de Administrador.';
        errorDisplay.style.color= '#e74c3c';
    } else {

        errorDisplay.textContent= '❌ Credenciales de Cliente incorrectas o cuenta inactiva.';
        errorDisplay.style.color= '#e74c3c';
        document.getElementById('cliente-password').value= '';
    }
}



document.addEventListener('DOMContentLoaded', () => {

    console.log("🧩 DOMContentLoaded ejecutado (login_cliente.js)");
    

    limpiarCamposLogin(); 


    const formCliente = document.getElementById('form-login-cliente');

    if (formCliente) {
        formCliente.addEventListener('submit', handleClientLogin);
        console.log("✅ Listener del formulario agregado correctamente.")

    } else {
        console.warn("⚠️ No se encontró el formulario #form-login-cliente en el DOM.");
    }
});