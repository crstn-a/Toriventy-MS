<?php
namespace Controllers;

use Models\Products;
use PDO;

class ProductController {
    private Products $model;

    public function __construct(PDO $db) {
        $this->model = new Products($db);
    }

    public function index(): void {
        requireAuth();
        success('Products retrieved', $this->model->getAll());
    }

    public function adminIndex(): void {
        requireAdmin();
        success('Admin products retrieved', $this->model->getAll());
    }

    public function show(int $id): void {
        requireAuth();
        $product = $this->model->getById($id);
        if (!$product) error('Product not found', 404);
        success('Product retrieved', $product);
    }

    public function store(): void {
        requireAdmin();
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = validate($body, [
            'productName' => 'required',
            'productSKU'  => 'required',
            'price'       => 'required|numeric',
            'supplier_id' => 'required',
        ]);
        if ($errors) error('Validation failed', 400, $errors);

        $id = $this->model->insert($body);
        success('Product created', ['product_id' => $id], 201);
    }

    public function update(int $id): void {
        requireAdmin();
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = validate($body, [
            'productName' => 'required',
            'productSKU'  => 'required',
            'price'       => 'required|numeric',
            'supplier_id' => 'required',
        ]);
        if ($errors) error('Validation failed', 400, $errors);

        $this->model->update($id, $body);
        success('Product updated');
    }

    public function destroy(int $id): void {
        requireAdmin();
        $this->model->delete($id);
        success('Product deleted');
    }
}