<?php
class Products {
  protected $pdo;

  public function __construct(\PDO $pdo) {
    $this->pdo = $pdo;
  }

  public function getProducts() {
    $stmt = $this->pdo->prepare("CALL getProducts()");
    $stmt->execute();
    return $stmt->fetchAll();
  }
  
  public function insertProduct() {
    $dt = json_decode(file_get_contents("php://input"));
    $values = [$dt->id, $dt->fname, $dt->lname, $dt->dob];
    $stmt = $this->pdo->prepare("CALL insertProduct(?, ?, ?, ?)");
    $stmt->execute($values);
    return $stmt->fetchAll();
  }

  public function updateProduct() {
    $dt = json_decode(file_get_contents("php://input"));
    $values = [$dt->id, $dt->fname, $dt->mname, $dt->lname, $dt->extname, $dt->dob];
    $stmt = $this->pdo->prepare("CALL updateProduct(?, ?, ?, ?, ?, ?)");
    $stmt->execute($values);
    return $stmt->fetchAll();
  }

  public function deleteProduct() {
    $dt = json_decode(file_get_contents("php://input"));
    $values = [$dt->id];
    $stmt = $this->pdo->prepare("CALL deleteProduct(?)");
    $stmt->execute($values);
    return $stmt->fetchAll();
  }
}