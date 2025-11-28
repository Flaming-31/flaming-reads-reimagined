<?php
// GitHub OAuth Callback Endpoint for Decap CMS
// This file handles the OAuth callback from GitHub and exchanges the code for an access token

header('Content-Type: text/html');
header('Access-Control-Allow-Origin: *');

// Get OAuth credentials from environment or config
$clientId = getenv('OAUTH_CLIENT_ID') ?: (defined('OAUTH_CLIENT_ID') ? OAUTH_CLIENT_ID : '');
$clientSecret = getenv('OAUTH_CLIENT_SECRET') ?: (defined('OAUTH_CLIENT_SECRET') ? OAUTH_CLIENT_SECRET : '');

if (empty($clientId) || empty($clientSecret)) {
    http_response_code(500);
    echo '<html><body><h1>Error</h1><p>OAuth credentials not configured</p></body></html>';
    exit();
}

// Get the authorization code from the callback
$code = $_GET['code'] ?? '';

if (empty($code)) {
    http_response_code(400);
    echo '<html><body><h1>Error</h1><p>No authorization code provided</p></body></html>';
    exit();
}

// Exchange code for access token
$tokenUrl = 'https://github.com/login/oauth/access_token';
$postData = [
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'code' => $code
];

$ch = curl_init($tokenUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: Decap-CMS-OAuth'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    echo '<html><body><h1>Error</h1><p>Failed to exchange code for token</p></body></html>';
    exit();
}

$tokenData = json_decode($response, true);
$accessToken = $tokenData['access_token'] ?? '';

if (empty($accessToken)) {
    http_response_code(500);
    echo '<html><body><h1>Error</h1><p>No access token received</p></body></html>';
    exit();
}

// Return the token to the CMS using postMessage
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Authorization Successful</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f5f5f5;
        }
        .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #2d3748; margin: 0 0 1rem; }
        p { color: #718096; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✓ Authorization Successful</h1>
        <p>You can close this window now.</p>
    </div>
    <script>
        (function() {
            var token = '<?php echo htmlspecialchars($accessToken, ENT_QUOTES, 'UTF-8'); ?>';
            // Decap CMS expects JSON format: {"token":"xxx","provider":"github"}
            var tokenData = JSON.stringify({ token: token, provider: 'github' });
            var message = 'authorization:github:success:' + tokenData;
            
            console.log('Callback loaded, token received');
            console.log('Sending postMessage:', message.substring(0, 50) + '...');
            
            function sendMessage(targetOrigin) {
                if (window.opener && !window.opener.closed) {
                    console.log('Sending to opener with origin:', targetOrigin);
                    window.opener.postMessage(message, targetOrigin);
                    
                    // Try closing the window after a short delay
                    setTimeout(function() {
                        window.close();
                    }, 1000);
                } else {
                    console.error('No window.opener found or opener is closed');
                    // Fallback: redirect to admin
                    setTimeout(function() {
                        window.location.href = '/admin/';
                    }, 2000);
                }
            }
            
            // Listen for ready message from parent
            function receiveMessage(event) {
                console.log('Received message:', event.data, 'from:', event.origin);
                // Decap CMS sends "authorizing:github" when ready
                if (event.data === 'authorizing:github') {
                    console.log('Parent is ready, sending auth result');
                    sendMessage(event.origin);
                    window.removeEventListener('message', receiveMessage);
                }
            }
            
            // Listen for parent ready signal
            window.addEventListener('message', receiveMessage, false);
            
            // Also try sending immediately to common origins
            var possibleOrigins = [
                'https://flamingbooks.com.ng',
                window.location.origin
            ];
            
            // Send to parent immediately
            if (window.opener) {
                // First, let the parent know we're ready
                window.opener.postMessage('authorizing:github', '*');
                
                // Try sending the message after a short delay
                setTimeout(function() {
                    possibleOrigins.forEach(function(origin) {
                        sendMessage(origin);
                    });
                }, 100);
            }
        })();
    </script>
</body>
</html>
