<?php
  require_once __DIR__ . "/vendor/autoload.php";
  
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/config');
  $dotenv->load();

  $db = new Connection();
  $pdo = $db->connect();

  $auth = new Auth($pdo);
  $suppliers = new Suppliers($pdo);

  $param = explode("/",rtrim($_GET['params'],"/"));

  switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
      http_response_code(401);
      break;
    
    case 'POST':
      switch ($param[0]) {
        case 'suppliers':
          echo json_encode($suppliers->getSuppliers());
          break;

        default:
          http_response_code(400);
          break;
      }
      break;

    case 'PUT':
      switch ($param[0]) {
        case 'suppliers':
          echo json_encode($suppliers->insertSupplier());
          break;
      
        default:
          http_response_code(400);
          break;
      }
      break;

    case 'PATCH':
      switch ($param[0]) {
        case 'suppliers':
          echo json_encode($suppliers->updateSupplier());
          break;
      
        default:
          http_response_code(400);
          break;
      }
      break;
    
    case 'DELETE':
      switch ($param[0]) {
        case 'suppliers':
          echo json_encode($suppliers->deleteSupplier());
          break;
      
        default:
          http_response_code(400);
          break;
      }
      break;

    default:
      http_response_code(400);
      break;
  }