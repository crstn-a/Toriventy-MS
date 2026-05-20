<?php
namespace Models;

use PDO;

class Customers {
    public function __construct(private PDO $pdo) {}

    public function getAll(): array {
        // Placeholder for customer functionality since database schema doesn't have tbl_customers yet.
        return [];
    }
}
