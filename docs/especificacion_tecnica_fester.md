# Especificación Técnica: Sistema de Gestión de Promotoría Fester

## 1. Resumen del Proyecto
Desarrollo de una plataforma integral (MERN Stack) para la gestión, auditoría y optimización de promotores de la marca Fester en tiendas departamentales (Home Depot, etc.). El sistema sustituye la gestión vía WhatsApp por una estructura de datos robusta que garantiza la veracidad de la labor en campo y automatiza el cálculo de incentivos complejos.

## 2. Perfiles de Usuario y Datos de Registro

| Perfil | Responsabilidades Clave |
| :--- | :--- |
| **Promotor** | Registro de jornada (check-in/out), envío de evidencias fotográficas, consulta de metas y simulador de bonos. |
| **Supervisor** | Gestión de usuarios (promotores) y sucursales. Configuración de tiendas, productos y métricas de bonos por usuario. Auditoría visual y carga de reportes de ventas. |
| **Administrador** | Control total del sistema, gestión de catálogos globales de productos y categorías. |

### 2.1. Entidad de Usuario
- Nombre completo.
- Correo electrónico.
- Teléfono fijo.
- Teléfono celular.
- Ciudad de residencia o de operación.
- Rol en el sistema (Promotor / Supervisor / Administrador).
- Tiendas a su cargo (arreglo de IDs referenciando las sucursales asignadas).

## 3. Módulos del Sistema

### 3.1. Panel de Supervisión (Web Admin)
- **Gestor de Perfil de Promotor:** Interfaz detallada donde el supervisor puede asignar tiendas, productos, métricas de bonos y ver el tablero individual.
- **Configurador de Evidencias (Flexible):** Módulo para agregar, modificar o eliminar tipos de evidencias fotográficas requeridas.
- **Carga Masiva de Datos:** Importación de CSV/Excel de Home Depot.
- **Tablero de Excepciones:** Alertas de retardos, check-ins fuera de rango, etc.
- **Auditoría Visual:** Comparativa "Antes vs. Después".

### 3.2. Aplicación del Promotor (PWA / Mobile)
- **Control de Asistencia:** Registro validado por GPS y marcas de tiempo.
- **Gestor Dinámico de Evidencias:** Checklist configurado por el supervisor.
- **Cámara Interna:** Uso exclusivo de la cámara del sistema con marca de agua (Fecha, Hora, GPS).
- **Calculadora de Proyección:** Interfaz para ingresar avance y proyectar ganancias.

## 4. Lógica de Negocio y Bonificaciones

### 4.1. Bono Operativo (Cumplimiento de Evidencias)
Cálculo basado en la completitud de las evidencias parametrizadas. Penalizaciones por omisiones o exceder la tolerancia de 15 minutos.

### 4.2. Bono de Ventas y Aceleradores (Control de Supervisor)
**El supervisor tiene el control absoluto para definir las categorías de productos y establecer las reglas de bonificación.**

| Nivel de Alcance | Regla de Compensación |
| :--- | :--- |
| 0% - 100% de la Meta | Bono base calculado sobre la meta establecida (y ajustada) por la marca. |
| > 100% (Acelerador) | Pago extra por unidad adicional vendida dentro de la categoría (ej. +$15 MXN). |

## 5. Requerimientos Técnicos
- **Arquitectura:** MERN Stack (MongoDB, Express, React, Node.js).
- **Estrategia de Datos:** Offline-First mediante PWA.
- **Seguridad:** Verificación estricta de coordenadas geográficas.

## 6. Lineamientos de Diseño (UI/UX)
- **Layout:** Diseño de ancho completo (Full Width).
- **Estética:** Estilo limpio y profesional; **sin bordes redondeados** en contenedores y botones.
- **Tipografía:** Alta legibilidad.

## 7. Despliegue
- **Plataforma:** Dokploy (MCP conectado)
**Contacto Técnico:** alonso.humberto0401@gmail.com
