<?php
// api/callback.php - Enhanced GitHub OAuth callback with multiple fallback methods

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Your GitHub OAuth credentials
define('GITHUB_CLIENT_ID', 'your_github_client_id_here');
define('GITHUB_CLIENT_SECRET', 'your_github_client_secret_here');

$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';
$error = $_GET['error'] ?? '';

// Handle GitHub authorization error
if ($error) {
    renderHTML('error', ['error' => $error, 'error_description' => $_GET['error_description'] ?? '']);
    exit();
}

// Validate code exists
if (empty($code)) {
    renderHTML('error', ['error' => 'No authorization code provided']);
    exit();
}

// Exchange code for access token
$token_url = 'https://github.com/login/oauth/access_token';
$post_data = [
    'client_id' => GITHUB_CLIENT_ID,
    'client_secret' => GITHUB_CLIENT_SECRET,
    'code' => $code
];

$ch = curl_init($token_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: DecapCMS-OAuth-Client'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$token_data = json_decode($response, true);

// Check for errors
if (isset($token_data['error']) || !isset($token_data['access_token'])) {
    renderHTML('error', $token_data);
    exit();
}

// Success - render HTML with multiple communication methods
$result = [
    'token' => $token_data['access_token'],
    'provider' => 'github'
];

renderHTML('success', $result);

/**
 * Render HTML with multiple communication methods for Decap CMS
 * Uses 3 methods: postMessage, localStorage, and BroadcastChannel
 */
function renderHTML($status, $content) {
    $contentJson = json_encode($content);
    
    ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Authorizing...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 400px;
        }
        .status-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .success { color: #10b981; }
        .error { color: #ef4444; }
        h2 {
            margin: 0 0 0.5rem 0;
            color: #1f2937;
        }
        p {
            color: #6b7280;
            margin: 0.5rem 0;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 1rem auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .debug-info {
            margin-top: 1rem;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 8px;
            font-size: 0.875rem;
            text-align: left;
            color: #374151;
        }
        .method {
            display: flex;
            align-items: center;
            margin: 0.5rem 0;
        }
        .method-status {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .pending { background: #fbbf24; }
        .success-dot { background: #10b981; }
        .failed { background: #ef4444; }
    </style>
</head>
<body>
    <div class="container">
        <div class="status-icon <?php echo $status === 'success' ? 'success' : 'error'; ?>">
            <?php echo $status === 'success' ? '✓' : '✗'; ?>
        </div>
        <h2><?php echo $status === 'success' ? 'Authorization Successful!' : 'Authorization Failed'; ?></h2>
        <p><?php echo $status === 'success' ? 'Redirecting to admin panel...' : 'Please try again'; ?></p>
        <div class="spinner"></div>
        
        <div class="debug-info">
            <strong>Communication Status:</strong>
            <div class="method">
                <div class="method-status pending" id="status-postmessage"></div>
                <span>PostMessage</span>
            </div>
            <div class="method">
                <div class="method-status pending" id="status-localstorage"></div>
                <span>LocalStorage</span>
            </div>
            <div class="method">
                <div class="method-status pending" id="status-broadcast"></div>
                <span>BroadcastChannel</span>
            </div>
        </div>
    </div>
    
    <script>
    (function() {
        'use strict';
        
        const status = '<?php echo $status; ?>';
        const content = <?php echo $contentJson; ?>;
        const authMessage = `authorization:github:${status}:${JSON.stringify(content)}`;
        
        console.log('=== Decap CMS OAuth Callback ===');
        console.log('Status:', status);
        console.log('Message:', authMessage);
        console.log('window.opener:', window.opener);
        
        let successfulMethods = 0;
        const requiredMethods = 1; // At least 1 method needs to work
        
        // METHOD 1: PostMessage (Traditional)
        function tryPostMessage() {
            try {
                if (window.opener && !window.opener.closed) {
                    console.log('✓ Method 1: window.opener available');
                    
                    // Send to parent
                    window.opener.postMessage('authorizing:github', '*');
                    
                    // Listen for response
                    function receiveMessage(event) {
                        console.log('Received from parent:', event.data);
                        if (event.data === 'authorizing:github') {
                            window.opener.postMessage(authMessage, event.origin);
                            console.log('✓ PostMessage sent successfully');
                            document.getElementById('status-postmessage').className = 'method-status success-dot';
                            successfulMethods++;
                            checkCompletion();
                        }
                        window.removeEventListener('message', receiveMessage);
                    }
                    
                    window.addEventListener('message', receiveMessage, false);
                    
                    // Also try sending immediately
                    setTimeout(function() {
                        const possibleOrigins = [
                            'https://flamingbooks.com.ng',
                            window.location.origin
                        ];
                        possibleOrigins.forEach(function(origin) {
                            window.opener.postMessage(authMessage, origin);
                        });
                        document.getElementById('status-postmessage').className = 'method-status success-dot';
                        successfulMethods++;
                        checkCompletion();
                    }, 100);
                    
                    return true;
                } else {
                    console.log('✗ Method 1: window.opener not available');
                    document.getElementById('status-postmessage').className = 'method-status failed';
                    return false;
                }
            } catch (e) {
                console.error('✗ Method 1 failed:', e);
                document.getElementById('status-postmessage').className = 'method-status failed';
                return false;
            }
        }
        
        // METHOD 2: LocalStorage (Cross-tab communication)
        function tryLocalStorage() {
            try {
                const authData = {
                    message: authMessage,
                    timestamp: Date.now()
                };
                localStorage.setItem('decap-cms-auth-result', JSON.stringify(authData));
                console.log('✓ Method 2: LocalStorage saved');
                document.getElementById('status-localstorage').className = 'method-status success-dot';
                successfulMethods++;
                checkCompletion();
                return true;
            } catch (e) {
                console.error('✗ Method 2 failed:', e);
                document.getElementById('status-localstorage').className = 'method-status failed';
                return false;
            }
        }
        
        // METHOD 3: BroadcastChannel (Modern browsers)
        function tryBroadcastChannel() {
            try {
                if (typeof BroadcastChannel !== 'undefined') {
                    const channel = new BroadcastChannel('decap-cms-auth');
                    channel.postMessage(authMessage);
                    console.log('✓ Method 3: BroadcastChannel sent');
                    document.getElementById('status-broadcast').className = 'method-status success-dot';
                    channel.close();
                    successfulMethods++;
                    checkCompletion();
                    return true;
                } else {
                    console.log('✗ Method 3: BroadcastChannel not supported');
                    document.getElementById('status-broadcast').className = 'method-status failed';
                    return false;
                }
            } catch (e) {
                console.error('✗ Method 3 failed:', e);
                document.getElementById('status-broadcast').className = 'method-status failed';
                return false;
            }
        }
        
        // Check if enough methods succeeded
        function checkCompletion() {
            if (successfulMethods >= requiredMethods) {
                console.log(`✓ Success! ${successfulMethods} method(s) worked`);
                setTimeout(function() {
                    if (window.opener && !window.opener.closed) {
                        window.close();
                    } else {
                        window.location.href = '/admin/';
                    }
                }, 2000);
            }
        }
        
        // Execute all methods
        console.log('Attempting all communication methods...');
        tryPostMessage();
        tryLocalStorage();
        tryBroadcastChannel();
        
        // Fallback: If nothing works after 3 seconds, redirect
        setTimeout(function() {
            if (successfulMethods === 0) {
                console.log('⚠ All methods failed, redirecting...');
                window.location.href = '/admin/';
            }
        }, 3000);
        
    })();
    </script>
</body>
</html>
    <?php
}
?>
