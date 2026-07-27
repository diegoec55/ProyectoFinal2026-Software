// Obtener datos del localStorage
let userId = localStorage.getItem('userId')
let userRole = localStorage.getItem('userRole')

// Si no existe, redirigir a login
if (!userId) {
    window.location.href = '/login.html'
}

// Ocultar campo de enfermedades si el usuario actual es un cuidador
if (userRole === 'carer') {
    const illnessesGroup = document.getElementById('illnesses-group')
    if (illnessesGroup) illnessesGroup.style.display = 'none'
}

async function loadProfile() {
    try {
        const res = await fetch(`/api/users/${userId}`)
        const user = await res.json()

        // Rellenar los campos con los datos actuales del usuario
        document.getElementById('name').value = user.name || ''
        document.getElementById('lastName').value = user.lastName || ''
        document.getElementById('dni').value = user.dni || ''

        // Formatear la fecha (YYYY-MM-DD) para que el input type="date" la reconozca correctamente
        if (user.birthDate) {
            document.getElementById('birthDate').value = user.birthDate.split('T')[0]
        }

        // Si es paciente, rellenar enfermedades
        if (userRole !== 'carer') {

            const container = document.getElementById('illnesses-container')
            container.innerHTML = ''
            user.illnesses.forEach(illness => {

                const div = document.createElement('div')

                div.innerHTML = `
            <h4>${illness.name}</h4>
            <p>${illness.description}</p>
            ${illness.UserIllness.notes
                        ? `<p><strong>Observaciones:</strong> ${illness.UserIllness.notes}</p>`
                        : ''
                    }
                <hr>
            `
                container.appendChild(div)
            })
        }

    } catch (error) {
        console.error('Error al cargar perfil:', error)
    }
}

async function updateProfile() {
    // Capturar todos los valores editados
    const name = document.getElementById('name').value
    const lastName = document.getElementById('lastName').value
    const dni = document.getElementById('dni').value
    const birthDate = document.getElementById('birthDate').value

    // Estructurar el objeto a enviar al backend
    const updateData = {
        name,
        lastName,
        dni,
        birthDate,
        illnesses: userRole === 'carer' ? null : illnesses
    }

    try {
        const res = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        })

        const data = await res.json()

        // Actualizar el nombre en el localStorage por si cambio y se muestra en el menu/inicio
        if (res.ok && data.user) {
            localStorage.setItem('userName', data.user.name)
        }

        const mensajeElement = document.getElementById('mensaje')
        mensajeElement.textContent = data.message
        mensajeElement.style.color = res.ok ? 'green' : 'red'

    } catch (error) {
        console.error('Error al actualizar perfil:', error)
        document.getElementById('mensaje').textContent = 'Error en la conexión'
        document.getElementById('mensaje').style.color = 'red'
    }
}

async function changePassword() {

    const currentPassword = document.getElementById('currentPassword').value
    const newPassword = document.getElementById('newPassword').value
    const confirmPassword = document.getElementById('confirmPassword').value

    const message = document.getElementById('passwordMessage')

    if (newPassword !== confirmPassword) {
        message.textContent = 'Las contraseñas no coinciden'
        message.style.color = 'red'
        return
    }

    try {

        const res = await fetch(`/api/users/${userId}/password`, {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                currentPassword,
                newPassword
            })

        })

        const data = await res.json()

        message.textContent = data.message
        message.style.color = res.ok ? 'green' : 'red'

        if (res.ok) {
            document.getElementById('currentPassword').value = ''
            document.getElementById('newPassword').value = ''
            document.getElementById('confirmPassword').value = ''
        }

    } catch (error) {

        message.textContent = 'Error de conexión'
        message.style.color = 'red'

    }

}

async function deleteAccount() {

    const confirmar = confirm(
        '¿Está seguro de que desea eliminar su cuenta? Esta acción no podrá deshacerse.'
    )

    if (!confirmar) return

    try {
        const res = await fetch(`/api/users/${userId}/deactivate`, {
            method: 'PUT'
        })

        const data = await res.json()

        alert(data.message)

        if (res.ok) {
            localStorage.clear()
            window.location.href = '/login.html'
        }

    } catch (error) {
        alert('Error de conexión')
    }
}

loadProfile()