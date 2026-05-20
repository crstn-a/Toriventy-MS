<?php
  ini_set('display_errors', '1');
  error_reporting(E_ALL);
  
  // Log all errors to file
  ini_set('log_errors', '1');
  ini_set('error_log', __DIR__ . '/error.log');

  // Set CORS headers FIRST, before anything else
  header("Access-Control-Allow-Origin: http://localhost:5173");
  header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Access-Control-Allow-Credentials: true");
  header("Content-Type: application/json; charset=utf-8");

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
  
  try {
    // Load environment variables from backend/config/.env only
    require_once __DIR__ . "/vendor/autoload.php";
    
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/config');
    $dotenv->load();

    require_once __DIR__ . "/functions.php";

    // Use Connection class in Models namespace to get PDO
    $pdo = Models\Connection::getInstance();

    // Import controllers
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = '/' . trim($_GET['params'] ?? '', '/');

    // DEBUG
    error_log("Method: $method, URI: $uri, Params: " . print_r($_GET['params'] ?? 'none', true));

    // AUTH
    if ($method === 'POST' && $uri === '/api/auth/login') {
        (new Controllers\AuthController($pdo))->login();
        exit;
    }

    if ($method === 'POST' && $uri === '/api/auth/register') {
        (new Controllers\AuthController($pdo))->register();
        exit;
    }

    // USERS
    if ($method === 'GET' && $uri === '/api/users/profile') {
        (new Controllers\AuthController($pdo))->profile();
        exit;
    }

    if ($method === 'PUT' && $uri === '/api/users/profile') {
        (new Controllers\AuthController($pdo))->updateProfile();
        exit;
    }

    // PRODUCTS
    if ($method === 'GET' && $uri === '/api/products') {
        (new Controllers\ProductController($pdo))->index();
        exit;
    }

    if ($method === 'GET' && $uri === '/api/admin/products') {
        (new Controllers\ProductController($pdo))->adminIndex();
        exit;
    }

    if ($method === 'POST' && $uri === '/api/products') {
        (new Controllers\ProductController($pdo))->store();
        exit;
    }

    if ($method === 'GET' && preg_match('#^/api/products/(\d+)$#', $uri, $m)) {
        (new Controllers\ProductController($pdo))->show((int)$m[1]);
        exit;
    }

    if ($method === 'PUT' && preg_match('#^/api/products/(\d+)$#', $uri, $m)) {
        (new Controllers\ProductController($pdo))->update((int)$m[1]);
        exit;
    }

    if ($method === 'DELETE' && preg_match('#^/api/products/(\d+)$#', $uri, $m)) {
        (new Controllers\ProductController($pdo))->destroy((int)$m[1]);
        exit;
    }

    // STOCK
    if ($method === 'POST' && $uri === '/api/stock/update') {
        (new Controllers\StockController($pdo))->update();
        exit;
    }

    if ($method === 'GET' && preg_match('#^/api/stock/(\d+)$#', $uri, $m)) {
        (new Controllers\StockController($pdo))->show((int)$m[1]);
        exit;
    }

    // SUPPLIERS
    if ($method === 'GET' && $uri === '/api/suppliers') {
        (new Controllers\SupplierController($pdo))->index();
        exit;
    }

    if ($method === 'GET' && $uri === '/api/admin/suppliers') {
        (new Controllers\SupplierController($pdo))->adminIndex();
        exit;
    }

    if ($method === 'POST' && $uri === '/api/suppliers') {
        (new Controllers\SupplierController($pdo))->store();
        exit;
    }

    if ($method === 'PUT' && preg_match('#^/api/suppliers/(\d+)$#', $uri, $m)) {
        (new Controllers\SupplierController($pdo))->update((int)$m[1]);
        exit;
    }

    if ($method === 'DELETE' && preg_match('#^/api/suppliers/(\d+)$#', $uri, $m)) {
        (new Controllers\SupplierController($pdo))->destroy((int)$m[1]);
        exit;
    }

    // REPORTS
    if ($method === 'GET' && $uri === '/api/reports/stock-levels') {
        (new Controllers\ReportController($pdo))->stockLevels();
        exit;
    }

    if ($method === 'GET' && $uri === '/api/reports/low-stock') {
        (new Controllers\ReportController($pdo))->lowStock();
        exit;
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
