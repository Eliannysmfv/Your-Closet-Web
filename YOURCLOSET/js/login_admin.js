
console.log("🟣 Script login_admin.js cargado correctamente");


const KEY_USUARIOS_REGISTRADOS = 'usuarios_registrados'; 
const ADMIN_SESSION_KEY = 'admin_logged_in';


function obtenerUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS_REGISTRADOS)) || [];
    return usuarios;
}


function handleAdminLogin(event) {
    event.preventDefault(); 
    
    const user = document.getElementById('admin-user').value.trim();
    const password = document.getElementById('admin-pass').value.trim(); 
    const errorDisplay = document.getElementById('admin-error');

    errorDisplay.textContent = ''; 


    const usuarios = obtenerUsuarios();
    

    const usuarioEncontrado = usuarios.find(u => 
        (u.email === user || u.id === user) && u.password === password
    );

    if (usuarioEncontrado && usuarioEncontrado.rol === 'Administrador' && usuarioEncontrado.estado === 'Activo') {
        
    
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        localStorage.setItem('admin_actual_id', usuarioEncontrado.id);
        
        errorDisplay.textContent = '✅ Ingreso Admin exitoso. Redirigiendo...';
        errorDisplay.style.color = '#4CAF50';
        
        setTimeout(() => {
       
            window.location.href = '../pagina/admin_dashboard.html'; 
        }, 800);
        
    } else if (usuarioEncontrado && usuarioEncontrado.rol !== 'Administrador') {
        errorDisplay.textContent = '❌ Credenciales válidas, pero el rol no es de Administrador.';
    } else {
        errorDisplay.textContent = '❌ Credenciales de Administrador incorrectas.';
        document.getElementById('admin-pass').value = ''; 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const formAdmin = document.getElementById('form-login-admin');
    
    if (formAdmin) {
        formAdmin.addEventListener('submit', handleAdminLogin);
    } else {
        console.warn("⚠️ No se encontró el formulario #form-login-admin en el DOM.");
    }
});