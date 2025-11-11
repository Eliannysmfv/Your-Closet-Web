
console.log("🟢 Script registro.js cargado correctamente.");

const KEY_USUARIOS_REGISTRADOS = 'usuarios_registrados';
const KEY_CLIENTE_DATA = 'cliente_data';
const KEY_CLIENTE_LOGGED_IN = 'cliente_logged_in';

function getNextUserId(usuarios) {

    const userIds = usuarios
        .map(u => u.id)
        .filter(id => id && id.startsWith('USER-'));

    let maxNumber = 0;
    

    userIds.forEach(id => {
        const number = parseInt(id.split('-')[1]);
        if (!isNaN(number) && number > maxNumber) {
            maxNumber = number;
        }
    });

    const nextNumber = maxNumber + 1;

    return 'USER-' + String(nextNumber).padStart(3, '0');
}



function getUsuariosRegistrados() {
    const usuariosJSON = localStorage.getItem(KEY_USUARIOS_REGISTRADOS);
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}

function setUsuariosRegistrados(usuarios) {
    localStorage.setItem(KEY_USUARIOS_REGISTRADOS, JSON.stringify(usuarios));
}


function handleRegistro(event) {
    event.preventDefault();


    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const passwordConfirm = document.getElementById('reg-password-confirm').value.trim();
    const telefono = document.getElementById('reg-telefono').value.trim();
    const direccion = document.getElementById('reg-direccion').value.trim();
    const registroMensaje = document.getElementById('registro-mensaje');

    registroMensaje.textContent = '';
    registroMensaje.className = 'mensaje'; 


    if (password !== passwordConfirm) {
        registroMensaje.textContent = '❌ Las contraseñas no coinciden.';
        registroMensaje.classList.add('mensaje-error');
        return;
    }

    if (password.length < 6) {
        registroMensaje.textContent = '❌ La contraseña debe tener al menos 6 caracteres.';
        registroMensaje.classList.add('mensaje-error');
        return;
    }

    let usuarios = getUsuariosRegistrados();


    if (usuarios.some(user => user.email === email)) {
        registroMensaje.textContent = '❌ Este email ya está registrado.';
        registroMensaje.classList.add('mensaje-error');
        return;
    }


    const nuevoUsuario = {
        id: getNextUserId(usuarios), 
        email: email,
        password: password, 
        nombre: nombre,
        telefono: telefono || 'N/A', 
        direccion: direccion || 'N/A', 
        rol: 'Cliente', 
        estado: 'Activo', 
        fechaRegistro: new Date().toISOString().slice(0, 10) 
    };

 
    usuarios.push(nuevoUsuario);
    setUsuariosRegistrados(usuarios); 

    
    localStorage.setItem(KEY_CLIENTE_DATA, JSON.stringify(nuevoUsuario)); 
    localStorage.setItem(KEY_CLIENTE_LOGGED_IN, 'true');
    localStorage.setItem('usuario_actual_email', nuevoUsuario.email); 

    
    registroMensaje.textContent = '✅ Registro exitoso. Iniciando sesión...';
    registroMensaje.style.color = '#4b0082';

    document.getElementById('form-registro').reset();


    setTimeout(() => {
     
        localStorage.setItem('limpiar_campos_login', 'true'); 
        window.location.href = 'cliente_dashboard.html';
    }, 1500);
}


document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', handleRegistro);
    }
});