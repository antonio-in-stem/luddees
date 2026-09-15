

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS luddies_holdings;
CREATE DATABASE luddies_holdings
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE luddies_holdings;

CREATE TABLE roles (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(50)   NOT NULL,
  description VARCHAR(255)  NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email              VARCHAR(255)    NOT NULL,
  password_hash      VARCHAR(255)    NOT NULL,
  full_name          VARCHAR(150)    NOT NULL,
  phone_dial         VARCHAR(8)      NOT NULL DEFAULT '+52',
  phone_number       VARCHAR(20)     NULL,
  role_id            INT UNSIGNED    NOT NULL,
  preferred_language ENUM('es','en') NOT NULL DEFAULT 'es',
  is_active          TINYINT(1)      NOT NULL DEFAULT 1,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_role_id (role_id),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  id        INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  slug      VARCHAR(64)   NOT NULL,
  name_es   VARCHAR(120)  NOT NULL,
  name_en   VARCHAR(120)  NOT NULL,
  is_active TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id               BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title_es         VARCHAR(500)     NOT NULL,
  title_en         VARCHAR(500)     NOT NULL,
  meta_es          VARCHAR(255)     NULL,
  meta_en          VARCHAR(255)     NULL,
  description_es   TEXT             NOT NULL,
  description_en   TEXT             NOT NULL,
  price_amount     DECIMAL(12,2)    NOT NULL,
  currency         CHAR(3)          NOT NULL DEFAULT 'MXN',
  price_display_es VARCHAR(80)      NOT NULL,
  price_display_en VARCHAR(80)      NOT NULL,
  image_url        VARCHAR(1024)    NOT NULL,
  purchasable      TINYINT(1)       NOT NULL DEFAULT 1,
  is_custom        TINYINT(1)       NOT NULL DEFAULT 0,
  is_active        TINYINT(1)       NOT NULL DEFAULT 1,
  created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_title_es (title_es(100)),
  KEY idx_products_active (is_active),
  CONSTRAINT chk_products_price_nonneg CHECK (price_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_categories (
  product_id  BIGINT UNSIGNED NOT NULL,
  category_id INT UNSIGNED    NOT NULL,
  PRIMARY KEY (product_id, category_id),
  KEY fk_pc_category (category_id),
  CONSTRAINT fk_pc_product  FOREIGN KEY (product_id)  REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE carts (
  id         BIGINT UNSIGNED                        NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED                        NOT NULL,
  status     ENUM('ACTIVE','CONVERTED','ABANDONED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME                               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_carts_user_id (user_id),
  KEY idx_carts_status  (status),
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cart_id     BIGINT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  quantity    INT UNSIGNED    NOT NULL,
  unit_price  DECIMAL(12,2)   NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cart_product (cart_id, product_id),
  KEY fk_ci_product (product_id),
  CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id)    REFERENCES carts (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ci_product FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_ci_qty               CHECK (quantity > 0),
  CONSTRAINT chk_ci_unit_price_nonneg CHECK (unit_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id           BIGINT UNSIGNED                               NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(32)                                   NOT NULL,
  user_id      BIGINT UNSIGNED                               NULL,
  guest_email  VARCHAR(255)                                  NULL,
  guest_name   VARCHAR(200)                                  NULL,
  subtotal     DECIMAL(12,2)                                 NOT NULL,
  total        DECIMAL(12,2)                                 NOT NULL,
  currency     CHAR(3)                                       NOT NULL DEFAULT 'MXN',
  status       ENUM('PENDING','PAID','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  locale       ENUM('es','en')                               NOT NULL DEFAULT 'es',
  created_at   DATETIME                                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME                                      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_orders_number (order_number),
  KEY idx_orders_user_id (user_id),
  KEY idx_orders_status  (status),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT chk_orders_total_nonneg CHECK (total >= 0 AND subtotal >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NOT NULL,
  product_title VARCHAR(500)    NOT NULL,
  unit_price    DECIMAL(12,2)   NOT NULL,
  quantity      INT UNSIGNED    NOT NULL,
  line_total    DECIMAL(12,2)   NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order   (order_id),
  KEY idx_order_items_product (product_id),
  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_oi_qty    CHECK (quantity > 0),
  CONSTRAINT chk_oi_prices CHECK (unit_price >= 0 AND line_total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
  id         BIGINT UNSIGNED                      NOT NULL AUTO_INCREMENT,
  order_id   BIGINT UNSIGNED                      NOT NULL,
  reference  VARCHAR(64)                          NOT NULL,
  method     ENUM('CARD')                         NOT NULL DEFAULT 'CARD',
  card_last4 CHAR(4)                              NULL,
  card_brand VARCHAR(50)                          NULL,
  amount     DECIMAL(12,2)                        NOT NULL,
  currency   CHAR(3)                              NOT NULL DEFAULT 'MXN',
  status     ENUM('PENDING','COMPLETED','FAILED') NOT NULL DEFAULT 'PENDING',
  paid_at    DATETIME                             NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_payments_order     (order_id),
  UNIQUE KEY uk_payments_reference (reference),
  KEY idx_payments_status (status),
  CONSTRAINT fk_payments_order       FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_payments_amount     CHECK (amount >= 0),
  CONSTRAINT chk_payments_card_last4 CHECK (
    card_last4 IS NULL OR card_last4 REGEXP '^[0-9]{4}$'
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
