<?php
namespace Models;

use PDO;

class Stocks {
    public function __construct(private PDO $pdo) {}

    public function getByProduct(int $productId): ?array {
        $stmt = $this->pdo->prepare("CALL getStockByProduct(?)");
        $stmt->execute([$productId]);
        return $stmt->fetch() ?: null;
    }

    public function updateQuantity(int $productId, int $userId, int $change, string $reason): array {
        // Procedure signature: updateStock(p_product_id, p_user_id, p_quantity_change, p_reason) (4 parameters)
        $stmt = $this->pdo->prepare("CALL updateStock(?, ?, ?, ?)");
        $stmt->execute([$productId, $userId, $change, $reason]);
        return $stmt->fetch() ?: [];
    }

    public function allLevels(): array {
        $stmt = $this->pdo->prepare("CALL getStockLevels()");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function lowStock(): array {
        $stmt = $this->pdo->prepare("CALL getLowStock()");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getLogs(int $productId): array {
        $stmt = $this->pdo->prepare("CALL getStockLogs(?)");
        $stmt->execute([$productId]);
        return $stmt->fetchAll();
    }
}