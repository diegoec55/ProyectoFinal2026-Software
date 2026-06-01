// Obtener userId del localStorage (guardado al login/registro)
let userId = localStorage.getItem('userId')

// Si no existe, redirigir a login
if (!userId) {
    window.location.href = '/login.html'
}

async function loadProfile() {

    try {

        const res =
            await fetch(`/api/users/${userId}`)

        const user = await res.json()

        document.getElementById('name').value =
            user.name

    } catch (error) {

        console.error(error)
    }
}

async function updateProfile() {

    const name =
        document.getElementById('name').value

    try {

        const res =
            await fetch(`/api/users/${userId}`, {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    name
                })
            })

        const data = await res.json()

        document.getElementById('mensaje')
            .textContent = data.message

    } catch (error) {

        console.error(error)
    }
}

loadProfile()