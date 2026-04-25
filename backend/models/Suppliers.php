<?php
class Suppliers {
  protected $pdo;

  public function __construct(\PDO $pdo) {
    $this->pdo = $pdo;
  }

  public function getSuppliers() {
    $stmt = $this->pdo->prepare("CALL getSupplierInformation()");
    $stmt->execute();
    return $stmt->fetchAll();
  }
  
  public function insertSupplier() {
    $dt = json_decode(file_get_contents("php://input"));
    $values = [$dt->id, $dt->fname, $dt->lname, $dt->dob];
    $stmt = $this->pdo->prepare("CALL insertSupplier(?, ?, ?, ?)");
    $stmt->execute($values);
    return $stmt->fetchAll();
  }

  public function updateSupplier() {
    $dt = json_decode(file_get_contents("php://input"));
    $values = [$dt->id, $dt->fname, $dt->mname, $dt->lname, $dt->extname, $dt->dob];
    $stmt = $this->pdo->prepare("CALL updateSupplier(?, ?, ?, ?, ?, ?)");
    $stmt->execute($values);
    return $stmt->fetchAll();
  }

  public function deleteSupplier() {
    $dt = json_decode(file_get_contents("php://input"));
    $values = [$dt->id];
    $stmt = $this->pdo->prepare("CALL deleteSupplier(?)");
    $stmt->execute($values);
    return $stmt->fetchAll();
  }
}

