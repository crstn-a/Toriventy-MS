-- Create Users table
CREATE TABLE IF NOT EXISTS `tbl_users` (
  `fld_user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `fld_username` VARCHAR(100) NOT NULL,
  `fld_email` VARCHAR(100) UNIQUE NOT NULL,
  `fld_password_hash` VARCHAR(255) NOT NULL,
  `fld_role` VARCHAR(20) DEFAULT 'user',
  `fld_created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fld_updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Products table
CREATE TABLE IF NOT EXISTS `tbl_products` (
  `fld_product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `fld_name` VARCHAR(255) NOT NULL,
  `fld_description` TEXT,
  `fld_price` DECIMAL(10, 2) NOT NULL,
  `fld_created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fld_updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Suppliers table
CREATE TABLE IF NOT EXISTS `tbl_suppliers` (
  `fld_supplier_id` INT AUTO_INCREMENT PRIMARY KEY,
  `fld_name` VARCHAR(255) NOT NULL,
  `fld_email` VARCHAR(100),
  `fld_phone` VARCHAR(20),
  `fld_address` TEXT,
  `fld_created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fld_updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Stock table
CREATE TABLE IF NOT EXISTS `tbl_stock` (
  `fld_stock_id` INT AUTO_INCREMENT PRIMARY KEY,
  `fld_product_id` INT NOT NULL,
  `fld_quantity` INT DEFAULT 0,
  `fld_reorder_level` INT DEFAULT 10,
  `fld_created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fld_updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`fld_product_id`) REFERENCES `tbl_products`(`fld_product_id`) ON DELETE CASCADE
);
