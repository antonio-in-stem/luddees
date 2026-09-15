# Requerimientos Tarea 4

## Objetivo
Organizar tareas del equipo para mejorar la pagina `about-us.html`, reutilizando los estilos ya creados en `style.css` y la logica en `script.js`.

## Asignacion de tareas por equipo

### 1) Edwin y Diana - Carrusel en "Nuestro equipo"
- Implementar un carrusel en la seccion **Nuestro equipo** dentro de `about-us.html`.
- Mantener el estilo visual actual de tarjetas (`.brand-card`, `.team-photo`).
- El carrusel debe ser responsive:
  - Mobile: 1 integrante visible
  - Tablet: 2 integrantes visibles
  - Desktop: 3 o 4 integrantes visibles
- Agregar controles de navegacion (prev/next) y soporte tactil que ademas debera de ser transicion automatica.
- Integrar animaciones suaves sin romper el `fade-in`.

**Entregable esperado**
- Seccion "Nuestro equipo" funcionando como carrusel.
- Sin errores de consola y sin romper estilos globales.

---

### 2) Cley y Azul - Footer y redes sociales
- Actualizar el footer para linkear redes sociales reales.
- Agregar icono y enlace de **GitHub** en el footer.
- Verificar accesibilidad:
  - `aria-label` descriptivo por cada enlace social
  - Contraste visual correcto en hover/focus
- Mantener consistencia con la clase `.footer-link`.

**Entregable esperado**
- Footer con enlaces funcionales: Facebook, Instagram, LinkedIn y GitHub.
- Estados hover/focus consistentes con el tema.

---

### 3) Diego y Mary - Tipografia e imagenes profesionales
- Revisar y aplicar tipografia segun la documentacion del proyecto.
- Confirmar jerarquia de fuentes:
  - Titulos (peso 600)
  - Texto principal (400)
  - Texto auxiliar (300 cuando aplique)
- Sustituir imagenes del equipo por versiones profesionales (calidad, encuadre, coherencia visual).
- Optimizar peso de imagenes para carga rapida sin perder calidad percibida.

**Entregable esperado**
- Tipografia alineada a documentacion.
- Imagenes del equipo consistentes, profesionales y optimizadas.

---

### 4) Erick y Toño - Encabezado, logo, traducciones y navegacion
- Colocar el **logo oficial de la compania** en el encabezado (navbar).
- Definir e implementar traducciones de la pagina (ES/EN como minimo) para textos clave:
  - Navbar
  - Hero
  - Secciones informativas
  - CTA y footer
- Hacer que los iconos/enlaces del encabezado (por ahora) redirijan a `about-us.html`.
- Incluir comportamiento similar al boton de inicio.
- Evitar enlaces rotos (`href="#"`) en elementos clave del navbar.
- Mantener estilos y estructura actuales del header.

**Entregable esperado**
- Logo integrado en navbar sin desalinear elementos.
- Contenido traducible con mecanismo claro (por ejemplo, objeto de traducciones en `script.js`).
- Navegacion funcional y consistente en el header.

---

### 5) Leo - Apartado Contactanos con validaciones
- Implementar el apartado/formulario de **Contactanos**.
- Permitir ingresar datos reales (nombre, correo, mensaje y campo adicional que se defina).
- Aplicar validaciones en frontend para evitar datos incorrectos:
  - No permitir numeros en el campo nombre.
  - Validar formato correcto de correo electronico.
  - Bloquear envio si hay campos requeridos vacios.
- Mostrar mensaje claro cuando la informacion se envia correctamente.
- Mantener estilos existentes y coherencia visual con la pagina.

**Entregable esperado**
- Formulario de contacto funcional con validaciones.
- Confirmacion visual de envio exitoso sin errores en consola.

---

## Mejoras recomendadas adicionales (solo About Us)

1. **SEO basico**
   - Agregar meta description en `about-us.html`.
   - Incluir Open Graph (`og:title`, `og:description`, `og:image`) para compartir en redes.

2. **Accesibilidad avanzada**
   - Incluir enlace "Saltar al contenido" al inicio de la pagina.
   - Mejorar foco visible en botones/enlaces (teclado).
   - Validar contraste final con WCAG AA en todos los botones gradiente.

3. **Rendimiento**
   - Cargar imagenes del equipo con `loading="lazy"`.
   - Definir dimensiones de imagen para reducir layout shift.
   - Comprimir imagenes y usar formatos modernos (WebP/AVIF).

4. **Escalabilidad del contenido**
   - Mover datos del equipo (nombre, rol, foto) a un arreglo en `script.js` y renderizar dinamicamente.
   - Facilitar futuras altas/bajas de integrantes sin editar mucho HTML.

5. **Calidad de codigo**
   - Estandarizar nombres de clases y secciones.
   - Mantener comentarios cortos por bloque principal.
   - Agregar checklist de QA al README (responsive, accesibilidad, enlaces, consola limpia).

## Criterios generales de aceptacion
- No romper el layout actual de `about-us.html`.
- Mantener coherencia visual con `style.css`.
- No introducir errores de consola en `script.js`.
- Todos los cambios probados en mobile, tablet y desktop.
