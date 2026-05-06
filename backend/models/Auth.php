<?php
class Auth {
    private static string $secret = 'toriventy-secret-min-32-chars-ok';

    public function __construct(private PDO $pdo) {}

    // ── Called by AuthController ─────────────────────────────────────────────
    public function register(array $data): array {
        $stmt = $this->pdo->prepare("CALL registerUser(?, ?, ?)");
        $stmt->execute([
            $data['username'],
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT),
        ]);
        $result = $stmt->fetch();
        return $result ? ['user_id' => (int)$result['fld_user_id']] : [];
    }

    public function login(string $email, string $password): array {
        $stmt = $this->pdo->prepare("CALL getUserByEmail(?)");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['fld_password_hash'])) {
            error('Invalid email or password', 401);
        }

        return [
            'token' => self::generateJWT((int)$user['fld_user_id'], $user['fld_role']),
            'user'  => [
                'id'       => $user['fld_user_id'],
                'username' => $user['fld_username'],
                'email'    => $user['fld_email'],
                'role'     => $user['fld_role'],
            ],
        ];
    }

    public function findById(int $id): ?array {
        $stmt = $this->pdo->prepare("CALL getUserById(?)");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function updateProfile(int $id, array $data): void {
        $stmt = $this->pdo->prepare("CALL updateUserProfile(?, ?, ?)");
        $stmt->execute([$id, $data['username'], $data['email']]);
    }

    public function emailExists(string $email): bool {
        $stmt = $this->pdo->prepare("CALL getUserByEmail(?)");
        $stmt->execute([$email]);
        return (bool) $stmt->fetch();
    }

    // ── JWT (fixed — was broken in original) ────────────────────────────────
    public static function generateJWT(int $userId, string $role): string {
        $header  = self::b64u(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = self::b64u(json_encode([
            'sub'  => $userId,
            'role' => $role,
            'iat'  => time(),
            'exp'  => time() + 86400,
        ]));
        // FIX: raw binary HMAC (true), then base64url — your original used hex HMAC
        $sig = self::b64u(hash_hmac('sha256', "$header.$payload", self::$secret, true));
        return "$header.$payload.$sig";
    }

    public static function verifyJWT(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $sig] = $parts;
        $expected = self::b64u(hash_hmac('sha256', "$header.$payload", self::$secret, true));

        if (!hash_equals($expected, $sig)) return null;

        $data = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
        if (!$data || ($data['exp'] ?? 0) < time()) return null;

        return $data;
    }

    private static function b64u(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}