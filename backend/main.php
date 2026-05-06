<?php
  ini_set('display_errors', '0');
  error_reporting(E_ALL);

  // Set CORS headers FIRST, before anything else
  header("Access-Control-Allow-Origin: http://localhost:5173");
  header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Access-Control-Allow-Credentials: true");

  // Handle preflight OPTIONS request immediately
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      http_response_code(204);
      exit;
  }

  // Set error handler with CORS headers
  set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("PHP Error [$errno]: $errstr in $errfile:$errline");
    http_response_code(500);
    echo json_encode([
      'status' => 'error',
      'message' => 'Server error: ' . $errstr,
      'data' => null
    ]);
    exit;
  });
  
  // Load environment variables FIRST
  require_once __DIR__ . "/vendor/autoload.php";
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/config');
  $dotenv->load();

  try {
    require_once __DIR__ . "/helpers.php";

    // Load Models (after env vars are loaded)
    require_once __DIR__ . "/models/Connection.php";
    require_once __DIR__ . "/models/Auth.php";
    require_once __DIR__ . "/models/Products.php";
    require_once __DIR__ . "/models/Stocks.php";
    require_once __DIR__ . "/models/Suppliers.php";

    // Load Controllers
    require_once __DIR__ . "/controllers/AuthController.php";
    require_once __DIR__ . "/controllers/ProductController.php";
    require_once __DIR__ . "/controllers/StockController.php";
    require_once __DIR__ . "/controllers/SupplierController.php";
    require_once __DIR__ . "/controllers/ReportController.php";
  } catch (Exception $e) {
    error_log("Include Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
      'status' => 'error',
      'message' => 'Failed to load required files: ' . $e->getMessage(),
      'data' => null
    ]);
    exit;
  }

  $db = new Connection();
  $pdo = $db->connect();

  $param = explode("/",rtrim($_GET['params'],"/"));

  $method = $_SERVER['REQUEST_METHOD'];
  $uri = '/' . trim($_GET['params'] ?? '', '/');

  // DEBUG
  error_log("Method: $method, URI: $uri, Params: " . print_r($_GET['params'] ?? 'none', true));

  try {

    // AUTH
    if ($method === 'POST' && $uri === '/api/auth/login') {
        (new AuthController($pdo))->login();
        return;
    }

    if ($method === 'POST' && $uri === '/api/auth/register') {
        (new AuthController($pdo))->register();
        return;
    }

    // USERS
    if ($method === 'GET' && $uri === '/api/users/profile') {
        (new AuthController($pdo))->profile();
        return;
    }

    if ($method === 'PUT' && $uri === '/api/users/profile') {
        (new AuthController($pdo))->updateProfile();
        return;
    }

    // PRODUCTS
    if ($method === 'GET' && $uri === '/api/products') {
        (new ProductController($pdo))->index();
        return;
    }

    if ($method === 'POST' && $uri === '/api/products') {
        (new ProductController($pdo))->store();
        return;
    }

    if ($method === 'GET' && preg_match('#^/api/products/(\d+)$#', $uri, $m)) {
        (new ProductController($pdo))->show((int)$m[1]);
        return;
    }

    if ($method === 'PUT' && preg_match('#^/api/products/(\d+)$#', $uri, $m)) {
        (new ProductController($pdo))->update((int)$m[1]);
        return;
    }

    if ($method === 'DELETE' && preg_match('#^/api/products/(\d+)$#', $uri, $m)) {
        (new ProductController($pdo))->destroy((int)$m[1]);
        return;
    }

    // STOCK
    if ($method === 'POST' && $uri === '/api/stock/update') {
        (new StockController($pdo))->update();
        return;
    }

    if ($method === 'GET' && preg_match('#^/api/stock/(\d+)$#', $uri, $m)) {
        (new StockController($pdo))->show((int)$m[1]);
        return;
    }

    // SUPPLIERS (aligned with your old logic)
    if ($method === 'GET' && $uri === '/api/suppliers') {
        (new SupplierController($pdo))->index();
        return;
    }

    if ($method === 'POST' && $uri === '/api/suppliers') {
        (new SupplierController($pdo))->store();
        return;
    }

    if ($method === 'PUT' && preg_match('#^/api/suppliers/(\d+)$#', $uri, $m)) {
        (new SupplierController($pdo))->update((int)$m[1]);
        return;
    }

    if ($method === 'DELETE' && preg_match('#^/api/suppliers/(\d+)$#', $uri, $m)) {
        (new SupplierController($pdo))->destroy((int)$m[1]);
        return;
    }

    // REPORTS
    if ($method === 'GET' && $uri === '/api/reports/stock-levels') {
        (new ReportController($pdo))->stockLevels();
        return;
    }

    if ($method === 'GET' && $uri === '/api/reports/low-stock') {
        (new ReportController($pdo))->lowStock();
        return;
    }

    // FALLBACK
    error('Route not found', 404);

} catch (PDOException $e) {
    error_log("PDOException: " . $e->getMessage());
    error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Exception: " . $e->getMessage());
    error('Server error: ' . $e->getMessage(), 500);
}