import pool from "../config.js";

async function migrate() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    console.log("🚀 Running migrations...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255) DEFAULT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("✅ users table ready");

  await connection.query(`
  CREATE TABLE IF NOT EXISTS newaddresses (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    site_user_id BIGINT(20) UNSIGNED NOT NULL,

    -- Basic info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female', 'other') DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL,
    phone VARCHAR(20) NOT NULL,

    -- Address details
    street VARCHAR(255) NOT NULL,
    landmark VARCHAR(255) DEFAULT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,

    -- Extra fields
    address_type ENUM('home','work','other') DEFAULT 'home',
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    latitude DECIMAL(10,8) DEFAULT NULL,
    longitude DECIMAL(11,8) DEFAULT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX (site_user_id),
    CONSTRAINT fk_newaddresses_user FOREIGN KEY (site_user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);


    console.log("✅ addresses table ready");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("✅ categories table ready");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id BIGINT(20) UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        description2 TEXT DEFAULT NULL,

        price DECIMAL(8,2) NOT NULL,
        old_price DECIMAL(8,2) DEFAULT NULL,
        stock INT(11) NOT NULL,
        images LONGTEXT COLLATE utf8mb4_bin DEFAULT NULL,
        one_time TINYINT(1) NOT NULL DEFAULT 0,
        details LONGTEXT COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Stores product details like weight, size, etc.',
        unit_quantity VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (category_id),
        CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("✅ products table ready");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT(20) UNSIGNED DEFAULT NULL,
        product_id BIGINT(20) UNSIGNED NOT NULL,
        quantity INT(11) NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (product_id),
        CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("✅ carts table ready");






    await connection.query(`
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_user_id BIGINT(20) UNSIGNED NOT NULL,
  address_id BIGINT(20) UNSIGNED DEFAULT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
  type ENUM('onetime', 'daily', 'alternative') NOT NULL DEFAULT 'onetime',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (site_user_id),
  INDEX (address_id),
  CONSTRAINT fk_order_user FOREIGN KEY (site_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES newaddresses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);
console.log("✅ orders table ready");

await connection.query(`
  CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT(20) UNSIGNED NOT NULL,
    product_id BIGINT(20) UNSIGNED NOT NULL,
    quantity INT(11) NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    start_date DATE DEFAULT NULL,
    last_delivery_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (order_id),
    INDEX (product_id),
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);
console.log("✅ order_items table ready");

    




    
    await connection.query(`
  CREATE TABLE IF NOT EXISTS banners (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);

    console.log("✅ bannerimag table ready");




await connection.query(`
  CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    img VARCHAR(255) NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    writer VARCHAR(255) NOT NULL,
    short_description TEXT,
    yt_link VARCHAR(255) NULL,
    type ENUM('video', 'img') NOT NULL DEFAULT 'img',
    full_description LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);



    console.log("✅ Blogs table ready");










    await connection.commit();
    console.log("🎉 All migrations completed successfully!");

  } catch (err) {
    await connection.rollback();
    console.error("❌ Migration failed:", err);
  } finally {
    connection.release();
    pool.end();
  }
}

migrate();
