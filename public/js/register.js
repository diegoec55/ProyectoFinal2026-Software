const form = document.getElementById('registerForm')
const roleSelect = document.getElementById('role')
const illnessesGroup = document.getElementById('illnesses-group')
const illnessesContainer = document.getElementById('illnesses-container')
const phoneGroup = document.getElementById('phone-group')
const patientDniGroup = document.getElementById('patient-dni-group')

// Cargar enfermedades desde la base de datos

async function loadIllnesses() {

    try {
        const res = await fetch('/api/illnesses')
        const illnesses = await res.json()

        illnessesContainer.innerHTML = ''
        illnesses.forEach(illness => {
            const div = document.createElement('div')
            div.className = 'illness-item'
            div.innerHTML = `
                <label style="display:block; margin-top:10px;">
                    <input
                        type="checkbox"
                        class="illness-checkbox"
                        value="${illness.id}">
                    <strong>${illness.name}</strong>
                </label>

                <small style="display:block; margin-left:20px; margin-bottom:8px;">
                    ${illness.description}
                </small>

                <textarea
                    class="illness-note"
                    data-id="${illness.id}"
                    placeholder="Observaciones (opcional)"
                    rows="2"
                    style="display:none; width:100%; margin-bottom:10px;">
                </textarea>
            `
            illnessesContainer.appendChild(div)
        })

        // Mostrar u ocultar observaciones
        document.querySelectorAll('.illness-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const textarea = document.querySelector(
                    `.illness-note[data-id="${checkbox.value}"]`
                )
                textarea.style.display = checkbox.checked ? 'block' : 'none'

                if (!checkbox.checked) {
                    textarea.value = ''
                }
            })
        })

    } catch (error) {
        console.error('Error al cargar enfermedades:', error)
    }
}

// Ocultar o mostrar el campo de enfermedades según el rol seleccionado
roleSelect.addEventListener('change', () => {
    if (roleSelect.value === 'carer') {
        illnessesGroup.style.display = 'none'
        illnessesTextarea.value = '' // Limpia el texto si había algo escrito

        phoneGroup.style.display = 'block'
        patientDniGroup.style.display = 'block'
    } else {
        illnessesGroup.style.display = 'block'

        phoneGroup.style.display = 'none'
        patientDniGroup.style.display = 'none'

        document.getElementById('phone').value = ''
        document.getElementById('patientDni').value = ''
    }
})
// Ejecutar al cargar la pagina
roleSelect.dispatchEvent(new Event('change'))

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
    const phone = document.getElementById('phone').value
    const patientDni = document.getElementById('patientDni').value

    if (role === 'carer') {

        if (!phone.trim()) {
            alert('Ingrese un teléfono.')
            return
        }

        if (!patientDni.trim()) {
            alert('Ingrese el DNI del paciente.')
            return
        }

    }


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
                illnesses: role === 'user' ? illnesses : null, // Solo envia enfermedades si es usuario
                phone: role === 'carer' ? phone : null,
                patientDni: role === 'carer' ? patientDni : null
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