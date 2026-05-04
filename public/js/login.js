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
        } else {
            console.log(data.message)
        }

    } catch (error) {
        console.error(error)
    }
})