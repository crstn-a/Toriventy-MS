<?php
use Firebase\JWT\jWT;
use Firebase\JWT\key;

class Auth {
    protected $pdo;

  public function __construct(\PDO $pdo) {
    $this->pdo = $pdo;
  }

  public function login() {
    echo $this->generateToken();
    echo $this->generateJWT();
  }

  private function generateToken() {
    $key = "a-string-secret-at-least-256-bit";
    $header = $this->generateHeader();
    $payload = $this->generatePayload();
    $signature = "signatureGoesHere";
    $signature = hash_hmac('sha256', "$header.$payload", "$key");
    $signature = base64_encode($signature);
    $signature = str_replace(["+", "/", "="], ["-", "_", ""], $signature);
    return "$header.$payload.$signature";
  }

  private function generateHeader() {
    $h = [  
        "alg" => "HS256",
        "typ" => "JWT",
        "app" => "Inventory App",
        "dev" => "Toriventy Developers"
    ];
    $h = json_encode($h);
    $h = base64_encode($h);
    $h = str_replace(["+", "/", "="], ["-", "_", ""], $h);
    return $h;
  }

  private function generatePayload(){
    $exp = time() + 60 * 60 * 24;
    $p = [  
        "iby" => "Inventory Management System",
        "ie" => "toriventy.com",
        "exp" => $exp
    ];
    $p = json_encode($p);
    $p = base64_encode($p);
    $p = str_replace(["+", "/", "="], ["-", "_", ""], $p);
    return $p;
  }

  //using JWT Library
  private function generateJWT(){
    $exp = time() + 60 * 60 * 24;
    $key = 'example_key_of_sufficient_length';
    $p = [  
        "iby" => "Inventory Management System",
        "ie" => "toriventy.com",
        "exp" => $exp
    ];
    $jwt = JWT::encode($p, $key, "HS256");
    return $jwt;
  }

}