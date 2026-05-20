<?php
namespace Controllers;

use Models\Auth;
use PDO;

class AuthController {
    private Auth $auth;

    public function __construct(PDO $db) {
        $this->auth = new Auth($db);
    }

    public function register(): void {
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = validate($body, [
            'username' => 'required',
            'email'    => 'required|email',
            'password' => 'required|min:8',
        ]);
        if ($errors) error('Validation failed', 400, $errors);

        if ($this->auth->emailExists($body['email'])) {
            error('Email already registered', 409);
        }

        success('Registered successfully', $this->auth->register($body), 201);
    }

    public function login(): void {
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = validate($body, [
            'email'    => 'required|email',
            'password' => 'required',
        ]);
        if ($errors) error('Validation failed', 400, $errors);

        success('Login successful', $this->auth->login($body['email'], $body['password']));
    }

    public function profile(): void {
        $payload = requireAuth();
        $user    = $this->auth->findById((int) $payload['sub']);
        if (!$user) error('User not found', 404);
        success('Profile retrieved', $user);
    }

    public function updateProfile(): void {
        $payload = requireAuth();
        $body    = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors  = validate($body, ['username' => 'required', 'email' => 'required|email']);
        if ($errors) error('Validation failed', 400, $errors);

        $this->auth->updateProfile((int) $payload['sub'], $body);
        success('Profile updated');
    }
}