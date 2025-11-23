<?php
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

$name = $_POST['name'] ?? null;
$message = $_POST['message'] ?? null;
$rating = isset($_POST['rating']) ? (int) $_POST['rating'] : null;

error_log(print_r($_POST, true));

if (!$name || !$message || !$rating) {
    respond_json(400, ['ok' => false, 'message' => 'Missing required fields']);
}

$scriptUrl = getenv('GOOGLE_TESTIMONIAL_SCRIPT_URL') ?: 'https://script.google.com/macros/s/AKfycbwW72grpnLwMF4gNOTDtBEIz4ZZjhpgkEEvQdlo8VA9qdukZtMoIQAywTlMpzc1MKyS/exec';
if (!$scriptUrl) {
    respond_json(500, ['ok' => false, 'message' => 'Missing GOOGLE_TESTIMONIAL_SCRIPT_URL']);
}

$payload = http_build_query([
    'name' => $name,
    'message' => $message,
    'rating' => $rating,
]);

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
    respond_json(502, ['ok' => false, 'message' => 'Failed to reach testimonial service', 'error' => $curlError]);
}

http_response_code($responseStatus);
header('Content-Type: application/json');
echo $responseBody;
