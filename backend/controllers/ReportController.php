<?php
namespace Controllers;

use Models\Stocks;
use PDO;

class ReportController {
    private Stocks $model;

    public function __construct(PDO $db) {
        $this->model = new Stocks($db);
    }

    public function stockLevels(): void {
        requireAuth();
        success('Stock levels', $this->model->allLevels());
    }

    public function lowStock(): void {
        requireAuth();
        success('Low stock items', $this->model->lowStock());
    }
}