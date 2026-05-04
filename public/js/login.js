async function login() {
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
            document.getElementById('mensaje').textContent = 'Login OK'
            console.log(data)
        } else {
            document.getElementById('mensaje').textContent = data.message
        }

    } catch (error) {
        console.error(error)
    }
}