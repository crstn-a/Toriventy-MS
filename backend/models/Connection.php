<?php

define("SERVER", $_ENV['SERVER01']);
define("USER", $_ENV['DBUSER']);
define("PWORD", $_ENV['PASSWORD']);
define("DBASE", $_ENV['DATABASE']);
define("CHARSET", $_ENV['CHARSET']);

class Connection {
  static $conn = false;

  public function connect() {
    $cnString = "mysql:host=" . SERVER . ";dbname=" . DBASE . ";charset=" . CHARSET;
    $options = [
      \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
      \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
      \PDO::ATTR_EMULATE_PREPARES => false,
      \PDO::ATTR_STRINGIFY_FETCHES => false,
      \PDO::ATTR_PERSISTENT => false
    ];
    
    error_log("Attempting DB connection: host=" . SERVER . ", user=" . USER . ", db=" . DBASE);
   
    try {
      static::$conn = new \PDO($cnString, USER, PWORD, $options);
      error_log("Database connection successful");
    } catch (\PDOException $er) {
      error_log("PDO Connection Error: " . $er->getMessage());
      http_response_code(500);
      echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $er->getMessage(),
        'data' => null
      ]);
      exit;
    }
    return static::$conn;
  }

  public function closeConnection() {
    $this->conn = null;
    return null;
  }
}
