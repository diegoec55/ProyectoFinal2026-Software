const currentUserId = localStorage.getItem('userId')
const currentUserRole = localStorage.getItem('userRole')
const currentUserName = localStorage.getItem('userName')

// Seguridad basica en Frontend: si no es admin, fuera
if (!currentUserId || currentUserRole !== 'admin') {
    window.location.href = '/index.html'
} else {
    document.getElementById('admin-name').textContent = `Admin: ${currentUserName}`
}

let carersList = []

async function initAdminPanel() {
    try {
        // 1. Cargar primero todos los cuidadores disponibles
        const carersRes = await fetch('/api/carers')
        carersList = await carersRes.json()

        // 2. Cargar todos los usuarios (pacientes) para listarlos
        const usersRes = await fetch('/api/users') 
        const allUsers = await usersRes.json()

        // Filtrar para mostrar solo los que tengan rol 'user' (pacientes)
        const patients = allUsers.filter(u => u.role === 'user')

        renderManagementTable(patients)
    } catch (error) {
        console.error('Error inicializando panel de administración:', error)
    }
}

function renderManagementTable(patients) {
    const tableBody = document.getElementById('management-table')
    tableBody.innerHTML = ''

    if (patients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay pacientes registrados.</td></tr>'
        return
    }

    patients.forEach(patient => {
        // Crear el elemento select dinamicamente para cada fila
        let optionsHTML = '<option value="">-- Sin cuidador --</option>'
        carersList.forEach(carer => {
            const isSelected = patient.carerId === carer.id ? 'selected' : ''
            optionsHTML += `<option value="${carer.id}" ${isSelected}>${carer.name} ${carer.lastName}</option>`
        })

        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${patient.name} ${patient.lastName}</td>
            <td>${patient.dni || 'N/A'}</td>
            <td><small>${patient.illnesses || 'Ninguna detallada'}</small></td>
            <td>
                <select id="select-carer-${patient.id}" style="padding: 5px;">
                    ${optionsHTML}
                </select>
            </td>
            <td>
                <button onclick="assignCarer(${patient.id})" style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                    Asignar
                </button>
            </td>
        `
        tableBody.appendChild(tr)
    })
}

async function assignCarer(patientId) {
    const selectElement = document.getElementById(`select-carer-${patientId}`)
    const selectedCarerId = selectElement.value || null // Si esta vacío mandamos null para desasignar

    try {
        // Reutilizamos el endpoint PUT de actualización de usuario que ya procesa el carerId
        const res = await fetch(`/api/users/${patientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                carerId: selectedCarerId
            })
        })

        const data = await res.json()
        const messageElement = document.getElementById('admin-message')
        
        if (res.ok) {
            messageElement.textContent = `Cuidador actualizado con éxito para el paciente.`
            messageElement.style.color = 'green'
        } else {
            messageElement.textContent = `Error: ${data.message}`
            messageElement.style.color = 'red'
        }

        // Limpiar el mensaje despues de 3 segundos
        setTimeout(() => { messageElement.textContent = '' }, 3000)

    } catch (error) {
        console.error('Error al asignar cuidador:', error)
    }
}

initAdminPanel()