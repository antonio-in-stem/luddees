# Historial de cambios

Los cambios relevantes de Luddies se documentan en este archivo. El proyecto
usa [versionado semántico](https://semver.org/lang/es/).

## [1.0.0] - 2026-09-14

### Añadido

- Experiencia multipágina bilingüe para catálogo, detalle, contacto y legales.
- Flujos de registro, sesión, selección, checkout demostrativo y pago ficticio.
- Panel administrativo para productos y consulta de usuarios.
- API Spring Boot con persistencia MySQL y pruebas aisladas sobre H2.
- Sistema visual Luddies, renders propios y comportamiento responsive.
- Automatización de formato, validación, pruebas de cliente y pruebas Java.

### Seguridad y calidad

- Autorización administrativa aplicada en el servidor y sesiones reforzadas.
- Datos sensibles trasladados a variables de entorno y semillas inseguras
  deshabilitadas.
- Pago bloqueado a datos ficticios sin persistencia de tarjeta ni cobro real.
- Revisión integral de rutas, enlaces, accesibilidad, privacidad y responsividad.

[1.0.0]: https://github.com/antonio-in-stem/luddees/releases/tag/v1.0.0
