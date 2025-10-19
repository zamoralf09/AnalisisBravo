// Recuperar contraseña - Solicitar token

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('solicitarTokenForm');
    const msg = document.getElementById('solicitarTokenMsg');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const correo = document.getElementById('correoRecuperar').value;
            msg.textContent = '';
            try {
                const res = await fetch(`${API_BASE_URL}/recuperar-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo })
                });
                const data = await res.json();
                if (res.ok) {
                    msg.textContent = 'Token generado. Solicita al administrador el token.';
                    msg.className = 'info-message success';
                } else {
                    msg.textContent = data.error || 'Error al solicitar token';
                    msg.className = 'info-message error';
                }
            } catch (err) {
                msg.textContent = 'Error de conexión con el servidor';
                msg.className = 'info-message error';
            }
        });
    }
});
