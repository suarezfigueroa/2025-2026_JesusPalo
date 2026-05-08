# ZAFISIO — Clínica de Fisioterapia
## Proyecto Final de Ciclo

---

| | |
|---|---|
| **Ciclo Formativo** | Desarrollo de Aplicaciones Web |
| **Centro Educativo** | I.E.S Suárez de Figueroa |
| **Autor** | Jesús Palo Rubio |
| **Tutor del Proyecto** | José Andrés Paredes Arribas |
| **Fecha** | Junio de 2026 |
| **Repositorio** | https://github.com/suarezfigueroa/2025-2026_JesusPalo |
| **URL del Proyecto** | https://zafisio.infinityfreeapp.com |

---

## Índice

1. [Introducción](#1-introducción)
2. [Objetivos del Proyecto](#2-objetivos-del-proyecto)
3. [Justificación del Proyecto](#3-justificación-del-proyecto)
   - 3.1 [Análisis de Mercado](#31-análisis-de-mercado)
   - 3.2 [Vinculación con Contenidos del Ciclo Formativo](#32-vinculación-con-contenidos-del-ciclo-formativo)
4. [Recursos Utilizados](#4-recursos-utilizados)
   - 4.1 [Entornos de Desarrollo](#41-entornos-de-desarrollo)
   - 4.2 [Lenguajes de Programación](#42-lenguajes-de-programación)
   - 4.3 [Utilidades y Recursos](#43-utilidades-y-recursos)
5. [Tecnologías de Desarrollo](#5-tecnologías-de-desarrollo)
   - 5.1 [Single Page Application (SPA)](#51-single-page-application-spa)
   - 5.2 [API REST con PHP](#52-api-rest-con-php)
   - 5.3 [Base de Datos MySQL](#53-base-de-datos-mysql)
   - 5.4 [Autenticación por Sesiones PHP](#54-autenticación-por-sesiones-php)
   - 5.5 [PHPMailer + Gmail SMTP](#55-phpmailer--gmail-smtp)
6. [Diseño del Proyecto](#6-diseño-del-proyecto)
   - 6.1 [Diagrama Entidad/Relación](#61-diagrama-entidadrelación)
   - 6.2 [Modelo Relacional](#62-modelo-relacional)
   - 6.3 [Carga de Datos Inicial](#63-carga-de-datos-inicial)
   - 6.4 [Diseño de la Interfaz de Usuario](#64-diseño-de-la-interfaz-de-usuario)
   - 6.5 [Roles de la Aplicación](#65-roles-de-la-aplicación)
   - 6.6 [Usuarios de Prueba](#66-usuarios-de-prueba)
7. [Lógica y Codificación del Proyecto](#7-lógica-y-codificación-del-proyecto)
   - 7.1 [Principales Procesos](#71-principales-procesos)
   - 7.2 [Validación de Datos](#72-validación-de-datos)
   - 7.3 [Control de Acceso](#73-control-de-acceso)
   - 7.4 [Sistema de Carpetas](#74-sistema-de-carpetas)
8. [Despliegue Web del Proyecto](#8-despliegue-web-del-proyecto)
   - 8.1 [Hosting Utilizado](#81-hosting-utilizado)
   - 8.2 [Requisitos](#82-requisitos)
   - 8.3 [Seguridad](#83-seguridad)
   - 8.4 [Proceso de Despliegue](#84-proceso-de-despliegue)
9. [Manual de Usuario](#9-manual-de-usuario)
   - 9.1 [Manual del Paciente](#91-manual-del-paciente)
   - 9.2 [Manual del Doctor](#92-manual-del-doctor)
   - 9.3 [Manual del Administrador](#93-manual-del-administrador)
10. [Conclusiones y Aspectos a Mejorar](#10-conclusiones-y-aspectos-a-mejorar)
11. [Bibliografía](#11-bibliografía)
- [Anexo I — Script SQL de Carga de Datos Inicial](#anexo-i--script-sql-de-carga-de-datos-inicial)

---

## 1. Introducción

Zafisio es una aplicación web completa para la gestión de una clínica de fisioterapia situada en Zafra (Badajoz). El proyecto nace de la necesidad de digitalizar los procesos habituales de una clínica: gestión de citas, asignación de tratamientos, control de pacientes y administración general del centro.

La aplicación está desarrollada como una Single Page Application (SPA) sin frameworks, utilizando HTML, CSS y JavaScript en el frontend, y PHP con MySQL y PHPMailer en el backend, lo que permite demostrar un dominio completo de las tecnologías base del desarrollo web.

---

## 2. Objetivos del Proyecto

Los principales objetivos que se han planteado para la realización de este proyecto son:

- Desarrollar una aplicación web funcional que permita gestionar de forma integral una clínica de fisioterapia.
- Implementar un sistema de autenticación y control de acceso por roles (paciente, doctor y administrador).
- Permitir a los pacientes solicitar, visualizar y cancelar sus citas médicas de forma autónoma.
- Facilitar a los doctores la gestión de sus pacientes, citas y tratamientos asignados.
- Proporcionar al administrador un panel de control completo para gestionar todos los recursos de la clínica.
- Aplicar buenas prácticas de desarrollo: separación de responsabilidades, seguridad básica y código mantenible.
- Desplegar la aplicación en un entorno de hosting real accesible desde internet.

---

## 3. Justificación del Proyecto

### 3.1 Análisis de Mercado

La digitalización del sector sanitario es una tendencia creciente. Muchas clínicas pequeñas y medianas, especialmente en localidades como Zafra, siguen gestionando sus citas y pacientes de forma manual o con herramientas genéricas como hojas de cálculo o agendas en papel, lo que supone una pérdida de tiempo y un mayor margen de error.

Existen soluciones en el mercado orientadas a clínicas, como Doctoralia, Meditoc o Clinic Cloud, pero estas están pensadas para grandes centros, tienen costes elevados o no se adaptan a las necesidades específicas de una clínica de fisioterapia de pequeño tamaño. Zafisio pretende cubrir ese nicho con una solución a medida, ligera y fácilmente adaptable.

### 3.2 Vinculación con Contenidos del Ciclo Formativo

Este proyecto integra los contenidos trabajados a lo largo del ciclo de Desarrollo de Aplicaciones Web:

- **Lenguajes de marcas (HTML5, CSS3):** estructura y estilos de la interfaz.
- **Programación (JavaScript):** lógica de cliente, navegación SPA y validaciones.
- **Desarrollo Web en Entorno Servidor (PHP):** API REST, autenticación y lógica de negocio.
- **Bases de Datos (MySQL):** diseño relacional, consultas y procedimientos.
- **Despliegue de Aplicaciones Web:** configuración de hosting, `.htaccess` y variables de entorno.

---

## 4. Recursos Utilizados

### 4.1 Entornos de Desarrollo

| Herramienta | Uso |
|---|---|
| Visual Studio Code | Editor principal de código |
| XAMPP | Servidor local Apache + MySQL para desarrollo |
| phpMyAdmin | Gestión visual de la base de datos |
| FileZilla | Subida de archivos al hosting por FTP |
| Git / GitHub | Control de versiones del proyecto |
| InfinityFreeApp | Plataforma de despliegue en la nube |

### 4.2 Lenguajes de Programación

| Lenguaje | Parte | Uso |
|---|---|---|
| HTML5 | Frontend | Estructura de las vistas y plantillas |
| CSS3 | Frontend | Estilos, diseño responsivo y animaciones |
| JavaScript | Frontend | Lógica SPA, validaciones, llamadas a la API |
| PHP | Backend | API REST, autenticación, lógica de negocio |
| SQL | Base de datos | Consultas, inserciones y gestión de datos |

### 4.3 Utilidades y Recursos

- **Google Fonts / Material Symbols:** iconografía y tipografía de la interfaz.
- **Google Maps Embed API:** mapa de localización en la página de contacto.
- **PHPMailer:** librería PHP para envío de emails mediante SMTP de Gmail.
- **InfinityFree:** hosting gratuito utilizado para el despliegue de la aplicación.
- **Freepik / Unsplash:** imágenes de stock utilizadas en la web.

---

## 5. Tecnologías de Desarrollo

### 5.1 Single Page Application (SPA)

La aplicación está construida como una SPA sin frameworks. La navegación se gestiona mediante el hash de la URL (`#home`, `#perfil`, `#admin`...), cargando dinámicamente las vistas HTML mediante `fetch`. Esto permite una experiencia de usuario fluida sin recargas de página completa, similar a frameworks como React o Vue pero sin dependencias externas.

### 5.2 API REST con PHP

El backend expone una API REST desarrollada en PHP puro. Cada endpoint responde en formato JSON y gestiona los métodos HTTP estándar (GET, POST, PUT, DELETE). Las rutas están organizadas en la carpeta `/api`, con endpoints separados por recurso (citas, doctores, tratamientos, etc.).

### 5.3 Base de Datos MySQL

Se utiliza MySQL como sistema gestor de base de datos relacional. El diseño sigue el modelo entidad-relación, con tablas normalizadas y relaciones mediante claves foráneas. Las consultas se realizan con PDO para prevenir inyección SQL.

### 5.4 Autenticación por Sesiones PHP

El control de sesiones se gestiona con las sesiones nativas de PHP (`$_SESSION`). Al iniciar sesión, los datos del usuario se almacenan en sesión y se comprueban en cada petición protegida. Los roles (paciente, doctor, admin) determinan qué operaciones puede realizar cada usuario.

### 5.5 PHPMailer + Gmail SMTP

Para el envío de emails del formulario de contacto se utiliza PHPMailer, configurado con el servidor SMTP de Gmail. Las credenciales se almacenan en un fichero `.env` para no exponerlas en el código fuente.

---

## 6. Diseño del Proyecto

### 6.1 Diagrama Entidad/Relación

A continuación se muestra el diagrama Entidad/Relación de la base de datos de Zafisio:

> 📷 *Insertar imagen del diagrama E/R aquí*

### 6.2 Modelo Relacional

> 📷 *Insertar imagen del modelo relacional aquí*

### 6.3 Carga de Datos Inicial

El script DML con los datos iniciales de prueba se encuentra en el [Anexo I](#anexo-i--script-sql-de-carga-de-datos-inicial) del presente documento.

### 6.4 Diseño de la Interfaz de Usuario

La interfaz sigue un diseño moderno con paleta de colores azul clínico, tipografía Poppins y componentes reutilizables (cards, modales, formularios). Todos los componentes son responsivos mediante CSS Grid y Flexbox, adaptándose correctamente a dispositivos móviles, tablets y escritorio.

Los principales elementos de interfaz son:

- Header fijo con menú de navegación y botón de sesión dinámico.
- Sección hero con vídeo de fondo en loop.
- Cards de tratamientos y doctores con efecto hover.
- Modales para detalle de tratamientos, nueva cita, asignación de tratamiento e historial.
- Panel de perfil con navegación lateral por secciones según el rol del usuario.
- Panel de administración con tablas, buscadores y formularios CRUD.
- Carrusel de imágenes con autoavance en la sección clínica.

### 6.5 Roles de la Aplicación

| Rol | Descripción |
|---|---|
| Paciente | Puede registrarse, iniciar sesión, solicitar y cancelar citas, ver sus tratamientos asignados y realizar pagos. |
| Doctor | Puede gestionar sus citas (confirmar, completar, cancelar), ver sus pacientes, asignar tratamientos y crear citas directamente. |
| Administrador | Acceso total: gestión de usuarios, doctores, pacientes, citas, tratamientos, maquinaria, productos clínicos y horarios. |

### 6.6 Usuarios de Prueba

| Email | Contraseña | Rol | Nombre |
|---|---|---|---|
| jpr@gmail.com | admin94 | Admin | Administrador |
| juan.garcia@email.com | password456 | Doctor | Doctor Prueba |
| juan.perez@email.com | password123 | Paciente | Paciente Prueba |

---

## 7. Lógica y Codificación del Proyecto

### 7.1 Principales Procesos

#### Gestión de sesión

Al cargar la aplicación se comprueba si existe una sesión activa mediante `api/sesion.php`. El resultado determina qué botón se muestra en el header y qué vistas son accesibles.

#### Navegación SPA

La navegación se basa en el hash de la URL. Cada cambio de hash dispara la función `cargarVista()`, que hace fetch del HTML correspondiente, lo inserta en el contenedor principal y ejecuta la función de inicialización de esa vista.

#### Sistema de citas

Los pacientes pueden solicitar citas eligiendo doctor, fecha y hora disponible. Los horarios disponibles se calculan dinámicamente en el servidor comparando los horarios configurados por el administrador con las citas ya existentes.

#### Panel de administración

El panel admin implementa CRUD completo para: usuarios, citas, tratamientos, maquinaria, productos clínicos y horarios de doctores. Todas las operaciones se realizan mediante fetch a la API REST.

### 7.2 Validación de Datos

Se aplica validación en dos capas:

- **Frontend:** validación en tiempo real con JavaScript al salir de cada campo (blur) y al enviar el formulario. Se muestran mensajes de error específicos bajo cada campo.
- **Backend:** validación en PHP antes de cualquier operación con la base de datos, con respuestas JSON estandarizadas `{success, mensaje}`.

### 7.3 Control de Acceso

Cada endpoint de la API comprueba que existe una sesión activa y que el rol del usuario tiene permisos para la operación solicitada. Las rutas de la carpeta `api/admin/` solo son accesibles por usuarios con rol admin.

### 7.4 Sistema de Carpetas

| Carpeta / Archivo | Contenido |
|---|---|
| `/api` | Endpoints PHP de la API REST |
| `/api/admin` | Endpoints exclusivos para el rol administrador |
| `/css` | Hojas de estilo CSS |
| `/js` | Módulos JavaScript (config, navegacion, sesion, perfil, citas, pacientes, vistas, admin, main, contacto) |
| `/vistas` | Fragmentos HTML de cada vista (home, login, perfil, admin...) |
| `/img` | Imágenes y vídeos de la aplicación |
| `/phpmailer` | Librería PHPMailer para envío de emails |
| `index.html` | Punto de entrada de la aplicación |
| `.env` | Variables de entorno (credenciales, configuración) |
| `.htaccess` | Configuración del servidor Apache |

---

## 8. Despliegue Web del Proyecto

### 8.1 Hosting Utilizado

La aplicación está desplegada en InfinityFree, un servicio de hosting gratuito que proporciona servidor Apache, PHP y MySQL sin coste. La URL de acceso es:

**https://zafisio.infinityfreeapp.com**

### 8.2 Requisitos

- Servidor web Apache con mod_rewrite habilitado.
- PHP 7.4 o superior.
- MySQL 5.7 o superior.
- Acceso SMTP al puerto 587 (para PHPMailer).

### 8.3 Seguridad

- Las credenciales de base de datos y email se almacenan en `.env`, protegido mediante `.htaccess` para que no sea accesible desde el navegador.
- Las contraseñas de los usuarios se almacenan hasheadas con `password_hash()` de PHP.
- Todas las consultas SQL utilizan PDO con parámetros preparados para prevenir inyección SQL.
- Se verifica el rol del usuario en cada endpoint de la API antes de ejecutar cualquier operación.

### 8.4 Proceso de Despliegue

1. Exportar la base de datos desde phpMyAdmin local.
2. Crear la base de datos en el panel de InfinityFree.
3. Importar el SQL exportado en la nueva base de datos.
4. Actualizar el fichero `.env` con las credenciales del hosting.
5. Subir todos los archivos del proyecto por FTP con FileZilla.
6. Verificar que `.htaccess` protege el `.env` y que la aplicación funciona correctamente.

---

## 9. Manual de Usuario

### 9.1 Manual del Paciente

#### Registro e inicio de sesión

El usuario puede registrarse desde el enlace 'Registro' del menú. Una vez registrado, puede iniciar sesión con su email y contraseña. Al iniciar sesión es redirigido automáticamente a su perfil.

#### Solicitar una cita

Desde el perfil, sección 'Mis Citas', el paciente puede pulsar 'Nueva cita', elegir doctor, fecha y hora disponible e introducir el motivo de la consulta. Solo se muestran los horarios en los que el doctor tiene disponibilidad.

#### Gestionar citas

El paciente puede ver todas sus citas con su estado (pendiente, confirmada, completada, cancelada) y cancelar las que estén en estado pendiente o confirmada.

#### Mis tratamientos

En la sección 'Mis Tratamientos' el paciente puede ver los tratamientos asignados por su doctor, con fechas de inicio y fin, precio y estado de pago. Puede realizar el pago desde la propia aplicación.

### 9.2 Manual del Doctor

#### Gestión de citas

El doctor puede ver todas sus citas filtradas por estado. Puede confirmar las citas pendientes, marcarlas como completadas una vez realizadas, o cancelarlas.

#### Gestión de pacientes

En la sección 'Mis Pacientes' el doctor ve todos los pacientes que tienen citas con él. Desde cada tarjeta de paciente puede asignar un tratamiento, ver el historial completo (citas y tratamientos) o crear una nueva cita directamente.

### 9.3 Manual del Administrador

El administrador accede al panel de administración desde su perfil. Desde el panel puede gestionar:

- **Usuarios:** crear, editar y eliminar cualquier usuario del sistema.
- **Doctores:** gestión específica de los usuarios con rol doctor.
- **Pacientes:** gestión de los usuarios con rol paciente.
- **Citas:** ver, editar y eliminar cualquier cita del sistema.
- **Tratamientos:** CRUD completo de los tratamientos disponibles en la clínica.
- **Maquinaria:** control del equipamiento de la clínica con estado (disponible, en uso, mantenimiento).
- **Productos clínicos:** gestión del stock de productos.
- **Horarios:** configuración de la disponibilidad horaria de cada doctor por fecha.

---

## 10. Conclusiones y Aspectos a Mejorar

El desarrollo de Zafisio ha supuesto un reto técnico y personal muy enriquecedor. Ha permitido integrar de forma práctica todos los conocimientos adquiridos a lo largo del ciclo, desde el diseño de la base de datos hasta el despliegue en producción, pasando por el desarrollo frontend y backend.

Entre los aspectos más desafiantes destaca la implementación de la navegación SPA sin frameworks, que requirió un diseño cuidadoso del sistema de módulos JavaScript para mantener el código organizado y evitar conflictos entre vistas.

Como aspectos a mejorar en futuras versiones se identifican:

- Implementar notificaciones por email automáticas al paciente cuando el doctor confirma o cancela una cita.
- Añadir un sistema de valoraciones para que los pacientes puntúen a los doctores.
- Mejorar el sistema de pagos integrando una pasarela real (Stripe, PayPal).
- Añadir un calendario visual para los doctores que muestre sus citas de forma gráfica.
- Migrar el backend a una arquitectura más escalable con Node.js o un framework PHP como Laravel.

---

## 11. Bibliografía

A continuación se listan los principales recursos consultados durante el desarrollo del proyecto:

- **MDN Web Docs** — https://developer.mozilla.org
- **PHP Manual** — https://www.php.net/manual/es/
- **PHPMailer GitHub** — https://github.com/PHPMailer/PHPMailer
- **W3Schools** — https://www.w3schools.com
- **Stack Overflow** — https://stackoverflow.com
- **Google Fonts / Material Symbols** — https://fonts.google.com/icons
- **Apoyo de IA para gestiones complejas** — https://claude.ai/

---

## Anexo I — Script SQL de Carga de Datos Inicial

A continuación se incluye el script SQL con los datos de prueba necesarios para inicializar la aplicación:

```sql
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-05-2026 a las 09:22:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de datos: `clinica`
CREATE DATABASE IF NOT EXISTS `clinica` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `clinica`;

DELIMITER $$

-- Procedimientos
CREATE DEFINER=`root`@`localhost` PROCEDURE `generar_horarios` (`meses` INT)
BEGIN
  DECLARE fecha_actual DATE DEFAULT CURDATE();
  DECLARE fecha_fin DATE DEFAULT DATE_ADD(CURDATE(), INTERVAL meses MONTH);
  DECLARE v_id INT;
  DECLARE fin TINYINT DEFAULT 0;
  DECLARE cur CURSOR FOR SELECT id_doctor FROM doctores;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET fin = 1;
  WHILE fecha_actual <= fecha_fin DO
    IF DAYOFWEEK(fecha_actual) BETWEEN 2 AND 6 THEN
      OPEN cur;
      loop_doctores: LOOP
        FETCH cur INTO v_id;
        IF fin = 1 THEN LEAVE loop_doctores; END IF;
        INSERT IGNORE INTO horarios_doctor (id_doctor, fecha, hora_inicio, hora_fin, duracion_slot)
        VALUES (v_id, fecha_actual, '09:00', '14:00', 30);
        INSERT IGNORE INTO horarios_doctor (id_doctor, fecha, hora_inicio, hora_fin, duracion_slot)
        VALUES (v_id, fecha_actual, '17:00', '20:00', 30);
      END LOOP;
      CLOSE cur;
      SET fin = 0;
    END IF;
    SET fecha_actual = DATE_ADD(fecha_actual, INTERVAL 1 DAY);
  END WHILE;
END$$

DELIMITER ;

-- Estructura de tabla `citas`
CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `id_paciente` int(11) DEFAULT NULL,
  `id_doctor` int(11) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `estado` enum('pendiente','confirmada','cancelada','completada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `citas` (`id_cita`, `id_paciente`, `id_doctor`, `fecha_hora`, `motivo`, `estado`) VALUES
(1, 1, 2, '2025-11-01 10:00:00', 'Rehabilitación de rodilla', 'cancelada'),
(2, 3, 4, '2025-11-02 11:30:00', 'Tratamiento de espalda', 'confirmada'),
(3, 5, 6, '2025-11-03 09:15:00', 'Lesión en el hombro', 'pendiente'),
(4, 7, 8, '2025-11-04 14:00:00', 'Recuperación de codo', 'cancelada'),
(5, 9, 2, '2025-11-05 16:30:00', 'Masaje terapéutico', 'completada'),
(6, 1, 4, '2025-11-06 13:00:00', 'Terapia manual', 'cancelada'),
(7, 3, 6, '2025-11-07 10:45:00', 'Fisioterapia neurológica', 'pendiente'),
(8, 5, 8, '2025-11-08 12:30:00', 'Rehabilitación postquirúrgica', 'confirmada'),
(9, 7, 2, '2025-11-09 14:30:00', 'Ejercicios de movilidad', 'cancelada'),
(10, 1, 6, '2026-03-24 17:59:00', 'Dolor de cadera', 'pendiente'),
(11, 1, 2, '2026-03-27 18:00:00', 'Esguince tobillo', 'completada'),
(12, 1, 2, '2026-04-08 14:03:00', 'Revision', 'confirmada'),
(13, 1, 4, '2026-04-10 09:00:00', 'Prueba de rango', 'cancelada'),
(14, 1, 6, '2026-04-10 12:00:00', 'esguince', 'pendiente'),
(15, 1, 2, '2026-04-10 10:00:00', 'Prueba nueva', 'cancelada'),
(16, 1, 2, '2026-04-10 10:00:00', 'Prueba', 'completada');

-- Estructura de tabla `doctores`
CREATE TABLE `doctores` (
  `id_doctor` int(11) NOT NULL,
  `datosExtras` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `doctores` (`id_doctor`, `datosExtras`) VALUES
(2, 'Fisioterapeuta deportivo · 10 años de experiencia'),
(4, 'Fisioterapeuta Neurológico · 8 años de experiencia'),
(6, 'Fisioterapeuta Pediátrico · 6 años de experiencia'),
(8, 'Fisioterapeuta Respiratorio · 5 años de experiencia');

-- Estructura de tabla `horarios_doctor`
CREATE TABLE `horarios_doctor` (
  `id_horario` int(11) NOT NULL,
  `id_doctor` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `duracion_slot` int(11) DEFAULT 30
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- (Se omiten los 528 registros de horarios por brevedad — incluir el SQL completo exportado desde phpMyAdmin)

-- Estructura de tabla `maquinaria`
CREATE TABLE `maquinaria` (
  `id_maquinaria` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('disponible','en uso','mantenimiento') NOT NULL,
  `fecha_adquisicion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `maquinaria` (`id_maquinaria`, `nombre`, `tipo`, `descripcion`, `estado`, `fecha_adquisicion`) VALUES
(1, 'Máquina de Electroterapia', 'Electroterapia', 'Máquina para tratamientos de electroestimulación muscular', 'disponible', '2023-05-01'),
(2, 'Cinta de correr para rehabilitación', 'Rehabilitación', 'Cinta de correr para ejercicios de rehabilitación de piernas', 'en uso', '2022-10-15'),
(3, 'Unidad de ultrasonido terapéutico', 'Rehabilitación', 'Máquina de ultrasonido para terapia muscular', 'disponible', '2023-02-20'),
(4, 'Banca para ejercicios de estiramiento', 'Rehabilitación', 'Banca ajustable para realizar estiramientos y ejercicios', 'en uso', '2021-08-05'),
(5, 'Sistema de terapia de calor', 'Terapia', 'Máquina para aplicar calor terapéutico en músculos', 'disponible', '2023-04-10');

-- Estructura de tabla `pacientes`
CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `pacientes` (`id_paciente`) VALUES (1),(3),(5),(7),(9),(10),(11),(12),(13),(14),(15);

-- Estructura de tabla `pacientes_tratamientos`
CREATE TABLE `pacientes_tratamientos` (
  `id_paciente` int(11) NOT NULL,
  `id_tratamiento` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `pago` enum('pendiente','pagado') DEFAULT 'pendiente',
  `metodo_pago` varchar(50) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `pacientes_tratamientos` VALUES
(1, 1, '2025-11-01', '2025-11-30', 'pagado', 'Transferencia bancaria', '2026-04-12 12:31:31'),
(3, 2, '2025-11-02', '2025-11-16', 'pendiente', NULL, NULL),
(5, 3, '2025-11-03', '2025-11-24', 'pendiente', NULL, NULL),
(7, 4, '2025-11-04', '2025-12-04', 'pendiente', NULL, NULL),
(9, 5, '2025-11-05', '2025-11-19', 'pendiente', NULL, NULL);

-- Estructura de tabla `persona`
CREATE TABLE `persona` (
  `id_persona` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fecha_nac` date DEFAULT NULL,
  `rol` enum('paciente','doctor','admin') NOT NULL,
  `Foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `persona` VALUES
(1, 'Juan Luis', 'Pérez', 'Calle Fisioterapia 1234', '123456789', '12345678B', 'juan.perez@email.com', 'password123', '1990-05-15', 'paciente', NULL),
(2, 'Juan', 'García', 'Avenida Terapia 456', '987654328', '87654326B', 'juan.garcia@email.com', 'password456', '1985-02-20', 'doctor', 'img/Doctores/juangarcia.jpg'),
(4, 'Maria', 'Rodríguez', 'Calle Rehabilitación 101', '321654987', '12345679D', 'maria.rodriguez@email.com', 'password000', '1987-11-30', 'doctor', 'img/Doctores/mariarodriguez.jpg'),
(6, 'Marta', 'Sánchez', 'Calle Movilidad 303', '543216789', '54321678F', 'laura.sanchez@email.com', 'password567', '1993-03-05', 'doctor', 'img/Doctores/laurasanchez.jpg'),
(8, 'Alberto', 'Fernández', 'Calle Rehabilitación 505', '321098765', '32109876H', 'sofia.fernandez@email.com', 'password1234', '1994-01-12', 'doctor', 'img/Doctores/albertofernandez.jpg'),
(1000, 'jesus', 'palo', '', NULL, NULL, 'jpr@gmail.com', 'admin94', NULL, 'admin', 'img/Admin/usuario_1000.jpg');

-- Estructura de tabla `productos_clinicos`
CREATE TABLE `productos_clinicos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `proveedor` varchar(100) DEFAULT NULL,
  `fecha_compra` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `productos_clinicos` VALUES
(1, 'Gel para Masaje', 100, 'Gel terapéutico para masajes musculares', 'Proveedor A', '2023-03-10'),
(2, 'Crema Anti-inflamatoria', 150, 'Crema para aliviar inflamaciones y dolores musculares', 'Proveedor B', '2023-06-15'),
(3, 'Tobillera elástica', 50, 'Soporte elástico para tobillos', 'Proveedor C', '2023-07-20'),
(4, 'Rodillo para masajes', 80, 'Rodillo de goma para masajes musculares', 'Proveedor A', '2023-04-22'),
(5, 'Termo de frío para lesiones', 60, 'Termo para aplicación de frío en lesiones', 'Proveedor D', '2023-01-30');

-- Estructura de tabla `tratamientos`
CREATE TABLE `tratamientos` (
  `id_tratamiento` int(11) NOT NULL,
  `nombre_tratamiento` varchar(100) DEFAULT NULL,
  `duracion` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `foto` varchar(255) NOT NULL,
  `des_completa` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `tratamientos` (`id_tratamiento`, `nombre_tratamiento`, `duracion`, `precio`, `descripcion`, `foto`, `des_completa`) VALUES
(1, 'Fisioterapia de Rehabilitación', 60, 50.00, 'Tratamiento de rehabilitación física para lesiones musculares', 'img/Tratamientos/rehabilitacion.jpeg', 'Descripción completa...'),
(2, 'Masoterapia', 45, 40.00, 'Tratamiento de masajes terapéuticos para la relajación muscular', 'img/Tratamientos/masoterapia.jpeg', 'Descripción completa...'),
(3, 'Rehabilitación Postquirúrgica', 90, 120.00, 'Recuperación de movilidad tras una intervención quirúrgica', 'img/Tratamientos/postquirurgica.jpeg', 'Descripción completa...'),
(4, 'Electroterapia', 30, 35.00, 'Tratamiento con estimulación eléctrica para aliviar el dolor muscular', 'img/Tratamientos/electroterapia.jpeg', 'Descripción completa...'),
(5, 'Terapia Manual', 60, 55.00, 'Técnicas manuales para el tratamiento de trastornos musculoesqueléticos', 'img/Tratamientos/terapiaManual.jpeg', 'Descripción completa...'),
(6, 'Terapia de Calor', 30, 25.00, 'Aplicación de calor para aliviar dolores musculares', 'img/Tratamientos/calor.jpeg', 'Descripción completa...'),
(7, 'Terapia de Frío', 30, 25.00, 'Aplicación de frío para reducir inflamaciones y dolores agudos', 'img/Tratamientos/frio.png', 'Descripción completa...'),
(8, 'Rehabilitación Neurológica', 60, 75.00, 'Tratamiento para mejorar la movilidad en pacientes con afecciones neurológicas', 'img/Tratamientos/neurologica.png', 'Descripción completa...'),
(9, 'Terapia de Estiramientos', 45, 40.00, 'Sesión de estiramientos para mejorar la flexibilidad muscular', 'img/Tratamientos/estiramientos.png', 'Descripción completa...'),
(10, 'Terapia en Agua', 60, 80.00, 'Rehabilitación y ejercicios en agua para mejorar la movilidad sin impacto', 'img/Tratamientos/agua.png', 'Descripción completa...');

-- Índices y claves foráneas
ALTER TABLE `citas` ADD PRIMARY KEY (`id_cita`), ADD KEY `id_paciente` (`id_paciente`), ADD KEY `id_doctor` (`id_doctor`);
ALTER TABLE `doctores` ADD PRIMARY KEY (`id_doctor`);
ALTER TABLE `horarios_doctor` ADD PRIMARY KEY (`id_horario`), ADD KEY `id_doctor` (`id_doctor`);
ALTER TABLE `maquinaria` ADD PRIMARY KEY (`id_maquinaria`);
ALTER TABLE `pacientes` ADD PRIMARY KEY (`id_paciente`);
ALTER TABLE `pacientes_tratamientos` ADD PRIMARY KEY (`id_paciente`,`id_tratamiento`);
ALTER TABLE `persona` ADD PRIMARY KEY (`id_persona`), ADD UNIQUE KEY `dni` (`dni`);
ALTER TABLE `productos_clinicos` ADD PRIMARY KEY (`id_producto`);
ALTER TABLE `tratamientos` ADD PRIMARY KEY (`id_tratamiento`);

ALTER TABLE `citas` MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
ALTER TABLE `horarios_doctor` MODIFY `id_horario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=529;
ALTER TABLE `maquinaria` MODIFY `id_maquinaria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE `persona` MODIFY `id_persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1002;
ALTER TABLE `productos_clinicos` MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
ALTER TABLE `tratamientos` MODIFY `id_tratamiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE,
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_doctor`) REFERENCES `doctores` (`id_doctor`) ON DELETE CASCADE;

ALTER TABLE `doctores`
  ADD CONSTRAINT `doctores_ibfk_1` FOREIGN KEY (`id_doctor`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE;

ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE;

ALTER TABLE `pacientes_tratamientos`
  ADD CONSTRAINT `pacientes_tratamientos_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE,
  ADD CONSTRAINT `pacientes_tratamientos_ibfk_2` FOREIGN KEY (`id_tratamiento`) REFERENCES `tratamientos` (`id_tratamiento`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
```
