<?php
namespace Controllers;

use Models\Stocks;
use PDO;

class StockController {
    private Stocks $model;

    public function __construct(PDO $db) {
        $this->model = new Stocks($db);
    }

    public function show(int $productId): void {
        requireAuth();
        $stock = $this->model->getByProduct($productId);
        if (!$stock) error('Stock not found', 404);
        success('Stock retrieved', $stock);
    }

    public function update(): void {
        $payload = requireAuth();
        $body    = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors  = validate($body, [
            'product_id'      => 'required|numeric',
            'quantity_change' => 'required|numeric',
        ]);
        if ($errors) error('Validation failed', 400, $errors);

        $productId = (int) $body['product_id'];
        $change    = (int) $body['quantity_change'];
        $current   = $this->model->getByProduct($productId);

        if (!$current) error('Product not found', 404);

        $newQty = $current['fld_quantity'] + $change;
        if ($newQty < 0) error('Insufficient stock', 400);

        // Call the model updateQuantity which invokes updateStock(product_id, user_id, change, reason) stored procedure
        $result = $this->model->updateQuantity($productId, (int)$payload['sub'], $change, $body['reason'] ?? '');

        success('Stock updated', [
            'product_id' => $productId,
            'previous_quantity' => $result['previous_quantity'] ?? $current['fld_quantity'],
            'new_quantity' => $result['new_quantity'] ?? $newQty
        ]);
    }
}