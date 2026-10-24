# SIFCOM — Sistema de Fiscalización en Terreno de Contratos Municipales

## Presentado por
- Nicolás Alejandro Leiva Aguilar
- Ricardo Andres Pasten Oblitas

## Índice
1. [Descripción general del sistema](#descripción-general-del-sistema)
2. [Justificación del problema](#justificación-del-problema)
3. [Objetivos del proyecto](#objetivos-del-proyecto)
4. [Usuarios objetivo](#usuarios-objetivo-quién-usará-la-aplicación)
5. [Roles del sistema](#roles-del-sistema)
6. [Proto-personas](#proto-personas)
7. [Requerimientos](#requerimientos)
    - [Requerimientos funcionales por rol](#requerimientos-funcionales)
    - [Funcionalidades transversales](#funcionalidades-transversales)
    - [Requerimientos no funcionales](#requerimientos-no-funcionales)
8. [Arquitectura de Navegación / UX](#arquitectura-de-navegación)
    - [Rutas principales y secundarias](#1-rutas-principales-y-secundarias)
    - [Relaciones jerárquicas entre vistas](#2-relaciones-jerárquicas-entre-vistas)
    - [Diferenciación de acceso por roles](#3-diferenciación-de-acceso-según-roles)
    - [Flujos de tareas](#4-flujos-de-tareas)
    - [Puntos críticos de interacción](#5-puntos-críticos-de-interacción)
    - [Justificación técnica](#6-justificación-técnica)
9. [Bocetos UI/UX](#bocetos-uiux)
10. [Tecnologías y herramientas](#tecnologías-y-herramientas)

---

**1. ##Descripción general del sistema**

**SIFCOM** es una aplicación desarrollada con Ionic y React, con una base de código de interfaz compartida y una presentación adaptable a teléfonos y computadores. Permite registrar fiscalizaciones de contratos municipales, responder listas de verificación, adjuntar evidencia y consultar sus antecedentes.

Los permisos dependen del rol que posea la cuenta. Inspectores y administradores pueden crear fiscalizaciones; los administradores, además, gestionan contratos, pautas y accesos y además consultan la información consolidada. El dispositivo utilizado no determinará los permisos.

La información se centralizará cuando el servidor confirma su recepción. En terreno se contempla trabajo sin conexión con datos previamente descargados y una sincronización posterior. No se promete información centralizada en tiempo real mientras el dispositivo esté desconectado.

---

2. ## Justificación del problema

A nivel municipal, existe una carencia generalizada para medir la eficiencia y el impacto de la gestión, lo que impide la toma de decisiones basada en evidencia. Uno de los focos más críticos son los problemas en la gestión de contratos de servicios externalizados (ej. recolección de basura, mantenimiento de áreas verdes, obras).

Las municipalidades enfrentan graves dificultades para supervisar y controlar eficazmente la calidad de estos servicios en terreno, lo que deriva en un mal servicio entregado a la ciudadanía a pesar de los altos costos financieros invertidos.

El proyecto aborda la necesidad de relacionar cada observación en terreno con un contrato, un responsable, una pauta y su evidencia. La hipótesis de trabajo es que registros dispersos dificultan consultar los antecedentes y comparar fiscalizaciones. 

> Fuentes: Guía Metodológica de Calidad de Servicio del Ministerio de Hacienda; documentación sobre Desafíos Públicos Locales.

| Elemento | Alcance propuesto |
| --- | --- |
| Institución | Una municipalidad por instalación para esta versión |
| Usuarios | Inspectores y administradores autorizados |
| Servicios | Contratos de servicios externos, inicialmente áreas verdes y aseo como ejemplos |
| Información | Contratos, pautas, fiscalizaciones, respuestas, fotografías y trazabilidad |
| Seguimiento | Indicadores de fiscalizaciones y alertas de cumplimiento |
| Fuera del alcance inicial | Presupuestos, pagos, cálculo o aplicación de multas, licitaciones, portal ciudadano y programación de rutas |
| También fuera del alcance inicial | Inteligencia artificial para evaluar fotografías, múltiples municipalidades y flujos de aprobación con varios niveles |

---

3. ## Objetivo general

Digitalizar y centralizar el registro y seguimiento de fiscalizaciones de contratos municipales mediante una aplicación adaptable a móvil y escritorio, con permisos por rol y trazabilidad de la evidencia.

**Objetivos específicos**
1. Registrar fiscalizaciones asociadas a contratos y responsables identificados.
2. Aplicar pautas acordes a las obligaciones de cada contrato.
3. Vincular respuestas, fotografías, ubicación disponible y observaciones.
4. Consultar antecedentes por fecha, contrato y responsable, según permisos.
5. Presentar indicadores y alertas derivados de las fiscalizaciones enviadas.
6. Conservar el trabajo local ante interrupciones de conectividad y comunicar su estado de envío.

---

4. ## Usuarios objetivo y proto-personas

Se consideran funcionarios adultos, incluidos usuarios de 40 años o más, con distintas experiencias tecnológicas. Las decisiones de accesibilidad se justifican por diversidad de usuarios y uso en terreno; la edad no se utiliza como indicador de incapacidad tecnológica.

Los perfiles siguientes son hipotéticos. Sus edades, hábitos y niveles tecnológicos son supuestos de diseño, no resultados de entrevistas.

| Aspecto | Carlos: inspector operativo | Valeria: administradora municipal |
| --- | --- | --- |
| Edad ficticia | 45 años | 38 años |
| Rol | Inspector | Administrador |
| Contexto | Recorridos por espacios y servicios municipales; uso exterior con conectividad variable | Trabajo de oficina y visitas ocasionales a terreno |
| Experiencia tecnológica estimada | Usa cámara y aplicaciones habituales; necesita instrucciones claras para tareas nuevas | Usa formularios y herramientas de oficina; requiere filtros y resúmenes comprensibles |
| Necesidad | Registrar una revisión sin perder información ni escribir textos extensos | Consultar antecedentes y configurar qué debe revisarse en cada contrato |
| Objetivo | Completar una fiscalización y saber si quedó guardada o enviada | Identificar contratos con observaciones y acceder a la evidencia |
| Frustración hipotética | Controles pequeños, pérdida de un formulario y mensajes de envío ambiguos | Información dispersa, indicadores sin contexto y permisos confusos |
| Funciones utilizadas | RF-04, RF-05, RF-06, RF-07 y RF-08 | RF-01 a RF-10 según la tarea |
| Dispositivo probable | Teléfono; también puede usar computador | Computador y teléfono |
| Accesibilidad y privacidad | Texto legible, controles amplios, estados con texto; acceso a sus registros | Navegación por teclado, filtros rotulados; acceso institucional según rol |

---

5. ##Roles y permisos

| Acción | Inspector | Administrador |
| --- | --- | --- |
| Acceder desde móvil o escritorio | Sí | Sí |
| Crear una fiscalización | En contratos habilitados para su cuenta | En cualquier contrato vigente y habilitado de la institución |
| Responder pauta, añadir evidencia y observaciones | En sus borradores | En sus borradores |
| Consultar sus reportes enviados | Sí | Sí |
| Consultar reportes enviados por otros usuarios | No | Sí |
| Filtrar por responsable | No: su identidad queda fijada | Sí, incluidos administradores que hayan fiscalizado |
| Ver indicadores globales | No | Sí |
| Gestionar contratos y asignaciones de inspectores | No | Sí |
| Crear y publicar versiones de checklist | No | Sí |
| Activar cuentas y administrar roles | No | Sí, con registro del cambio |
| Cambiar su propio rol desde el perfil | No | No |
| Alterar respuestas de un reporte enviado | No | No |

Una cuenta administradora conserva su identidad como autora cuando fiscaliza. No necesita otra cuenta de inspector para hacerlo. La autorización deberá comprobarse en el servidor en cada operación y sobre cada registro; ocultar botones o proteger rutas del navegador no es suficiente.

---

6. ##Reglas sobre el Dominio

6.1. Contrato, tipo de servicio y lugar
Un tipo de servicio clasifica el trabajo, por ejemplo, áreas verdes o aseo. Un contrato identifica un acuerdo concreto, por ejemplo, “AV-2026-01: Mantención de áreas verdes, sector norte”. Una plaza es normalmente un lugar fiscalizado dentro de ese contrato, no necesariamente otro tipo de servicio.

Datos mínimos propuestos del contrato: código único, nombre, empresa responsable, tipo de servicio, fechas de vigencia, estado habilitado/archivado, inspectores autorizados, versión de checklist asignada y umbral de alerta.

6.2. Checklist por contrato
La unidad reutilizable es una plantilla. El administrador puede crearla o duplicar una existente y asignar una versión publicada al contrato concreto. La categoría ayuda a encontrar plantillas; no elige automáticamente una pauta por coincidencia de nombre.

| Ejemplo ficticio | Plantilla asignada | Lugar de una fiscalización |
| --- | --- | --- |
| AV-2026-01, áreas verdes sector norte | Mantención de áreas verdes v1 | Plaza del sector norte |
| AV-2026-02, áreas verdes sector sur | Mantención de áreas verdes v1 o una copia ajustada | Parque del sector sur |
| AS-2026-01, aseo de dependencias | Aseo de dependencias v1 | Edificio municipal |

Reglas para mantener una implementación acotada:
1. Cada contrato tiene una sola versión de checklist activa para iniciar fiscalizaciones.
2. Cada plantilla contiene ítems ordenados, con nombre, criterio verificable y una opción para permitir “No aplica”.
3. Una plantilla en borrador puede editarse. Una versión publicada permanece inmutable; cambiarla crea otra versión.
4. Publicar v2 no reemplaza automáticamente las asignaciones existentes. El administrador decide qué contratos utilizarán v2.
5. Al iniciar una fiscalización se fija la versión de checklist y el umbral utilizados. Un cambio posterior no modifica ese registro, aunque aún sea borrador.
6. Las plantillas y contratos utilizados se archivan en lugar de borrar sus antecedentes.

6.3. Respuestas y cálculo de cumplimiento
Cada ítem comienza sin respuesta. Las respuestas posibles son “Cumple”, “No cumple” y, solo si la plantilla lo permite, “No aplica”. Una casilla desmarcada nunca significa automáticamente “No cumple”.

Propuesta de reglas: “No cumple” requiere una observación y al menos una fotografía vinculada al ítem; “No aplica” requiere una justificación.

cumplimiento = 100 × cantidad_de_Cumple / (cantidad_de_Cumple + cantidad_de_No_cumple)

“No aplica” queda fuera del denominador. No se permite finalizar con ítems sin responder ni con cero ítems aplicables. Un borrador incompleto no alimenta las métricas globales.

Ejemplo: 8 “Cumple”, 2 “No cumple” y 1 “No aplica” producen 80 %. Se compara el valor sin redondear con el umbral; se redondea únicamente para mostrarlo. Si la regla es “menor que 80 %”, 80 % no activa esa alerta. El 80 % es solo un valor de ejemplo configurable, no un estándar municipal.

La alerta por umbral y la existencia de respuestas “No cumple” son conceptos distintos: el detalle siempre muestra las observaciones, incluso cuando el porcentaje no activa una alerta.

6.4. Evidencia, ubicación y autoría
Cada evidencia se asocia a una respuesta, fiscalización y autor. La captura registra fecha/hora y, cuando está disponible, latitud, longitud, precisión y momento de obtención de la ubicación. La recepción por el servidor tiene su propia fecha/hora. La zona horaria de presentación será America/Santiago.

La falta de internet y la falta de GPS son fallas diferentes. Una foto obtenida sin conexión puede tener ubicación. Si no se obtiene ubicación, se conserva la foto con el estado “Sin ubicación” y un motivo; nunca se asigna después la ubicación de la oficina como si fuera la de captura. La ubicación representa una medición de un dispositivo en un momento determinado.

Desde escritorio se podrá capturar con dispositivos compatibles o adjuntar evidencia. Un archivo adjunto se identifica como tal; la posición del computador al subirlo no acredita dónde se tomó la fotografía. La ubicación puede quedar no disponible.

6.5. Estados y sincronización

| Estado | Significado | Edición |
| --- | --- | --- |
| Borrador | Trabajo propio guardado localmente, todavía no finalizado | Sí, por su autor |
| Pendiente de envío | El autor finalizó; falta confirmación del servidor | No; se conserva el paquete para reintento |
| Enviado | El servidor confirmó respuestas y evidencias obligatorias | Solo lectura |

“Enviando” y “Error de envío” son mensajes de la sincronización, no nuevos estados de negocio. El botón Finalizar inicia el envío cuando hay conexión. Si no la hay, comunica “Guardado en este dispositivo. Pendiente de envío”. No muestra “Enviado” antes de recibir confirmación.

Cada fiscalización tiene un identificador estable para que los reintentos no creen duplicados. La aplicación conserva los datos locales hasta la confirmación completa. Las autorizaciones y vigencia se revisan de nuevo en el servidor: si cambiaron, se conserva el trabajo y se informa el impedimento, sin alterar la pauta ni descartar evidencia silenciosamente.

El historial global muestra fiscalizaciones enviadas. Los borradores y pendientes locales aparecen en “Mis reportes” del autor y del dispositivo que los conserva; no se promete acceso a ellos desde otro equipo.

---

6.6. Indicadores y trazabilidad
Inicio del inspector: reportes propios enviados; fecha de última sincronización.

Inicio del administrador: presupuesto de contratos habilitados y vigentes, fiscalizaciones enviadas del período, multas cursadas respecto a categorias, reportes con alerta y porcentaje observado de cumplimiento por contrato. Para cada contrato, el porcentaje del período se calcula con la suma de respuestas “Cumple” dividida por la suma de respuestas aplicables de los reportes incluidos. No se promedian porcentajes de pautas de diferente tamaño sin explicar la regla. Contratos sin inspecciones muestran “Sin datos”.

La trazabilidad conserva identificador, autor, contrato, lugar, versión de pauta, umbral usado, respuestas, evidencias, fecha de captura y recepción. Los cambios de roles, contratos y asignaciones de pauta registran actor y fecha. No se necesita una nueva pantalla de auditoría: el detalle muestra los antecedentes correspondientes.

---

## Requerimientos

7. ## Requerimientos funcionales

| ID | Nombre | Descripción | Rol | Criterio de aceptación propuesto |
| --- | --- | --- | --- | --- |
| RF-01 | Configurar checklist por contrato | Crear, duplicar y publicar listas de verificación; asignar una versión a contratos específicos, conservando las anteriores | Administrador | Un contrato carga su versión asignada; publicar otra no modifica una fiscalización ya iniciada |
| RF-02 | Consultar panel de seguimiento | Mostrar contratos vigentes, fiscalizaciones enviadas, alertas y cumplimiento observado por contrato y período | Administrador | Los indicadores corresponden a los reportes incluidos y muestran período, actualización y estados sin datos |
| RF-03 | Identificar alertas | Generar una alerta visual si el cumplimiento de una fiscalización enviada es inferior al umbral fijado para esa fiscalización | Administrador; autor en su reporte | Con umbral 80, un 70 % genera alerta y un 80 % no; el texto acompaña al color |
| RF-04 | Responder checklist | Registrar Cumple, No cumple o No aplica permitido, en la pauta fijada al iniciar la fiscalización | Ambos | No se finaliza con ítems pendientes; No aplica se excluye del cálculo |
| RF-05 | Vincular evidencia | Capturar o adjuntar fotografías por ítem, conservando origen, autor, fecha y ubicación disponible o excepción explícita | Ambos | La fotografía se abre desde su ítem; un adjunto o captura sin ubicación no se presenta como foto georreferenciada verificada |
| RF-06 | Registrar observaciones | Incorporar observaciones por ítem y una observación general opcional | Ambos | No cumple exige observación; No aplica exige justificación; el reporte conserva su relación con la respuesta |
| RF-07 | Consultar historial y trazabilidad | Consultar fiscalizaciones enviadas y su detalle, filtrando por fecha y contrato; el administrador también por inspector o responsable | Ambos, según alcance | El inspector solo recibe sus reportes; el administrador filtra todos los enviados de la institución, incluidos los propios |
| RF-08 | Crear y finalizar fiscalizaciones | Iniciar un registro con contrato autorizado y lugar, fijar autor/pauta/umbral, guardar borrador y finalizar con confirmación de envío | Ambos | Contratos sin pauta publicada no permiten iniciar; un reintento conserva el mismo registro; nunca se confirma un envío incompleto |
| RF-09 | Administrar contratos | Crear, consultar, actualizar y archivar contratos, incluyendo vigencia, inspectores habilitados, umbral y pauta activa | Administrador | Un inspector solo puede iniciar en contratos habilitados y asignados; archivar no elimina reportes anteriores |
| RF-10 | Administrar accesos | Revisar solicitudes, activar o desactivar cuentas y asignar Inspector o Administrador | Administrador | Una cuenta pendiente no accede a contratos; no es posible cambiar el rol mediante el perfil ni dejar al sistema sin administrador activo |

8. ## Funcionalidades transversales

Estas funcionalidades son necesarias para el funcionamiento general de la aplicación, pero no forman parte de los siete requerimientos funcionales principales del dominio.

| ID | Nombre | Comportamiento |
| --- | --- | --- |
| FT-01 | Solicitar cuenta | Solicitar nombre, correo, contraseña y confirmación. Registrar una solicitud pendiente, sin selector de rol y sin acceso al dominio hasta su activación |
| FT-02 | Sesión | Iniciar y cerrar sesión; informar credenciales inválidas, cuenta pendiente y sesión vencida. El primer administrador se crea mediante configuración inicial controlada |
| FT-03 | Autorización | Restringir vistas y operaciones por rol, estado de cuenta y propiedad o asignación del recurso, comprobándolo también en la API |
| FT-04 | Perfil | Consultar datos, mostrar rol como solo lectura, modificar el nombre y cambiar la contraseña mediante una acción separada que exige la contraseña actual |

9. ## Requerimientos no funcionales

| ID | Nombre / categoría | Requerimiento verificable | Verificación prevista |
| --- | --- | --- | --- |
| RNF-01 | Arquitectura y restricciones técnicas | Una base de interfaz Ionic + React con componentes Ionic, rutas y módulos compartidos. Mantener Docker Compose para el despliegue integrado previsto | Revisar dependencias, organización, componentes y ejecución integrada al llegar a esa etapa |
| RNF-02 | Seguridad | Hash de contraseñas con bcrypt según la pauta, JWT validado en el servidor, HTTPS en despliegue, consultas parametrizadas y permisos por operación/recurso | Comprobar rechazo de token inválido o vencido, de acceso ajeno y de elevación de rol; revisar que no haya secretos en Git |
| RNF-03 | Usabilidad y accesibilidad | Texto base propuesto de 16 px; objetivos táctiles de al menos 44 × 44 CSS px; contraste de texto normal ≥ 4,5:1; etiquetas visibles, estados con texto y navegación por teclado | Medir dimensiones/contraste y recorrer el flujo con teclado y en teléfono; el objetivo 44 px se adopta del criterio mejorado, no se presenta como mínimo AA [S3–S4] |
| RNF-04 | Rendimiento | Meta de sincronización p95 ≤ 5 s en 20 ensayos con un reporte de hasta 2 MiB totales, subida ≥ 10 Mbit/s, latencia ≤ 100 ms y servidor sin carga concurrente | Cronometrar desde inicio del envío hasta confirmación completa; registrar condiciones y fallos. Es una meta de prueba, no un resultado medido ni garantía bajo toda red |
| RNF-05 | Continuidad sin conexión | Permitir responder y capturar evidencia para contratos/pautas ya descargados; persistir localmente y reintentar con conexión y sesión válidas mientras la app esté activa | Crear tres registros sin red, reiniciar la aplicación, recuperar datos, reconectar y comprobar una sola copia completa por registro |
| RNF-06 | Compatibilidad y adaptación | Mantener las mismas funciones autorizadas en móvil y escritorio, con distribución adaptada; comprobar anchos de 360, 768 y 1366 CSS px sin desplazamiento horizontal de la página | Probar en Chrome Android y navegadores de escritorio Chrome, Edge y Firefox, anotando las versiones utilizadas; documentar limitaciones de cámara y ubicación |
| RNF-07 | Integridad y trazabilidad | Conservar versiones publicadas y reportes enviados; registrar actor/fecha de cambios administrativos y mantener separados los datos locales de cada usuario | Cambiar la pauta y comprobar que el reporte anterior no cambia; simular reintento, cuenta distinta y rechazo de sincronización sin pérdida silenciosa |

El uso sin conexión requiere una sesión previamente establecida y recursos descargados. No se promete registro, primera autenticación o administración offline. Tampoco se garantiza sincronización con la aplicación cerrada: al volver a abrirla se retoma el proceso. No se guarda la contraseña para resolver el modo offline.

---

10. ## Arquitectura de Navegación

###Navegación principal.

| Rol | Móvil | Escritorio |
| --- | --- | --- |
| Inspector | Inicio · Nueva · Mis reportes · Perfil | Las mismas opciones en menú lateral |
| Administrador | Inicio · Nueva · Mis reportes · Gestión · Perfil | Las mismas opciones en menú lateral; subsecciones de Gestión desplegadas |

| Ruta propuesta | Vista / relación | Acceso |
| --- | --- | --- |
| `/login` | Inicio de sesión | Pública |
| `/registro` | Solicitud de cuenta; desde login | Pública |
| `/inicio` | Resumen personal o panel según rol | Cuenta activa |
| `/fiscalizaciones/nueva` | Contrato, lugar y creación de borrador | Ambos, según contrato |
| `/fiscalizaciones/:id/editar` | Pauta, evidencia, observaciones y revisión del borrador | Autor del borrador |
| `/mis-reportes` | Lista propia con estados locales y enviados | Ambos |
| `/fiscalizaciones/:id` | Detalle de reporte enviado; desde lista propia o global | Autor o administrador |
| `/perfil` | Datos y sesión | Cuenta activa |
| `/gestion` | Acceso a las cuatro secciones administrativas | Administrador |
| `/gestion/historial` | Consulta global por fecha, contrato y responsable | Administrador |
| `/gestion/contratos` | Lista y formulario de contratos | Administrador |
| `/gestion/contratos/:id` | Detalle, asignaciones y versión de pauta | Administrador |
| `/gestion/checklists` | Plantillas, versiones y editor | Administrador |
| `/gestion/checklists/:id` | Detalle y creación de nueva versión | Administrador |
| `/gestion/usuarios` | Solicitudes, estado y rol de cuentas | Administrador |

Flujos principales
1. Fiscalizar, ambos roles: iniciar sesión → Nueva → elegir contrato habilitado → indicar lugar → obtener pauta fijada → responder ítems y añadir evidencia → revisar faltantes → finalizar → ver confirmación o pendiente de envío. Salir antes permite guardar borrador sin perder respuestas.
2. Preparar contrato, administrador: Gestión → Checklist → crear o duplicar pauta → revisar/publicar versión → Contratos → crear o editar contrato → asignar versión e inspectores → guardar. No hay programación de rondas o asignación diaria en este MVP.
3. Consultar trazabilidad, administrador: Gestión → Historial global → combinar filtros → abrir reporte → revisar autor, versión, respuestas y evidencia → volver manteniendo filtros.
4. Consultar trabajo propio: Mis reportes → elegir estado/filtros → reanudar borrador o abrir reporte enviado → volver al listado.
5. Habilitar cuenta: persona solicita registro → ve estado pendiente → administrador revisa Usuarios y activa el rol correspondiente → la persona puede iniciar sesión y acceder a sus contratos habilitados.

### 5. Redirecciones y puntos críticos de interacción

| Situación | Comportamiento esperado |
| --- | --- |
| Ruta protegida sin sesión | Ir a login; volver al destino solicitado solo si luego se autoriza |
| Inspector abre una ruta administrativa | Mostrar acceso no autorizado y acceso a Inicio; no cargar datos administrativos |
| Cuenta pendiente | Mostrar que requiere activación; no revelar información del dominio |
| Contrato sin pauta o no vigente | Explicar por qué no puede iniciarse; conservar el formulario si ya existía |
| Cambio de contrato después de responder | Confirmar antes de reiniciar el borrador; no mezclar respuestas de pautas distintas |
| Salida con cambios | Permitir guardar borrador o cancelar salida |
| Cámara o ubicación denegadas | Explicar cuál permiso falta y ofrecer reintento; preservar lo ya registrado |
| Envío fallido | Mantener el paquete, mostrar pendiente/error y permitir reintento seguro |
| Sin resultados | Mostrar el estado vacío y permitir limpiar filtros |
| Sesión vence con pendientes | Conservar trabajo aislado por usuario; solicitar autenticación para enviar |
| Publicación de nueva pauta | Mostrar versión y efecto sobre futuras fiscalizaciones; no reescribir las iniciadas |

### 11. Justificación de navegación.

La organización mantiene acceso directo a las tareas frecuentes y agrupa las menos frecuentes del administrador. Compartir rutas y formularios reduce duplicación y conserva el vocabulario entre dispositivos. En móvil se prioriza una columna, objetivos táctiles amplios y lectura rápida; en escritorio se aprovecha el ancho para listas y formularios, sin cambiar las autorizaciones. La separación por módulos permite mantener contratos, pautas y fiscalizaciones sin añadir nuevos roles o subsistemas.

---

## Bocetos UI/UX

[Figma - Prototipo de UI/UX](https://www.figma.com/design/MJbonacpaS2avT47w2sBir/Prototipos-web?node-id=0-1&p=f&t=VI8BijqvhWiDraKM-0)

---

## Tecnologías y herramientas

### Frontend
