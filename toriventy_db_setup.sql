-- ============================================================================
-- TORIVENTY DATABASE SETUP & REPAIR SCRIPT (WITH FULL UNICODE COLLATION FIXED)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS toriventy_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE toriventy_db;

-- Explicitly force the database to use Unicode collation
ALTER DATABASE toriventy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================================
-- CLEANUP EXISTING TABLES
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS tbl_stock_logs;
DROP TABLE IF EXISTS tbl_stock;
DROP TABLE IF EXISTS tbl_products;
DROP TABLE IF EXISTS tbl_suppliers;
DROP TABLE IF EXISTS tbl_users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- TABLES CREATION (FORCE utf8mb4_unicode_ci TO PREVENT COLLATION MIX ERRORS)
-- ============================================================================

CREATE TABLE tbl_users (
    fld_user_id INT NOT NULL AUTO_INCREMENT,
    fld_username VARCHAR(50) NOT NULL,
    fld_email VARCHAR(100) NOT NULL,
    fld_phone TEXT, -- Encrypted (AES-256-GCM)
    fld_password_hash VARCHAR(255) NOT NULL,
    fld_role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    fld_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (fld_user_id),
    UNIQUE KEY uq_email (fld_email),
    UNIQUE KEY uq_username (fld_username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tbl_suppliers (
    fld_supplier_id INT NOT NULL AUTO_INCREMENT,
    fld_supplierName VARCHAR(150) NOT NULL,
    fld_supplierPhoneNum VARCHAR(20) NOT NULL,
    fld_supplierEmail VARCHAR(100) NOT NULL,
    fld_supplierAddress TEXT NOT NULL,
    fld_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (fld_supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tbl_products (
    fld_product_id INT NOT NULL AUTO_INCREMENT,
    fld_supplier_id INT NOT NULL,
    fld_productName VARCHAR(150) NOT NULL,
    fld_productSKU VARCHAR(50) NOT NULL,
    fld_description TEXT,
    fld_price DECIMAL(10,2) NOT NULL DEFAULT '0.00',
    fld_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (fld_product_id),
    UNIQUE KEY uq_sku (fld_productSKU),
    CONSTRAINT fk_product_supplier FOREIGN KEY (fld_supplier_id) REFERENCES tbl_suppliers (fld_supplier_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tbl_stock (
    fld_stock_id INT NOT NULL AUTO_INCREMENT,
    fld_product_id INT NOT NULL,
    fld_quantity INT NOT NULL DEFAULT 0,
    fld_low_stock_threshold INT NOT NULL DEFAULT 10,
    fld_last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (fld_stock_id),
    UNIQUE KEY uq_stock_product (fld_product_id),
    CONSTRAINT fk_stock_product FOREIGN KEY (fld_product_id) REFERENCES tbl_products (fld_product_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tbl_stock_logs (
    fld_log_id INT NOT NULL AUTO_INCREMENT,
    fld_product_id INT NOT NULL,
    fld_user_id INT NOT NULL,
    fld_quantity_change INT NOT NULL,
    fld_reason VARCHAR(255) DEFAULT NULL,
    fld_logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (fld_log_id),
    CONSTRAINT fk_log_product FOREIGN KEY (fld_product_id) REFERENCES tbl_products (fld_product_id) ON DELETE CASCADE,
    CONSTRAINT fk_log_user FOREIGN KEY (fld_user_id) REFERENCES tbl_users (fld_user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PROCEDURES (WILL AUTOMATICALLY INHERIT utf8mb4_unicode_ci COLLATION)
-- ============================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS deleteSupplier$$
CREATE PROCEDURE deleteSupplier(
    IN p_supplier_id INT
)
BEGIN
    DELETE FROM tbl_suppliers
    WHERE fld_supplier_id = p_supplier_id;
    SELECT ROW_COUNT() AS deleted_rows;
END$$

DROP PROCEDURE IF EXISTS getLowStock$$
CREATE PROCEDURE getLowStock()
BEGIN
    SELECT
        p.fld_product_id,
        p.fld_productName,
        p.fld_productSKU,
        s.fld_supplierName,
        st.fld_quantity,
        st.fld_low_stock_threshold,
        CASE
            WHEN st.fld_quantity = 0 THEN 'out_of_stock'
            WHEN st.fld_quantity <= st.fld_low_stock_threshold THEN 'low'
            ELSE 'ok'
        END AS stock_status
    FROM tbl_products p
    JOIN tbl_stock st ON p.fld_product_id = st.fld_product_id
    JOIN tbl_suppliers s ON p.fld_supplier_id = s.fld_supplier_id
    WHERE st.fld_quantity <= st.fld_low_stock_threshold
    ORDER BY st.fld_quantity ASC;
END$$

DROP PROCEDURE IF EXISTS getProductById$$
CREATE PROCEDURE getProductById(
    IN p_product_id INT
)
BEGIN
    SELECT
        p.*,
        s.fld_supplierName,
        st.fld_quantity,
        st.fld_low_stock_threshold
    FROM tbl_products p
    JOIN tbl_suppliers s ON p.fld_supplier_id = s.fld_supplier_id
    LEFT JOIN tbl_stock st ON p.fld_product_id = st.fld_product_id
    WHERE p.fld_product_id = p_product_id
    LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS getProducts$$
CREATE PROCEDURE getProducts()
BEGIN
    SELECT
        p.*,
        s.fld_supplierName,
        st.fld_quantity,
        st.fld_low_stock_threshold
    FROM tbl_products p
    JOIN tbl_suppliers s ON p.fld_supplier_id = s.fld_supplier_id
    LEFT JOIN tbl_stock st ON p.fld_product_id = st.fld_product_id
    ORDER BY p.fld_productName ASC;
END$$

DROP PROCEDURE IF EXISTS getStockByProduct$$
CREATE PROCEDURE getStockByProduct(
    IN p_product_id INT
)
BEGIN
    SELECT
        p.fld_product_id,
        p.fld_productName,
        p.fld_productSKU,
        st.fld_quantity,
        st.fld_low_stock_threshold,
        CASE
            WHEN st.fld_quantity = 0 THEN 'out_of_stock'
            WHEN st.fld_quantity <= st.fld_low_stock_threshold THEN 'low'
            ELSE 'ok'
        END AS stock_status
    FROM tbl_products p
    JOIN tbl_stock st ON p.fld_product_id = st.fld_product_id
    WHERE p.fld_product_id = p_product_id
    LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS getStockLevels$$
CREATE PROCEDURE getStockLevels()
BEGIN
    SELECT
        p.fld_productName,
        p.fld_productSKU,
        st.fld_quantity,
        st.fld_low_stock_threshold,
        CASE
            WHEN st.fld_quantity = 0 THEN 'out_of_stock'
            WHEN st.fld_quantity <= st.fld_low_stock_threshold THEN 'low'
            ELSE 'ok'
        END AS stock_status
    FROM tbl_products p
    JOIN tbl_stock st ON p.fld_product_id = st.fld_product_id
    ORDER BY st.fld_quantity ASC;
END$$

DROP PROCEDURE IF EXISTS getSupplierInformation$$
CREATE PROCEDURE getSupplierInformation()
BEGIN
    SELECT *
    FROM tbl_suppliers
    ORDER BY fld_supplierName ASC;
END$$

DROP PROCEDURE IF EXISTS getUserByEmail$$
CREATE PROCEDURE getUserByEmail(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT *
    FROM tbl_users
    WHERE fld_email = p_email
    LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS getUserById$$
CREATE PROCEDURE getUserById(
    IN p_user_id INT
)
BEGIN
    SELECT *
    FROM tbl_users
    WHERE fld_user_id = p_user_id
    LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS insertProduct$$
CREATE PROCEDURE insertProduct(
    IN p_supplier_id INT,
    IN p_productName VARCHAR(150),
    IN p_productSKU VARCHAR(50),
    IN p_description TEXT,
    IN p_price DECIMAL(10,2),
    IN p_low_stock_threshold INT
)
BEGIN
    DECLARE v_product_id INT;
    START TRANSACTION;
        INSERT INTO tbl_products (
            fld_supplier_id,
            fld_productName,
            fld_productSKU,
            fld_description,
            fld_price
        )
        VALUES (
            p_supplier_id,
            p_productName,
            p_productSKU,
            p_description,
            p_price
        );
        SET v_product_id = LAST_INSERT_ID();
        INSERT INTO tbl_stock (
            fld_product_id,
            fld_quantity,
            fld_low_stock_threshold
        )
        VALUES (
            v_product_id,
            0,
            p_low_stock_threshold
        );
        SELECT *
        FROM tbl_products
        WHERE fld_product_id = v_product_id;
    COMMIT;
END$$

DROP PROCEDURE IF EXISTS insertSupplierInformation$$
CREATE PROCEDURE insertSupplierInformation(
    IN p_supplierName VARCHAR(150),
    IN p_supplierPhoneNum VARCHAR(20),
    IN p_supplierEmail VARCHAR(100),
    IN p_supplierAddress TEXT
)
BEGIN
    DECLARE v_supplier_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Failed to insert supplier';
    END;
    START TRANSACTION;
        INSERT INTO tbl_suppliers (
            fld_supplierName,
            fld_supplierPhoneNum,
            fld_supplierEmail,
            fld_supplierAddress
        )
        VALUES (
            p_supplierName,
            p_supplierPhoneNum,
            p_supplierEmail,
            p_supplierAddress
        );
        SET v_supplier_id = LAST_INSERT_ID();
        SELECT *
        FROM tbl_suppliers
        WHERE fld_supplier_id = v_supplier_id;
    COMMIT;
END$$

DROP PROCEDURE IF EXISTS registerUser$$
CREATE PROCEDURE registerUser(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone TEXT,
    IN p_password_hash VARCHAR(255),
    IN p_role ENUM('admin', 'user')
)
BEGIN
    INSERT INTO tbl_users (
        fld_username,
        fld_email,
        fld_phone,
        fld_password_hash,
        fld_role
    )
    VALUES (
        p_username,
        p_email,
        p_phone,
        p_password_hash,
        p_role
    );
    SELECT *
    FROM tbl_users
    WHERE fld_user_id = LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS updateStock$$
CREATE PROCEDURE updateStock(
    IN p_product_id INT,
    IN p_user_id INT,
    IN p_quantity_change INT,
    IN p_reason VARCHAR(255)
)
BEGIN
    DECLARE v_current_qty INT DEFAULT 0;
    DECLARE v_new_qty INT DEFAULT 0;
    START TRANSACTION;
        SELECT fld_quantity INTO v_current_qty
        FROM tbl_stock
        WHERE fld_product_id = p_product_id
        FOR UPDATE;
        SET v_new_qty = v_current_qty + p_quantity_change;
        IF v_new_qty < 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Insufficient stock';
        END IF;
        UPDATE tbl_stock
        SET fld_quantity = v_new_qty
        WHERE fld_product_id = p_product_id;
        INSERT INTO tbl_stock_logs (
            fld_product_id,
            fld_user_id,
            fld_quantity_change,
            fld_reason
        )
        VALUES (
            p_product_id,
            p_user_id,
            p_quantity_change,
            p_reason
        );
        SELECT v_current_qty AS previous_quantity, v_new_qty AS new_quantity;
    COMMIT;
END$$

DROP PROCEDURE IF EXISTS updateSupplier$$
CREATE PROCEDURE updateSupplier(
    IN p_supplier_id INT,
    IN p_supplierName VARCHAR(150),
    IN p_supplierPhoneNum VARCHAR(20),
    IN p_supplierEmail VARCHAR(100),
    IN p_supplierAddress TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Failed to update supplier';
    END;
    START TRANSACTION;
        UPDATE tbl_suppliers
        SET
            fld_supplierName = p_supplierName,
            fld_supplierPhoneNum = p_supplierPhoneNum,
            fld_supplierEmail = p_supplierEmail,
            fld_supplierAddress = p_supplierAddress
        WHERE fld_supplier_id = p_supplier_id;
        SELECT *
        FROM tbl_suppliers
        WHERE fld_supplier_id = p_supplier_id;
    COMMIT;
END$$

DROP PROCEDURE IF EXISTS updateUserProfile$$
CREATE PROCEDURE updateUserProfile(
    IN p_user_id INT,
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone TEXT
)
BEGIN
    UPDATE tbl_users
    SET
        fld_username = p_username,
        fld_email = p_email,
        fld_phone = p_phone
    WHERE fld_user_id = p_user_id;
    SELECT *
    FROM tbl_users
    WHERE fld_user_id = p_user_id;
END$$

DELIMITER ;

-- ============================================================================
-- SEED INITIAL SYSTEM DATA (DEFAULT SUPPLIER & DEFAULT ADMIN ACCOUNT)
-- ============================================================================
-- Default Supplier (Needed so products can be created)
INSERT INTO tbl_suppliers (fld_supplier_id, fld_supplierName, fld_supplierPhoneNum, fld_supplierEmail, fld_supplierAddress)
VALUES (1, 'Global Tech Supplies', '0917-123-4567', 'sales@globaltech.com', '123 Industrial Parkway, Suite A')
ON DUPLICATE KEY UPDATE fld_supplierName=fld_supplierName;

-- Default Admin User (Password is 'admin123')
-- Email and Phone are stored in plaintext. Phone is not encrypted in SQL seed, but app will re-save it securely.
INSERT INTO tbl_users (fld_user_id, fld_username, fld_email, fld_phone, fld_password_hash, fld_role)
VALUES (1, 'System Admin', 'admin@toriventy.com', '09123456789', '$2y$10$tZ2wzEew/sR1wD/Ue2G3f.yJc05x.eH5yG1Qy5mO2kZ3T9q0u.G5m', 'admin')
ON DUPLICATE KEY UPDATE fld_username=fld_username;
