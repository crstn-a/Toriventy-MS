<?php
namespace Models;

use PDO;

class Products {
    public function __construct(private PDO $pdo) {}

    public function getAll(): array {
        $stmt = $this->pdo->prepare("CALL getProducts()");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->pdo->prepare("CALL getProductById(?)");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function insert(array $data): int {
        // Procedure signature: insertProduct(supplier_id, productName, productSKU, description, price, low_stock_threshold) (6 parameters)
        $stmt = $this->pdo->prepare("CALL insertProduct(?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['supplier_id'],
            $data['productName'],
            $data['productSKU'],
            $data['description'] ?? '',
            $data['price'],
            $data['low_stock_threshold'] ?? 10,
        ]);
        $result = $stmt->fetch();
        return $result ? (int)$result['fld_product_id'] : 0;
    }

    public function update(int $id, array $data): bool {
        // Standard SQL query since there is no updateProduct procedure in the DB schema
        $stmt = $this->pdo->prepare(
            "UPDATE tbl_products 
             SET fld_supplier_id = ?, fld_productName = ?, fld_productSKU = ?, fld_description = ?, fld_price = ? 
             WHERE fld_product_id = ?"
        );
        return $stmt->execute([
            $data['supplier_id'],
            $data['productName'],
            $data['productSKU'],
            $data['description'] ?? '',
            $data['price'],
            $id
        ]);
    }

    public function delete(int $id): bool {
        // Standard SQL query since there is no deleteProduct procedure in the DB schema
        $stmt = $this->pdo->prepare("DELETE FROM tbl_products WHERE fld_product_id = ?");
        return $stmt->execute([$id]);
    }
}