<?php
// Simple proxy that forwards subscription requests to the Google Apps Script back end
// while adding the CORS headers browsers require.

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond_json(int $status, array $data): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond_json(405, ['ok' => false, 'message' => 'Method not allowed']);
}

$email = $_POST['email'] ?? null;
if (!$email) {
    respond_json(400, ['ok' => false, 'message' => 'Missing email']);
}

// Prefer an environment variable when hosted (e.g. cPanel) but fall back to the hard-coded URL so it also works locally.
$scriptUrl = getenv('GOOGLE_SCRIPT_URL') ?: 'https://script.google.com/macros/s/AKfycbzxQ52cK4TnApjUy5XLFJ5Ir9l_KmeYpowSe4o0yxso501C_hmZqIGzLlKHMW2RJUh4Dg/exec';
if (!$scriptUrl) {
    respond_json(500, ['ok' => false, 'message' => 'Missing GOOGLE_SCRIPT_URL']);
}

$payload = http_build_query(['email' => $email]);

$ch = curl_init($scriptUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$responseBody = curl_exec($ch);
$curlError = curl_error($ch);
$responseStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE) ?: 500;
curl_close($ch);

if ($responseBody === false) {
    respond_json(502, ['ok' => false, 'message' => 'Failed to reach subscription service', 'error' => $curlError]);
}

http_response_code($responseStatus);
header('Content-Type: application/json');
echo $responseBody;
