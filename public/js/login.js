const form = document.getElementById('loginForm')

form.addEventListener('submit', async (e) => {
    e.preventDefault() // para evitar la recarga

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (res.ok) {
            console.log('Login OK', data)

            // Guardar userId y userName en localStorage
            localStorage.setItem('userId', data.user.id)
            localStorage.setItem('userName', data.user.name)

            // redirigir al perfil
            window.location.href ='/index.html'
        } else {
            console.log(data.message)
            alert(data.message)
        }

    } catch (error) {
        console.error(error)
    }
})