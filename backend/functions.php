<?php
use Models\Auth;

class AESGCM {
    private static function getKeyBytes(): string {
        $key = $_ENV['ENCRYPTION_KEY'];
        return hex2bin($key);
    }

    public static function encrypt(string $plaintext): string {
        if ($plaintext === '') return '';
        $keyBytes = self::getKeyBytes();
        $iv = openssl_random_pseudo_bytes(12);
        $tag = '';
        $ciphertext = openssl_encrypt($plaintext, 'aes-256-gcm', $keyBytes, OPENSSL_RAW_DATA, $iv, $tag);
        return base64_encode($iv . $ciphertext . $tag);
    }

    public static function decrypt(string $base64Ciphertext): ?string {
        if ($base64Ciphertext === '') return '';
        $data = base64_decode($base64Ciphertext, true);
        if ($data === false || strlen($data) < 28) {
            return null;
        }
        $iv = substr($data, 0, 12);
        $tag = substr($data, -16);
        $ciphertext = substr($data, 12, -16);
        $keyBytes = self::getKeyBytes();
        $decrypted = openssl_decrypt($ciphertext, 'aes-256-gcm', $keyBytes, OPENSSL_RAW_DATA, $iv, $tag);
        return $decrypted !== false ? $decrypted : null;
    }
}

function encryptSensitiveFields(&$data): void {
    if (is_array($data)) {
        foreach ($data as $key => &$value) {
            if (is_array($value)) {
                encryptSensitiveFields($value);
            } elseif (is_string($value) && $value !== '') {
                if ($key === 'email' || $key === 'fld_email' || $key === 'phone' || $key === 'fld_phone') {
                    $value = AESGCM::encrypt($value);
                }
            }
        }
    }
}

function decryptSensitiveFields(array &$body): void {
    foreach ($body as $key => &$value) {
        if (is_array($value)) {
            decryptSensitiveFields($value);
        } elseif (is_string($value) && $value !== '') {
            if ($key === 'email' || $key === 'password' || $key === 'phone') {
                $decrypted = AESGCM::decrypt($value);
                if ($decrypted !== null) {
                    $value = $decrypted;
                }
            }
        }
    }
}

function getRequestBody(): array {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    decryptSensitiveFields($body);
    return $body;
}

// ─── Response ────────────────────────────────────────────────────────────────
function respond(string $status, string $message, mixed $data, int $code): void {
    encryptSensitiveFields($data);
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($code);
    echo json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    exit();
}

function success(string $msg, mixed $data = null, int $code = 200): void {
    respond('success', $msg, $data, $code);
}

function error(string $msg, int $code = 400, mixed $data = null): void {
    respond('error', $msg, $data, $code);
}

// ─── Validator ───────────────────────────────────────────────────────────────
function validate(array $body, array $rules): array {
    $errors = [];
    foreach ($rules as $field => $checks) {
        $value = $body[$field] ?? null;
        foreach (explode('|', $checks) as $rule) {
            if ($rule === 'required' && (is_null($value) || $value === '')) {
                $errors[$field] = "$field is required";
            } elseif ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $errors[$field] = "$field must be a valid email";
            } elseif (str_starts_with($rule, 'min:')) {
                $min = (int) substr($rule, 4);
                if (strlen((string)$value) < $min)
                    $errors[$field] = "$field must be at least $min characters";
            } elseif ($rule === 'numeric' && !is_numeric($value)) {
                $errors[$field] = "$field must be a number";
            }
        }
    }
    return $errors;
}

// ─── Middleware ───────────────────────────────────────────────────────────────
function requireAuth(): array {
    $headers = getallheaders();
    $auth    = $headers['Authorization'] ?? '';

    if (!str_starts_with($auth, 'Bearer ')) {
        error('Unauthorized — no token provided', 401);
    }

    $payload = Auth::verifyJWT(substr($auth, 7));
    if (!$payload) {
        error('Unauthorized — invalid or expired token', 401);
    }

    return $payload;
}

function requireAdmin(): array {
    $payload = requireAuth();
    if ($payload['role'] !== 'admin') {
        error('Forbidden — admin only', 403);
    }
    return $payload;
}
