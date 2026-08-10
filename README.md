# Sistema de Monitoreo Personal con ESP32

## Descripción

Proyecto desarrollado como **Trabajo Final Integrador** para la obtención del título de **Técnico Superior en Diseño y Programación Web**.

El sistema tiene como objetivo realizar el monitoreo de determinados parámetros biométricos de una persona mediante un dispositivo basado en **ESP32**.

El dispositivo permite obtener mediciones de **frecuencia cardíaca (BPM)** y **saturación de oxígeno en sangre (SpO₂)** mediante el sensor MAX30102. Además, utiliza un sensor MPU6050 para analizar el movimiento y detectar posibles eventos de caída.

Las mediciones son enviadas mediante Wi-Fi a una **API REST**, donde son procesadas y almacenadas en una base de datos para posteriormente ser consultadas desde una plataforma web.

## Funcionamiento general

El sistema está compuesto por tres partes principales:

* **Dispositivo de monitoreo:** ESP32 conectado a los sensores MAX30102 y MPU6050.
* **Backend:** API REST encargada de recibir, procesar y almacenar la información.
* **Plataforma web:** permite gestionar usuarios y visualizar los registros biométricos almacenados.

El sistema contempla diferentes roles de usuario: **administrador, paciente y cuidador**.

## Tecnologías utilizadas

### Hardware

* ESP32
* Sensor MAX30102
* Sensor MPU6050
* Comunicación I²C
* Wi-Fi

### Software

* JavaScript
* Node.js
* Express
* MySQL
* Sequelize
* HTML
* CSS
* Chart.js
* Arduino IDE
* API REST
* JSON

## Arquitectura general

El ESP32 obtiene las mediciones de los sensores, procesa la información y genera los datos en formato JSON.

Posteriormente, los datos son enviados mediante una solicitud HTTP a la API REST. El servidor valida y almacena las mediciones en MySQL.

La plataforma web consulta la información almacenada mediante la API y permite visualizar los registros correspondientes a cada usuario.

## Documentación

La documentación completa del Trabajo Final Integrador se encuentra disponible en la carpeta `docs/`.

Dentro de esta carpeta se incluyen:

* Documento completo de la tesina.
* Diagramas de arquitectura.
* Diagramas de casos de uso.
* Diagramas de flujo.
* Diagrama de base de datos.
* Diagramas y esquemas del hardware.

## Objetivo académico

Este proyecto integra conocimientos adquiridos durante la carrera de **Técnico Superior en Diseño y Programación Web**, combinando desarrollo frontend, backend, bases de datos, APIs REST, sistemas embebidos e Internet de las Cosas (IoT).
