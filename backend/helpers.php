<?php
// ─── Response ────────────────────────────────────────────────────────────────
function respond(string $status, string $message, mixed $data, int $code): void {
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
            if ($rule === 'required' && empty($value)) {
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

    $payload = verifyJWT(substr($auth, 7));
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