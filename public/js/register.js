const form = document.getElementById('registerForm')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })

        const data = await res.json()

        const mensaje = document.getElementById('message')

        if (res.ok) {
            mensaje.textContent = 'Usuario registrado correctamente'

            // redirigir al perfil
            window.location.href =
                `/profile.html?id=${data.user.id}`
        } else {
            mensaje.textContent = data.message
        }

    } catch (error) {
        console.error(error)
    }
})