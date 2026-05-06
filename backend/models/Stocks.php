<?php
class Stocks {
    public function __construct(private PDO $pdo) {}

    public function getByProduct(int $productId): ?array {
        $stmt = $this->pdo->prepare("CALL getStockByProduct(?)");
        $stmt->execute([$productId]);
        return $stmt->fetch() ?: null;
    }

    public function updateQuantity(int $productId, int $newQty): void {
        $stmt = $this->pdo->prepare("CALL updateStock(?, ?)");
        $stmt->execute([$productId, $newQty]);
    }

    public function logChange(int $productId, int $userId, int $change, string $reason): void {
        // Log functionality handled by procedure if supported
        // Otherwise kept for compatibility
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