# Luddies Client

Frontend multipágina con HTML, CSS, Bootstrap y JavaScript. Conserva la identidad visual de Luddies y los renders existentes; los ajustes de móvil no requieren imágenes nuevas.

## Ejecución

Desde `client`, ejecuta `python -m http.server 5500` y abre `http://localhost:5500/`. No uses `file://`: el encabezado y el pie se cargan como parciales.

Hay dos modos, definidos en `js/config.js`:

- **Demo estática:** localhost en un puerto distinto de 8080 y GitHub Pages. Catálogo, usuarios y selección viven exclusivamente en el navegador. Las cuentas sintéticas `admin@luddies.com.mx` y `user@luddies.com.mx` usan `123456`. No son cuentas de servidor. Usa únicamente datos ficticios y contraseñas no reutilizadas.
- **API:** Spring Boot en el mismo origen. Usa MySQL, BCrypt y una sesión de servidor. Los controles del navegador son presentación; la API comprueba la sesión y el rol de administrador.

Para otro alojamiento estático, establece `window.__LUDDIES_API_BASE_URL__ = ""` antes de cargar `config.js`. Para el modo API, sirve cliente y servidor desde el mismo origen. No se admite un frontend separado con autenticación cross-origin en esta versión.

## Límites explícitos

El pago es una **demostración**, no una pasarela. Los campos bancarios son ficticios y de solo lectura. No hay cobro, pedido pagado persistido, entrega de material ni correo de confirmación. La referencia identifica únicamente la demo.

Contacto necesita los valores públicos `publicKeyContact`, `serviceIdContact` y `templateIdContact` de EmailJS en `js/config.js`. No pongas claves privadas allí. Sin configuración, el formulario informa que no pudo enviar y dirige al correo público de Contacto. No presenta un éxito ficticio. Configura restricciones de origen y protección contra abuso en el proveedor antes de habilitarlo.

## Responsabilidades

| Archivo | Responsabilidad |
| --- | --- |
| `js/config.js` | Elegir demo o API y configuración pública |
| `js/auth.js`, `js/auth-guard.js` | Sesión y acceso de interfaz |
| `js/auth-page.js` | Inicialización compartida de login/registro y aviso de demo |
| `js/layout.js`, `js/auth-ui.js` | Encabezado, pie y navegación según sesión |
| `js/catalog-*` | Catálogo, filtros y selección |
| `js/money.js` | Lectura y presentación compartida de importes MXN |
| `js/checkout.js` | Datos de compra y paginación de cuatro productos |
| `js/payment.js` | Demostración y estado de confirmación |
| `js/contact-form.js` | Validación y envío real cuando está configurado |
| `js/i18n.js`, `js/legal-translations.js` | Traducciones ES/EN |
| `style/pages/` | Estilos específicos de cada página |
| `style/responsive.css` | Adaptación compartida móvil/tablet, foco y movimiento reducido |

Las páginas principales son inicio, catálogo, detalle de producto, nosotros, contacto, compra, pago, administración, login, registro, privacidad y términos. `pago.html` conserva una redirección compatible al pago actual; `404.html` maneja la página inexistente.

## Verificación

Desde la raíz del repositorio:

```sh
npm ci --ignore-scripts
npm run check
npm test
./gradlew test bootJar
```

Los controles verifican sintaxis, referencias locales, IDs, alternativas de imagen, ausencia de comentarios propios y regresiones de autenticación/pago. El informe completo está en `docs/qa-report.md`.

Código propio autodocumentado: usa nombres expresivos y funciones acotadas. La documentación de decisiones vive fuera del código. Conserva las atribuciones y licencias de terceros.
