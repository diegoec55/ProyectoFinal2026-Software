const form = document.getElementById('registerForm')
const roleSelect = document.getElementById('role')
const illnessesTextarea = document.getElementById('illnesses')

// Ocultar o mostrar el campo de enfermedades según el rol seleccionado
roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'carer') {
        illnessesTextarea.style.display = 'none'
        illnessesTextarea.value = '' // Limpia el texto si había algo escrito
    } else {
        illnessesTextarea.style.display = 'block'
    }
})

form.addEventListener('submit', async (e) => {
    e.preventDefault() // para evitar la recarga

    // Captura de todos los campos del formulario
    const name = document.getElementById('name').value
    const lastName = document.getElementById('lastName').value
    const dni = document.getElementById('dni').value
    const birthDate = document.getElementById('birthDate').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const role = roleSelect.value
    const illnesses = illnessesTextarea.value

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                lastName,
                dni,
                birthDate,
                email,
                password,
                role,
                illnesses: role === 'user' ? illnesses : null // Solo envia enfermedades si es usuario
            })
        })

        const data = await res.json()

        if (res.ok) {
            console.log('Registro OK', data)
            
            // Guardar datos clave en localStorage
            localStorage.setItem('userId', data.user.id)
            localStorage.setItem('userName', data.user.name)
            localStorage.setItem('userRole', data.user.role) // Guardamos el rol para usarlo en el frontend

            // redirigir al perfil o pantalla principal
            window.location.href = '/index.html'
        } else {
            console.log(data.message)
            alert(data.message)
        }

    } catch (error) {
        console.error(error)
        alert('Error en la conexión')
    }
})