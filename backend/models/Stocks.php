<?php
class Stocks {
  protected $pdo;

  public function __construct(\PDO $pdo) {
    $this->pdo = $pdo;
  }

  public function getStocks() {
    $stmt = $this->pdo->prepare("CALL getStockInformation()");
    $stmt->execute();
    return $stmt->fetchAll();
  }

  public function updateStock() {
    $dt = json_decode(file_get_contents("php://input"));
    $values = [$dt->id, $dt->fname, $dt->mname, $dt->lname, $dt->extname, $dt->dob];
    $stmt = $this->pdo->prepare("CALL updateStock(?, ?, ?, ?, ?, ?)");
    $stmt->execute($values);
    return $stmt->fetchAll();
  }
}

