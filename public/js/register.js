const form = document.getElementById('registerForm')

form.addEventListener('submit', async (e) => {
    e.preventDefault() // para evitar la recarga

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

        if (res.ok) {
            console.log('Registro OK', data)
            
            // Guardar userId y userName en localStorage
            localStorage.setItem('userId', data.user.id)
            localStorage.setItem('userName', data.user.name)

            // redirigir al perfil
            window.location.href ='/profile.html'
        } else {
            console.log(data.message)
            alert(data.message)
        }

    } catch (error) {
        console.error(error)
        alert('Error en la conexión')
    }
})