<div align="center">
  <img src="client/images/luddees/identity-v2/hero/home-portfolio-breakout-v2.webp" alt="Luddies, marketplace educativo STEM" width="920">

  # Luddies

  **Marketplace educativo STEM para México y Latinoamérica.**

  [![CI](https://github.com/antonio-in-stem/luddees/actions/workflows/ci.yml/badge.svg)](https://github.com/antonio-in-stem/luddees/actions/workflows/ci.yml)
  [![Release](https://img.shields.io/github/v/release/antonio-in-stem/luddees?display_name=tag)](https://github.com/antonio-in-stem/luddees/releases)
  ![Java 21](https://img.shields.io/badge/Java-21-5b5a7d)
  ![License](https://img.shields.io/badge/licencia-todos_los_derechos_reservados-a65b6c)
</div>

Luddies reúne activos pedagógicos bilingües en una experiencia accesible, cálida
y responsive. El repositorio contiene la aplicación web multipágina, una API
REST con Spring Boot, persistencia MySQL y una suite automatizada de calidad.

## Funcionalidad

- Catálogo público con búsqueda, filtros, paginación y fichas de producto.
- Selección persistente, checkout demostrativo y confirmación de pago ficticia.
- Registro, inicio de sesión y autorización administrativa mediante sesión.
- Administración de productos y consulta de usuarios.
- Experiencia completa en español e inglés.
- Diseño responsive, navegación por teclado y preferencias de movimiento reducido.

> [!IMPORTANT]
> El flujo de pago es una demostración: no cobra, no almacena tarjetas y no crea
> órdenes pagadas. La entrega de materiales y la integración real con un proveedor
> de pagos todavía no están habilitadas.

## Arquitectura

```text
client/                         aplicación web HTML, CSS y JavaScript
src/main/java/                  API REST y aplicación Spring Boot
src/test/java/                  pruebas de integración del servidor
server/src_db/main/resources/   esquema y datos iniciales de MySQL
tests/                          pruebas de comportamiento del cliente
docs/                           QA, internacionalización e identidad visual
```

Spring Boot sirve la API bajo `/api/**` y empaqueta el contenido de `client/`
como recursos estáticos. El cliente usa el mismo origen para comunicarse con la
API, sin direcciones de servidor incrustadas en el código.

## Inicio rápido

### Demo del frontend

Requiere Node.js 20 o posterior.

```shell
npm ci --ignore-scripts
npm run serve
```

Abre <http://localhost:4173/>. En modo estático, las cuentas, el catálogo y la
selección se guardan únicamente en el navegador. Consulta
[client/README.md](client/README.md) para conocer las credenciales ficticias y
la selección explícita entre modo demo y API.

### Aplicación completa

Requiere Java 21 y MySQL 8 o posterior.

1. Ejecuta `server/src_db/main/resources/db/create.sql` e `insert.sql`.
2. Define `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`; todas las variables admitidas
   están documentadas en [.env.example](.env.example).
3. Inicia la aplicación:

```shell
./gradlew bootRun
```

Abre <http://localhost:8080/>. Las cuentas sembradas están deshabilitadas y no
poseen una contraseña utilizable. Registra una cuenta y asigna el rol de
administración mediante un operador confiable de la base de datos.

## Verificación

```shell
npm ci --ignore-scripts
npm run check
npm test
./gradlew clean test bootJar
```

Las pruebas Java usan H2 y no necesitan credenciales locales de MySQL. El flujo
de integración continua ejecuta las mismas validaciones en cada cambio a `main`.
El alcance y los resultados de la revisión integral están en
[docs/qa-report.md](docs/qa-report.md).

## Despliegue

- **Demo estática:** publica `client/`; no incluye API ni datos compartidos.
- **Aplicación completa:** ejecuta el JAR con Java 21 detrás de HTTPS, sirve
  cliente y API desde el mismo origen y define `SESSION_COOKIE_SECURE=true`.
- Usa un usuario MySQL restringido y conserva todas las credenciales únicamente
  en variables del entorno del servidor.
- Antes de exponer una base importada desde una versión anterior, deshabilita o
  rota cualquier cuenta de demostración preexistente.

La recuperación de cuentas, verificación de correo, limitación distribuida de
solicitudes y checkout validado mediante webhooks siguen siendo requisitos para
operar transacciones reales.

## Documentación

- [Reporte de QA](docs/qa-report.md)
- [Estrategia de internacionalización](docs/i18n-strategy.md)
- [Sistema de identidad visual](docs/visual-identity/DESIGN.md)
- [Prompts maestros de producción](docs/visual-identity/PROMPT-MASTERS.md)
- [Historial de cambios](CHANGELOG.md)

## Origen y autoría

Este repositorio es una evolución técnica y visual del proyecto de equipo
[EdwinSanchezA720/luddiesHoldings](https://github.com/EdwinSanchezA720/luddiesHoldings).
El repositorio original conserva el concepto y la implementación inicial; esta
versión reúne el refactor posterior y acredita a sus participantes dentro de la
propia experiencia.

## Licencia

Copyright © 2026 Luddies Holdings. Todos los derechos reservados. Este proyecto
es software propietario y no concede permiso de uso, copia, modificación o
distribución. Consulta [LICENSE](LICENSE) para ver los términos completos. Las
dependencias y materiales de terceros conservan las licencias y derechos de sus
respectivos titulares.
