

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
  (1,
   'Física interactiva: energía y movimiento',
   'Interactive physics: energy and motion',
   'Secundaria · Ciencias', 'Lower secondary · Science',
   'Paquete PDF + presentación con demos para secundaria.',
   'PDF pack plus slide deck with demos for lower secondary.',
   249.00, 'MXN', 'Desde $249 MXN', 'From $249 MXN',
   'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (2,
   'Robots en el aula con Scratch',
   'Classroom robots with Scratch',
   'Primaria · Tecnología', 'Primary · Technology',
   'Guión de clase y retos graduados para primer acercamiento a robótica.',
   'Lesson script and leveled challenges for a first robotics experience.',
   199.00, 'MXN', 'Desde $199 MXN', 'From $199 MXN',
   'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (3,
   'Ingeniería básica: estructuras y materiales',
   'Intro engineering: structures and materials',
   'Primaria · Ingeniería', 'Primary · Engineering',
   'Diseños simples con materiales de bajo costo y rúbricas.',
   'Low-cost builds with simple rubrics.',
   179.00, 'MXN', 'Desde $179 MXN', 'From $179 MXN',
   'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (4,
   'Álgebra visual con manipulables',
   'Visual algebra with manipulatives',
   'Secundaria · Matemáticas', 'Lower secondary · Mathematics',
   'Secuencia de actividades para ecuaciones y patrones.',
   'Activity sequence for equations and patterns.',
   229.00, 'MXN', 'Desde $229 MXN', 'From $229 MXN',
   'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (5,
   'Rutinas visuales para aula neurodivergente',
   'Visual routines for neurodivergent learners',
   'Todos los niveles · Neurodiversidad', 'All levels · Neurodiversity',
   'Tableros y pautas de trabajo para TDAH y autismo.',
   'Boards and work guides for ADHD and autism-friendly classrooms.',
   259.00, 'MXN', 'Desde $259 MXN', 'From $259 MXN',
   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (6,
   'Paquete SEP básico: matemáticas',
   'Basic-education math pack (certification-aligned)',
   'Primaria · Certificación', 'Primary · Certification',
   'Planeación alineada a competencias clave nivel básico.',
   'Planning aligned to core competencies at the basic level.',
   289.00, 'MXN', 'Desde $289 MXN', 'From $289 MXN',
   'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (7,
   'Kit de experiencias STEM (físico)',
   'STEM experience kit (physical)',
   'Presencial · Kits', 'In person · Kits',
   'Narrativa, dinámicas y códigos para taller presencial. Incluye materiales y guía del facilitador.',
   'Narrative, activities, and codes for in-person workshops. Includes materials and facilitator guide.',
   319.00, 'MXN', 'Desde $319 MXN', 'From $319 MXN',
   'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (8,
   'Química segura en casa y en clase',
   'Safe chemistry at home and school',
   'Secundaria · Ciencias', 'Lower secondary · Science',
   'Fichas de laboratorio guiado y fichas de seguridad.',
   'Guided lab sheets and safety cards.',
   269.00, 'MXN', 'Desde $269 MXN', 'From $269 MXN',
   'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (9,
   'Mujeres que cambiaron la ciencia',
   'Women who changed science',
   'Primaria y Secundaria · Disidencias STEM', 'Primary & Secondary · STEM Dissidents',
   'Fichas biográficas y actividades sobre científicas latinoamericanas y globales.',
   'Biographical cards and activities featuring Latin American and global scientists.',
   189.00, 'MXN', 'Desde $189 MXN', 'From $189 MXN',
   'https://images.unsplash.com/photo-1676285773909-c19b900d3f12?w=1000&auto=format&fit=crop&q=60',
   1, 0, 1, '2025-01-15 12:00:00'),

  (10,
   'Diversidad en tecnología: guía para docentes',
   'Diversity in technology: a teacher''s guide',
   'Secundaria · Disidencias STEM', 'Secondary · STEM Dissidents',
   'Material para conversar sobre identidad, género y comunidad en el aula de tecnología.',
   'Materials for discussing identity, gender, and community in technology classrooms.',
   219.00, 'MXN', 'Desde $219 MXN', 'From $219 MXN',
   'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (11,
   'STEM sin etiquetas: kit de actividades inclusivas',
   'STEM without labels: inclusive activity kit',
   'Todos los niveles · Disidencias STEM', 'All levels · STEM Dissidents',
   'Dinámicas y tarjetas para fomentar la participación de estudiantes LGBTQ+ y neurodivergentes.',
   'Activities and cards to encourage participation from LGBTQ+ and neurodivergent students.',
   239.00, 'MXN', 'Desde $239 MXN', 'From $239 MXN',
   'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
   1, 0, 1, '2025-01-15 12:00:00'),

  (12,
   'Sensorial y Estructura: Kit de Aprendizaje Predecible',
   'Sensory & Structure: Predictable Learning Toolkit',
   'Todos los niveles · Neurodiversidad', 'All levels · Neurodivergent Focus',
   'Agendas visuales y tareas estructuradas para reducir la ansiedad en estudiantes autistas.',
   'Visual schedules and structured tasks to reduce anxiety for autistic learners.',
   539.00, 'MXN', 'Desde $539 MXN', 'From $539 MXN',
   'https://plus.unsplash.com/premium_photo-1684173662177-2cfca11897ba?w=1000&auto=format&fit=crop&q=60',
   1, 0, 1, '2025-01-15 12:00:00'),

  (13,
   'Paquete curricular STEM (personalizado)',
   'Custom STEM curricular pack',
   'Administración · Paquete', 'Admin · Bundle',
   'Planificación y recursos para un programa STEM transversal en primaria y secundaria.',
   'Planning and resources for a cross-cutting STEM program in primary and lower secondary.',
   349.00, 'MXN', 'Desde $349 MXN', 'From $349 MXN',
   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
   1, 1, 1, '2025-04-01 09:00:00'),

  (14,
   'Mini laboratorio de datos en el aula',
   'Mini classroom data lab',
   'Secundaria · Datos', 'Secondary · Data',
   'Introducción práctica a datos con hojas y visualizaciones guiadas.',
   'Hands-on introduction to data with worksheets and guided visualizations.',
   129.00, 'MXN', 'Desde $129 MXN', 'From $129 MXN',
   'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
   1, 1, 1, '2025-04-02 11:00:00');

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
