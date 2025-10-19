// Restablecer contraseña usando token

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resetPasswordForm');
    const msg = document.getElementById('resetPasswordMsg');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const correo = document.getElementById('correoReset').value;
            const token = document.getElementById('tokenReset').value;
            const nuevaPassword = document.getElementById('nuevaPassword').value;
            msg.textContent = '';
            try {
                const res = await fetch(`${API_BASE_URL}/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, token, nuevaPassword })
                });
                const data = await res.json();
                if (res.ok) {
                    msg.textContent = 'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.';
                    msg.className = 'info-message success';
                } else {
                    msg.textContent = data.error || 'Error al restablecer contraseña';
                    msg.className = 'info-message error';
                }
            } catch (err) {
                msg.textContent = 'Error de conexión con el servidor';
                msg.className = 'info-message error';
            }
        });
    }
});
