<?php
// GitHub OAuth Authentication Endpoint for Decap CMS
// This file initiates the OAuth flow with GitHub

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get OAuth credentials from environment or config
$clientId = getenv('OAUTH_CLIENT_ID') ?: (defined('OAUTH_CLIENT_ID') ? OAUTH_CLIENT_ID : '');
$redirectUri = getenv('OAUTH_REDIRECT_URI') ?: (defined('OAUTH_REDIRECT_URI') ? OAUTH_REDIRECT_URI : '');

if (empty($clientId)) {
    http_response_code(500);
    echo json_encode(['error' => 'OAuth client ID not configured']);
    exit();
}

// If no redirect URI is set, use the current domain
if (empty($redirectUri)) {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $redirectUri = "$protocol://$host/api/callback.php";
}

// Build GitHub OAuth URL
$githubAuthUrl = 'https://github.com/login/oauth/authorize';
$scope = 'repo,user';

$authUrl = $githubAuthUrl . '?' . http_build_query([
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'scope' => $scope,
    'state' => bin2hex(random_bytes(16))
]);

// Redirect to GitHub
header('Location: ' . $authUrl);
exit();
