# Revisión integral de calidad

Fecha: 14 de septiembre de 2026.

## Alcance y criterios

Se revisaron todas las páginas del cliente, sus enlaces y recursos locales, los recorridos principales y la autorización del servidor. El criterio visual fue conservar los personajes, fondos y estilo existentes, adaptando la composición a cada ancho. No se generaron ni reemplazaron renders y se conservaron las versiones archivadas de los heroes.

## Cobertura de interfaz

| Página | Comprobación |
| --- | --- |
| Inicio | Hero, navegación, ancho de texto, ilustración y desbordamiento |
| Catálogo | Carga, recursos locales y composición responsive |
| Producto | Detalle con ID válido y botón Adquirir; aviso y selección actualizada |
| Nosotros | Carga, contenido y ausencia de desbordamiento horizontal |
| Contacto | Hero, formulario, cuatro errores simultáneos, foco, ES/EN y estado sin proveedor |
| Compra | Hero, carrito vacío, formulario, un producto, cinco productos y paginación 4+1 |
| Pago | Resumen, total, correo, campos ficticios bloqueados y estado de confirmación |
| Administración | Hero, tabla transformada para móvil y acceso por rol |
| Login / registro | Formularios, aviso de demo, posiciones compartidas en escritorio/tablet, acceso y salida |
| Privacidad / términos | Contenido, recursos y mini heroes adaptados |
| 404 | Carga y ajuste a los tres anchos de prueba |
| Entradas y redirecciones | Referencias de los 15 archivos HTML y compatibilidad de `pago.html` |

Se midieron 320, 768 y 1440 píxeles de viewport en Chromium integrado; se inspeccionaron adicionalmente pantallas a 390 píxeles. Sin desbordamiento horizontal de documento ni imágenes locales rotas en las páginas revisadas tras los fixes. Login y registro se verificaron sin sesión para evitar confundir su redirección con la página real. No equivale a una prueba en Safari/iOS o dispositivos físicos.

En las pruebas funcionales se confirmó Adquirir, cambio de página del carrito sin alterar el total, avance del checkout mediante Enter, menú móvil, cambio de idioma y login/logout de demostración. La transición de éxito de pago se verificó con un DOM simulado aislado: no se realizaron pagos ni envíos y no se vació el carrito existente del usuario para probarla.

## Correcciones y refactorización

- Composición apilada de mini heroes y renders en móvil; retirada de posicionamientos que provocaban recortes y desbordamientos.
- Tratamiento especial de títulos largos, formularios, tablas, carritos y tarjetas bancarias en pantallas estrechas.
- Eliminación de la clase de desbordamiento del hero principal y ajuste del render en escritorios intermedios.
- Contenido de hero visible sin depender de la animación; alternativa de movimiento reducido y foco de teclado visible.
- Módulo compartido `money.js`, preservando centavos, con verificación del orden de carga.
- Checkout con evento submit del formulario y navegación directa a la página actual de pago.
- Validación simultánea de los campos de contacto y traducción de errores ya visibles al cambiar de idioma.
- Corrección de opciones y etiquetas ES/EN de contacto, registro y hero.
- Etiqueta de disponibilidad del detalle vinculada al estado del producto; el booleano `false` también impide adquirirlo.
- Inicialización de login/registro extraída a `auth-page.js`.
- Eliminación del módulo obsoleto de creación de pagos desde el cliente y de los archivos antiguos de la pantalla provisional.
- Retirada de comentarios del HTML, CSS, JavaScript, Java y SQL propios. Se conservaron atribuciones/licencias de terceros y documentación externa.

## Seguridad y datos

- Redirección postlogin limitada a HTTP(S) del mismo origen, sin doble decodificación.
- Sesión de servidor creada al autenticar, rotación de sesión previa y logout que la invalida.
- Lecturas públicas limitadas al catálogo. Recursos privados y mutaciones requieren administrador comprobado en servidor; no se confía en el rol del navegador.
- Rechazo de escrituras cross-site, respuestas API no cacheables, cookies HTTP-only/SameSite Strict y errores sin trazas públicas.
- Validación de longitud de contraseña y datos de registro también en servidor.
- Cuentas SQL de muestra desactivadas y sin hash utilizable. No se modificó la base de datos local existente.
- Pago marcado como demo: no acepta datos bancarios reales, no registra pedidos pagados ni afirma enviar correos/material. Recibo mínimo sin nombre, correo ni tarjeta.
- Aviso en autenticación estática para no introducir datos reales ni contraseñas reutilizadas. La demo conserva su almacenamiento local; no sustituye autenticación productiva.
- Búsqueda en el árbol publicado de rutas personales, marcadores de secretos y comentarios residuales; no se detectaron secretos de los patrones revisados. Se preservaron datos públicos intencionales del equipo, contacto y atribución del proyecto. La versión 1.0.0 se publica desde un commit raíz nuevo para retirar el historial anterior de las referencias Git activas.

## Verificación automatizada

- `npm run check`: sintaxis JS/CSS/HTML, comentarios propios, enlaces y recursos locales, IDs duplicados y alternativas de imagen; 15 entradas HTML.
- `npm test`: seis pruebas de redirección segura, importes, expiración, ausencia de escrituras de pago real, dependencias/submit y confirmación idempotente sin datos personales en recibo.
- `gradlew test bootJar`: pruebas H2 del servidor y empaquetado del cliente dentro del JAR.
- `npm audit --audit-level=high`: cero vulnerabilidades notificadas para las dependencias npm de verificación.
- CI ampliada para ejecutar validación y pruebas del cliente junto al build Java.

## Antes de un servicio comercial real

La demo está preparada para revisión/publicación estática, no para cobrar o entregar recursos. Falta integrar una pasarela real validada en servidor, webhooks, entrega de material y correo. Contacto requiere configuración del proveedor. Para exponer el backend: HTTPS del mismo origen, cookies Secure, credenciales y permisos de DB restringidos, administrador no compartido y desactivación/rotación de semillas antiguas ya importadas. Quedan como trabajo productivo el control de abuso, verificación de correo y recuperación de cuentas.

La publicación del código no constituye un despliegue del backend ni habilita pagos o entrega de materiales.
