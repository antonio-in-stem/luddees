

USE luddies_holdings;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

SET @pwd_demo = 'DISABLED_SAMPLE_ACCOUNT';

INSERT INTO roles (id, name, description) VALUES
  (1, 'ADMIN', 'Full access to the admin panel and catalog'),
  (2, 'USER',  'Customer with access to catalog, cart and checkout');

INSERT INTO categories (id, slug, name_es, name_en, is_active) VALUES
  (1, 'science',        'Ciencias',        'Science',        1),
  (2, 'technology',     'Tecnología',      'Technology',     1),
  (3, 'engineering',    'Ingeniería',      'Engineering',    1),
  (4, 'mathematics',    'Matemáticas',     'Mathematics',    1),
  (5, 'neurodiversity', 'Neurodiversidad', 'Neurodiversity', 1),
  (6, 'certification',  'Certificación',   'Certification',  1),
  (7, 'physical',       'Kits físicos',    'Physical kits',  1),
  (8, 'dissidents',     'Disidencias STEM','STEM dissidents', 1);

INSERT INTO users (id, email, password_hash, full_name, phone_dial, phone_number, role_id, preferred_language, is_active, created_at) VALUES
  (1, 'admin@example.test', @pwd_demo, 'Sample Admin', '+52', '5550000000', 1, 'es', 0, '2025-01-10 09:00:00'),
  (2, 'user@example.test', @pwd_demo, 'Sample User', '+52', '5550000001', 2, 'es', 0, '2025-01-10 09:05:00'),
  (3, 'sample3@example.test', @pwd_demo, 'Sample Three', '+52', '5550000002', 2, 'es', 0, '2025-02-01 11:00:00'),
  (4, 'sample4@example.test', @pwd_demo, 'Sample Four', '+52', '5550000003', 2, 'en', 0, '2025-02-05 15:20:00'),
  (5, 'sample5@example.test', @pwd_demo, 'Sample Five', '+52', '5550000004', 2, 'es', 0, '2025-03-01 10:00:00'),
  (6, 'sample6@example.test', @pwd_demo, 'Sample Six', '+52', '5550000005', 2, 'es', 0, '2025-03-10 08:30:00');

INSERT INTO products (
  id, title_es, title_en, meta_es, meta_en,
  description_es, description_en,
  price_amount, currency, price_display_es, price_display_en,
  image_url, purchasable, is_custom, is_active, created_at
) VALUES
  (1, 'Física interactiva: energía y movimiento', 'Interactive physics: energy and motion', 'Secundaria · Ciencias', 'Lower secondary · Science', 'Paquete PDF + presentación con demos para secundaria.', 'PDF pack plus slide deck with demos for lower secondary.', 249.00, 'MXN', 'Desde $249 MXN', 'From $249 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-01.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (2, 'Robots en el aula con Scratch', 'Classroom robots with Scratch', 'Primaria · Tecnología', 'Primary · Technology', 'Guión de clase y retos graduados para primer acercamiento a robótica.', 'Lesson script and leveled challenges for a first robotics experience.', 199.00, 'MXN', 'Desde $199 MXN', 'From $199 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-02.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (3, 'Ingeniería basica: estructuras y materiales', 'Intro engineering: structures and materials', 'Primaria · Ingeniería', 'Primary · Engineering', 'Diseños simples con materiales de bajo costo y rúbricas.', 'Low-cost builds with simple rubrics.', 179.00, 'MXN', 'Desde $179 MXN', 'From $179 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-03.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (4, 'Álgebra visual con manipulables', 'Visual algebra with manipulatives', 'Secundaria · Matemáticas', 'Lower secondary · Mathematics', 'Secuencia de actividades para ecuaciones y patrones.', 'Activity sequence for equations and patterns.', 229.00, 'MXN', 'Desde $229 MXN', 'From $229 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-04.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (5, 'Rutinas visuales para aula neurodivergente', 'Visual routines for neurodivergent learners', 'Todos los niveles · Neurodiversidad', 'All levels · Neurodiversity', 'Tableros y pautas de trabajo para TDAH y autismo.', 'Boards and work guides for ADHD and autism-friendly classrooms.', 259.00, 'MXN', 'Desde $259 MXN', 'From $259 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-05.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (6, 'Paquete SEP básico: matemáticas', 'Basic-education math pack (certification-aligned)', 'Primaria · Certificación', 'Primary · Certification', 'Planeación alineada a competencias clave nivel básico.', 'Planning aligned to core competencies at the basic level.', 289.00, 'MXN', 'Desde $289 MXN', 'From $289 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-06.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (7, 'Kit de experiencias STEM (físico)', 'STEM experience kit (physical)', 'Presencial · Kits', 'In person · Kits', 'Narrativa, dinámicas y códigos para taller presencial. Incluye materiales y guía del facilitador.', 'Narrative, activities, and codes for in-person workshops. Includes materials and facilitator guide.', 319.00, 'MXN', 'Desde $319 MXN', 'From $319 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-07.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (8, 'Química segura en casa y en clase', 'Safe chemistry at home and school', 'Secundaria · Ciencias', 'Lower secondary · Science', 'Fichas de laboratorio guiado y fichas de seguridad.', 'Guided lab sheets and safety cards.', 269.00, 'MXN', 'Desde $269 MXN', 'From $269 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-08.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (9, 'Mujeres que cambiaron la ciencia', 'Women who changed science', 'Primaria y Secundaria · Disidencias STEM', 'Primary & Secondary · STEM Dissidents', 'Fichas biográficas y actividades sobre científicas latinoamericanas y globales. Ideal para nivel primaria y secundaria.', 'Biographical cards and activities featuring Latin American and global scientists. Ideal for primary and secondary levels.', 189.00, 'MXN', 'Desde $189 MXN', 'From $189 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-09.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (10, 'Diversidad en tecnología: guía para docentes', 'Diversity in technology: a teacher''s guide', 'Secundaria · Disidencias STEM', 'Secondary · STEM Dissidents', 'Material para conversar sobre identidad, género y comunidad en el aula de tecnología y programación.', 'Materials for discussing identity, gender, and community in technology and coding classrooms.', 219.00, 'MXN', 'Desde $219 MXN', 'From $219 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-10.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (11, 'STEM sin etiquetas: kit de actividades inclusivas', 'STEM without labels: inclusive activity kit', 'Todos los niveles · Disidencias STEM', 'All levels · STEM Dissidents', 'Dinámicas y tarjetas para fomentar la participación de estudiantes LGBTQ+, neurodivergentes y de comunidades subrepresentadas.', 'Activities and cards to encourage participation from LGBTQ+, neurodivergent, and underrepresented students.', 239.00, 'MXN', 'Desde $239 MXN', 'From $239 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-11.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (12, 'Sensorial y Estructura: Kit de Aprendizaje Predecible', 'Sensory & Structure: Predictable Learning Toolkit', 'Todos los niveles · Neurodiversidad', 'All levels · Neurodivergent Focus', 'Agendas visuales, herramientas de modulación sensorial y tareas estructuradas diseñadas para reducir la ansiedad y mejorar la concentración en estudiantes autistas.', 'Visual schedules, sensory modulation tools, and structured tasks designed to reduce anxiety and enhance focus for autistic learners.', 539.00, 'MXN', 'Desde $539 MXN', 'From $539 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-12.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (13, 'Explorador del sistema solar', 'Solar system explorer', 'Primaria · Ciencias', 'Primary · Science', 'Modelo orbital, fases lunares y tarjetas de observación para aprender jugando.', 'An orbital model, moon phases, and observation cards for playful discovery.', 229.00, 'MXN', 'Desde $229 MXN', 'From $229 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-13.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (14, 'Laboratorio de células con microscopio', 'Microscope cell laboratory', 'Secundaria · Ciencias', 'Lower secondary · Science', 'Secuencia visual para comparar células animales y vegetales con actividades guiadas.', 'A visual sequence for comparing animal and plant cells through guided activities.', 279.00, 'MXN', 'Desde $279 MXN', 'From $279 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-14.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (15, 'Redes tróficas y ecosistemas', 'Food webs and ecosystems', 'Primaria · Ciencias', 'Primary · Science', 'Construye cadenas alimentarias y analiza cómo cambia un hábitat.', 'Build food chains and investigate how changes affect a habitat.', 239.00, 'MXN', 'Desde $239 MXN', 'From $239 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-15.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (16, 'Estación meteorológica escolar', 'Classroom weather station', 'Primaria y Secundaria · Ciencias', 'Primary & Secondary · Science', 'Registra lluvia, viento y temperatura con retos de investigación semanales.', 'Track rain, wind, and temperature through weekly investigation challenges.', 349.00, 'MXN', 'Desde $349 MXN', 'From $349 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-16.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (17, 'Programación sin pantallas', 'Screen-free coding adventures', 'Primaria · Tecnología', 'Primary · Technology', 'Retos de secuencias, ciclos y decisiones mediante mapas y tarjetas táctiles.', 'Practice sequences, loops, and decisions with tactile maps and cards.', 189.00, 'MXN', 'Desde $189 MXN', 'From $189 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-17.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (18, 'IA para mentes curiosas', 'AI for curious minds', 'Secundaria · Tecnología', 'Lower secondary · Technology', 'Patrones, decisiones y ética de la inteligencia artificial explicados sin tecnicismos.', 'Patterns, decisions, and AI ethics explained without unnecessary jargon.', 249.00, 'MXN', 'Desde $249 MXN', 'From $249 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-18.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (19, 'Ciudadanía digital y seguridad', 'Digital citizenship and safety', 'Primaria y Secundaria · Tecnología', 'Primary & Secondary · Technology', 'Privacidad, convivencia y pensamiento crítico para navegar comunidades digitales.', 'Privacy, community, and critical thinking for healthy digital participation.', 199.00, 'MXN', 'Desde $199 MXN', 'From $199 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-19.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (20, 'Energía renovable y circuitos', 'Renewable energy and circuits', 'Secundaria · Ingeniería', 'Lower secondary · Engineering', 'Conecta modelos solares y eólicos para comprender generación y consumo.', 'Connect solar and wind models to understand generation and consumption.', 329.00, 'MXN', 'Desde $329 MXN', 'From $329 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-20.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (21, 'Reto del puente sobre agua', 'Bridge over water challenge', 'Primaria · Ingeniería', 'Primary · Engineering', 'Diseña, prueba y mejora estructuras con restricciones y materiales accesibles.', 'Design, test, and improve structures using accessible materials and constraints.', 219.00, 'MXN', 'Desde $219 MXN', 'From $219 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-21.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (22, 'Diseño 3D y prototipado rápido', '3D design and rapid prototyping', 'Secundaria · Ingeniería', 'Lower secondary · Engineering', 'Del boceto al modelo: volumen, escala, iteración y prueba de soluciones.', 'Move from sketch to model through volume, scale, iteration, and testing.', 299.00, 'MXN', 'Desde $299 MXN', 'From $299 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-22.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (23, 'Fracciones en la cocina', 'Fractions in the kitchen', 'Primaria · Matemáticas', 'Primary · Mathematics', 'Recetas, porciones y equivalencias para volver visibles las fracciones.', 'Use recipes, portions, and equivalence to make fractions visible.', 179.00, 'MXN', 'Desde $179 MXN', 'From $179 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-23.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (24, 'Ciudad geométrica', 'Geometry city', 'Primaria · Matemáticas', 'Primary · Mathematics', 'Construye una ciudad con sólidos, ángulos, perímetros y escalas.', 'Build a city while exploring solids, angles, perimeter, and scale.', 209.00, 'MXN', 'Desde $209 MXN', 'From $209 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-24.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (25, 'Datos que cuentan historias', 'Data that tells stories', 'Secundaria · Matemáticas', 'Lower secondary · Mathematics', 'Recolecta información y conviértela en gráficas que explican hallazgos.', 'Collect information and turn it into graphs that explain findings.', 229.00, 'MXN', 'Desde $229 MXN', 'From $229 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-25.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (26, 'Funciones ejecutivas paso a paso', 'Executive functions step by step', 'Todos los niveles · Neurodiversidad', 'All levels · Neurodiversity', 'Prioridades, tiempos y secuencias visuales para organizar tareas con autonomía.', 'Visual priorities, timing, and sequences for more independent task planning.', 259.00, 'MXN', 'Desde $259 MXN', 'From $259 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-26.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (27, 'Rincón sensorial y respiración', 'Sensory and breathing corner', 'Todos los niveles · Kit físico', 'All levels · Physical kit', 'Guía física para crear pausas de regulación respetuosas dentro del aula.', 'A physical guide for creating respectful regulation breaks in the classroom.', 389.00, 'MXN', 'Desde $389 MXN', 'From $389 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-27.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (28, 'Evaluación inclusiva multimodal', 'Inclusive multimodal assessment', 'Docentes · Certificación', 'Educators · Certification', 'Rúbricas y alternativas visuales, orales y prácticas para demostrar aprendizaje.', 'Rubrics and visual, oral, and hands-on ways to demonstrate learning.', 289.00, 'MXN', 'Desde $289 MXN', 'From $289 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-28.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (29, 'Planeación SEP: ciencias', 'Science curriculum planning pack', 'Primaria · Certificación', 'Primary · Certification', 'Proyectos de materia, vida y Tierra alineados a aprendizajes clave.', 'Matter, life, and Earth projects aligned to core learning goals.', 309.00, 'MXN', 'Desde $309 MXN', 'From $309 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-29.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (30, 'Facilitación de experiencias STEM', 'Facilitating STEM experiences', 'Docentes · Certificación', 'Educators · Certification', 'Ruta docente para formular preguntas, acompañar equipos y retroalimentar prototipos.', 'An educator pathway for questions, teamwork, and prototype feedback.', 499.00, 'MXN', 'Desde $499 MXN', 'From $499 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-30.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (31, 'Misión espacial: kit físico', 'Space mission physical kit', 'Primaria · Kit físico', 'Primary · Physical kit', 'Terreno lunar, cohete, órbitas y bitácora para una misión colaborativa.', 'Moon terrain, rocket, orbital challenges, and a collaborative mission log.', 649.00, 'MXN', 'Desde $649 MXN', 'From $649 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-31.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (32, 'Laboratorio de circuitos', 'Circuit laboratory', 'Primaria y Secundaria · Kit físico', 'Primary & Secondary · Physical kit', 'Batería, interruptor, luz y motor en módulos seguros para experimentar.', 'Safe battery, switch, light, and motor modules for hands-on experiments.', 579.00, 'MXN', 'Desde $579 MXN', 'From $579 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-32.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (33, 'Pioneras del código', 'Women pioneers of coding', 'Secundaria · Disidencias STEM', 'Secondary · STEM Dissidents', 'Historias y retos inspirados en mujeres que transformaron la computación.', 'Stories and challenges inspired by women who transformed computing.', 219.00, 'MXN', 'Desde $219 MXN', 'From $219 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-33.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (34, 'Saberes indígenas y ciencia', 'Indigenous knowledge and science', 'Primaria y Secundaria · Disidencias STEM', 'Primary & Secondary · STEM Dissidents', 'Semillas, cielo, agua y geometría desde conocimientos comunitarios latinoamericanos.', 'Seeds, sky, water, and geometry through Latin American community knowledge.', 269.00, 'MXN', 'Desde $269 MXN', 'From $269 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-34.webp', 1, 0, 1, '2025-01-15 12:00:00'),
  (35, 'Makerspace accesible', 'Accessible makerspace', 'Todos los niveles · Disidencias STEM', 'All levels · STEM Dissidents', 'Herramientas adaptadas y retos abiertos para que todas las personas puedan crear.', 'Adapted tools and open challenges so every learner can build and create.', 599.00, 'MXN', 'Desde $599 MXN', 'From $599 MXN', '../images/luddees/identity-v2/covers/catalog-v2/catalog-cover-35.webp', 1, 0, 1, '2025-01-15 12:00:00');

INSERT INTO product_categories (product_id, category_id) VALUES
  (1,  1),  -- Physics → Science
  (2,  2),  -- Robots → Technology
  (3,  3),  -- Engineering → Engineering
  (3,  2),  -- Engineering → Technology
  (4,  4),  -- Algebra → Mathematics
  (5,  5),  -- Visual routines → Neurodiversity
  (6,  6),  -- SEP pack → Certification
  (6,  4),  -- SEP pack → Mathematics
  (7,  7),  -- STEM kit → Physical kits
  (7,  1),  -- STEM kit → Science
  (8,  1),  -- Chemistry → Science
  (9,  8),  -- Women in science → STEM Dissidents
  (10, 8),  -- Diversity in tech → STEM Dissidents
  (10, 2),  -- Diversity in tech → Technology
  (11, 8),  -- STEM without labels → STEM Dissidents
  (11, 5),  -- STEM without labels → Neurodiversity
  (12, 5),  -- Sensory kit → Neurodiversity
  (12, 8),  -- Sensory kit → STEM Dissidents
  (13, 1),  -- Curricular pack → Science
  (14, 4);  -- Data lab → Mathematics

INSERT INTO carts (id, user_id, status, created_at) VALUES
  (1, 2, 'ACTIVE',    '2025-04-10 10:00:00'),
  (2, 3, 'CONVERTED', '2025-04-08 16:00:00'),
  (3, 4, 'ABANDONED', '2025-04-05 12:00:00');

INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 249.00),
  (1, 5, 1, 259.00),
  (3, 9, 1, 189.00);

INSERT INTO orders (
  id, order_number, user_id, guest_email, guest_name,
  subtotal, total, currency, status, locale, created_at
) VALUES
  (1, 'ORD-20250415-8F3K', NULL, 'publico@ejemplo.com', 'Visitante demo',
   588.00, 588.00, 'MXN', 'PAID', 'es', '2025-04-15 14:30:00'),

  (2, 'ORD-20250416-2M7R', 2, NULL, NULL,
   378.00, 378.00, 'MXN', 'PAID', 'es', '2025-04-16 11:00:00'),

  (3, 'ORD-20250418-9X1P', 6, NULL, NULL,
   539.00, 539.00, 'MXN', 'PAID', 'es', '2025-04-18 09:45:00');

INSERT INTO order_items (order_id, product_id, product_title, unit_price, quantity, line_total) VALUES
  (1, 7,  'Kit de experiencias STEM (físico)',                     319.00, 1, 319.00),
  (1, 8,  'Química segura en casa y en clase',                    269.00, 1, 269.00),
  (2, 2,  'Robots en el aula con Scratch',                        199.00, 1, 199.00),
  (2, 3,  'Ingeniería básica: estructuras y materiales',          179.00, 1, 179.00),
  (3, 12, 'Sensorial y Estructura: Kit de Aprendizaje Predecible', 539.00, 1, 539.00);

INSERT INTO payments (
  order_id, reference, method, card_last4, card_brand,
  amount, currency, status, paid_at
) VALUES
  (1, 'LUD-K7M2N', 'CARD', '4242', 'Visa',       588.00, 'MXN', 'COMPLETED', '2025-04-15 14:31:00'),
  (2, 'LUD-P9Q4R', 'CARD', '1831', 'Mastercard', 378.00, 'MXN', 'COMPLETED', '2025-04-16 11:02:00'),
  (3, 'LUD-W1X8Y', 'CARD', '9047', 'Visa',       539.00, 'MXN', 'COMPLETED', '2025-04-18 09:46:00');

SET FOREIGN_KEY_CHECKS = 1;
