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
let patientsList = []

async function initAdminPanel() {

    carersList = []
    
    try {
        // 1. Cargar primero todos los cuidadores disponibles
        const carersRes = await fetch('/api/carers')
        carersList = await carersRes.json()

        // 2. Cargar todos los usuarios (pacientes) para listarlos
        const usersRes = await fetch('/api/users')
        const allUsers = await usersRes.json()

        // Filtrar para mostrar solo los que tengan rol 'user' (pacientes)
        const patients = allUsers.filter(u => u.role === 'user')

        // Guardamos la lista para usarla en la tabla de dispositivos
        patientsList = patients

        //tablas
        renderManagementTable(patients)
        renderUsersTable(allUsers)

        //TABLA DISPOSITIVOS---------
        const devicesRes = await fetch('/api/devices')
        const devices = await devicesRes.json()

        renderDevicesTable(devices)

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

// NUEVA TABLA
function renderUsersTable(users) {
    const tableBody = document.getElementById('users-table')
    tableBody.innerHTML = ''

    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No hay usuarios registrados.
                </td>
            </tr>
        `
        return
    }
    users.forEach(user => {
        // Estado del usuario
        const status = user.isActive ? 'Activo' : 'Eliminado'
        // Nombre del cuidador
        const carer =
            user.carer
                ? `${user.carer.name} ${user.carer.lastName}`
                : '-'
        // Enfermedades
        let illnesses = '-'
        if (user.illnesses && user.illnesses.length > 0) {
            illnesses = user.illnesses
                .map(i => i.name)
                .join(', ')
        }

        let actions = `
            <button onclick="editUser(${user.id})">
                Editar
            </button>
        `

                if (user.isActive) {
                    actions += `
                <button onclick="deleteUser(${user.id})">
                    Eliminar
                </button>
            `
                } else {
                    actions += `
                <button disabled>
                    Eliminado
                </button>
            `
        }
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${status}</td>
            <td>${carer}</td>
            <td>${illnesses}</td>
            <td>
                ${actions}
            </td>
        `
        tableBody.appendChild(tr)
    })
}

// ===================================1
// TABLA DE DISPOSITIVOS

function renderDevicesTable(devices) {

    const tableBody = document.getElementById('devices-table')
    tableBody.innerHTML = ''

    if (devices.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No hay dispositivos registrados.
                </td>
            </tr>
        `
        return
    }

    devices.forEach(device => {

        let optionsHTML = '<option value="">-- Sin asignar --</option>'

        patientsList.forEach(patient => {

            const selected =
                device.user_id === patient.id ? 'selected' : ''

            optionsHTML += `
                <option value="${patient.id}" ${selected}>
                    ${patient.name} ${patient.lastName}
                </option>
            `
        })

        const lastConnection = device.last_connection
            ? new Date(device.last_connection).toLocaleString()
            : '-'

        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td>${device.id}</td>
            <td>${device.name}</td>
            <td>${device.serial_number}</td>
            <td>
                <select id="device-user-${device.id}">
                    ${optionsHTML}
                </select>
            </td>
            <td>${device.status}</td>
            <td>${lastConnection}</td>
            <td>
                <button onclick="assignDevice(${device.id})">
                    Asignar
                </button>
                <button onclick="editDevice(${device.id})">
                    Editar
                </button>
                <button onclick="deleteDevice(${device.id})">
                    Eliminar
                </button>
            </td>
        `
        tableBody.appendChild(tr)
    })
}
// ===================================2

async function editUser(id) {
    try {
        const res = await fetch(`/api/users/${id}`)
        const user = await res.json()

        document.getElementById('edit-id').value = user.id
        document.getElementById('edit-name').value = user.name || ''
        document.getElementById('edit-lastName').value = user.lastName || ''
        document.getElementById('edit-email').value = user.email || ''
        document.getElementById('edit-dni').value = user.dni || ''
        document.getElementById('edit-phone').value = user.phone || ''
        document.getElementById('edit-role').value = user.role

        if (user.birthDate) {
            document.getElementById('edit-birthDate').value =
                user.birthDate.split('T')[0]
        } else {
            document.getElementById('edit-birthDate').value = ''
        }

        document.getElementById('editModal').style.display = 'block'

    } catch (error) {
        console.error(error)
        alert('Error al cargar el usuario.')
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none'
}

// ==============================1
// MODAL DISPOSITIVOS

function openDeviceModal() {

    document.getElementById('deviceModalTitle').textContent = 'Registrar dispositivo'
    document.getElementById('device-id').value = ''
    document.getElementById('device-name').value = ''
    document.getElementById('device-serial').value = ''
    document.getElementById('device-status').value = 'unassigned'
    document.getElementById('deviceModal').style.display = 'block'
}

function closeDeviceModal() {
    document.getElementById('deviceModal').style.display = 'none'
}
// ==============================2


//cargo los datos del dispositivo en el modal===1
async function editDevice(id) {
    try {
        const res = await fetch(`/api/devices/${id}`)
        const device = await res.json()

        document.getElementById('deviceModalTitle').textContent = 'Editar dispositivo'
        document.getElementById('device-id').value = device.id
        document.getElementById('device-name').value = device.name
        document.getElementById('device-serial').value = device.serial_number
        document.getElementById('device-status').value = device.status
        document.getElementById('deviceModal').style.display = 'block'
    }
    catch (error) {
        console.error(error)
        alert('Error al cargar el dispositivo.')
    }
}
//cargo los datos del dispositivo en el modal===2

async function saveUser() {
    const id = document.getElementById('edit-id').value
    const updateData = {
        name: document.getElementById('edit-name').value,
        lastName: document.getElementById('edit-lastName').value,
        email: document.getElementById('edit-email').value,
        dni: document.getElementById('edit-dni').value,
        birthDate: document.getElementById('edit-birthDate').value,
        phone: document.getElementById('edit-phone').value,
        role: document.getElementById('edit-role').value
    }
    try {
        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.message)
            return
        }

        alert('Usuario actualizado correctamente.')
        closeModal()
        initAdminPanel()

    } catch (error) {
        console.error(error)
        alert('Error de conexión.')
    }
}

async function deleteUser(id) {
    const confirmar = confirm(
        '¿Está seguro que desea eliminar este usuario?\n\nLa cuenta quedará desactivada y sus datos personales serán anonimizados.'
    )

    if (!confirmar) return
    try {
        const res = await fetch(`/api/users/${id}/deactivate`, {
            method: 'PUT'
        })

        const data = await res.json()
        const message = document.getElementById('admin-message')

        if (res.ok) {
            message.textContent = data.message
            message.style.color = 'green'

            // Recargar las tablas
            initAdminPanel()

        } else {
            message.textContent = data.message
            message.style.color = 'red'
        }

    } catch (error) {
        console.error(error)
        document.getElementById('admin-message').textContent =
            'Error de conexión'
    }
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

//Guardar dispositivo===1
async function saveDevice() {
    const id = document.getElementById('device-id').value
    const deviceData = {
        name: document.getElementById('device-name').value,
        serial_number: document.getElementById('device-serial').value,
        status: document.getElementById('device-status').value
    }
    const method = id ? 'PUT' : 'POST'
    const url = id ? `/api/devices/${id}` : '/api/devices'
    try {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deviceData)
        })
        const data = await res.json()
        if (!res.ok) {
            alert(data.message)
            return
        }
        alert(id ? 'Dispositivo actualizado.' : 'Dispositivo registrado.')

        closeDeviceModal()
        initAdminPanel()
    }
    catch (error) {
        console.error(error)
        alert('Error de conexión.')
    }
}
//Guardar dispositivo===2

//asignar dispositivo===1
async function assignDevice(deviceId) {
    
    const select = document.getElementById(`device-user-${deviceId}`)
    const userId = select.value

    try {
        let url
        let method = 'PUT'
        let body

        if (userId) {
            url = `/api/devices/${deviceId}/assign`
            body = {
                user_id: userId
            }
        } else {
            url = `/api/devices/${deviceId}/unassign`
            body = {}
        }

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.message)
            return
        }

        alert(data.message)
        initAdminPanel()

    } catch (error) {
        console.error(error)
        alert('Error de conexión.')
    }
}
//asignar dispositivo===2


// =====================1
// ELIMINAR DISPOSITIVO
async function deleteDevice(id) {

    const confirmar = confirm('¿Está seguro que desea eliminar este dispositivo?')

    if (!confirmar) return

    try {
        const res = await fetch(`/api/devices/${id}`, {
            method: 'DELETE'
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.message)
            return
        }

        alert(data.message)
        initAdminPanel()

    } catch (error) {
        console.error(error)
        alert('Error de conexión.')
    }
}
// =====================1

initAdminPanel()