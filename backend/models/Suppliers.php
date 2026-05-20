<?php
namespace Models;

use PDO;

class Suppliers {
    public function __construct(private PDO $pdo) {}

    public function getAll(): array {
        $stmt = $this->pdo->prepare("CALL getSupplierInformation()");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function insert(array $data): array {
        // Procedure signature: insertSupplierInformation(supplierName, supplierPhoneNum, supplierEmail, supplierAddress) (4 parameters)
        $stmt = $this->pdo->prepare(
            "CALL insertSupplierInformation(?, ?, ?, ?)"
        );
        $stmt->execute([
            $data['supplierName'],
            $data['supplierPhoneNum'],
            $data['supplierEmail'],
            $data['supplierAddress'],
        ]);
        return $stmt->fetch() ?: [];
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->pdo->prepare("CALL updateSupplier(?, ?, ?, ?, ?)");
        return $stmt->execute([
            $id,
            $data['supplierName'],
            $data['supplierPhoneNum'],
            $data['supplierEmail'],
            $data['supplierAddress'],
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->pdo->prepare("CALL deleteSupplier(?)");
        return $stmt->execute([$id]);
    }
}