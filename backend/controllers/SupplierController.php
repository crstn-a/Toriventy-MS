<?php
namespace Controllers;

use Models\Suppliers;
use PDO;

class SupplierController {
    private Suppliers $model;

    public function __construct(PDO $db) {
        $this->model = new Suppliers($db);
    }

    public function index(): void {
        requireAuth();
        success('Suppliers retrieved', $this->model->getAll());
    }

    public function adminIndex(): void {
        requireAdmin();
        success('Admin suppliers retrieved', $this->model->getAll());
    }

    public function store(): void {
        requireAdmin();
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = validate($body, [
            'supplierName'     => 'required',
            'supplierPhoneNum' => 'required',
            'supplierEmail'    => 'required|email',
            'supplierAddress'  => 'required',
        ]);
        if ($errors) error('Validation failed', 400, $errors);

        success('Supplier created', $this->model->insert($body), 201);
    }

    public function update(int $id): void {
        requireAdmin();
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = validate($body, [
            'supplierName'     => 'required',
            'supplierPhoneNum' => 'required',
            'supplierEmail'    => 'required|email',
            'supplierAddress'  => 'required',
        ]);
        if ($errors) error('Validation failed', 400, $errors);

        $this->model->update($id, $body);
        success('Supplier updated');
    }

    public function destroy(int $id): void {
        requireAdmin();
        $this->model->delete($id);
        success('Supplier deleted');
    }
}