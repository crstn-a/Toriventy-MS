<?php
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
        $stmt = $this->pdo->prepare("CALL insertProduct(?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['supplier_id'],
            $data['productName'],
            $data['productSKU'],
            $data['description'] ?? '',
            $data['price'],
        ]);
        $result = $stmt->fetch();
        return $result ? (int)$result['fld_product_id'] : 0;
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->pdo->prepare("CALL updateProduct(?, ?, ?, ?, ?, ?)");
        return $stmt->execute([
            $id,
            $data['supplier_id'],
            $data['productName'],
            $data['productSKU'],
            $data['description'] ?? '',
            $data['price'],
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->pdo->prepare("CALL deleteProduct(?)");
        return $stmt->execute([$id]);
    }
}