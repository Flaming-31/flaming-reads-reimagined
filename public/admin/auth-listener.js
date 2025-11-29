// Enhanced authentication listener for Decap CMS
(function() {
  'use strict';
  
  console.log('=== Decap CMS Auth Listener Active ===');
  
  // METHOD 1: Listen for postMessage
  window.addEventListener('message', function(event) {
    console.log('Received postMessage:', event.data);
    
    // Decap CMS will handle this automatically, but we log it
    if (typeof event.data === 'string' && event.data.startsWith('authorization:github:')) {
      console.log('✓ Auth message received via postMessage');
    }
  }, false);
  
  // METHOD 2: Poll localStorage for auth result
  function checkLocalStorage() {
    try {
      const authResult = localStorage.getItem('decap-cms-auth-result');
      if (authResult) {
        const data = JSON.parse(authResult);
        // Check if it's recent (within last 10 seconds)
        if (Date.now() - data.timestamp < 10000) {
          console.log('✓ Auth found in localStorage:', data.message);
          
          // Parse the auth message to extract token
          // Format: "authorization:github:success:{"token":"xxx","provider":"github"}"
          const match = data.message.match(/^authorization:github:success:(.+)$/);
          if (match) {
            const tokenData = JSON.parse(match[1]);
            console.log('✓ Token extracted, storing for Decap CMS');
            
            // Store token directly in Decap CMS format
            const userData = {
              token: tokenData.token,
              backendName: 'github'
            };
            localStorage.setItem('netlify-cms-user', JSON.stringify(userData));
            
            // Clean up and reload to trigger Decap to read the token
            localStorage.removeItem('decap-cms-auth-result');
            console.log('✓ Reloading page to complete login...');
            window.location.reload();
            return;
          }
          
          // Fallback: try postMessage anyway
          window.postMessage(data.message, window.location.origin);
          localStorage.removeItem('decap-cms-auth-result');
        }
      }
    } catch (e) {
      console.error('LocalStorage check failed:', e);
    }
  }
  
  // Check localStorage every 500ms for 10 seconds
  let checks = 0;
  const interval = setInterval(function() {
    checkLocalStorage();
    checks++;
    if (checks > 20) { // 20 * 500ms = 10 seconds
      clearInterval(interval);
    }
  }, 500);
  
  // METHOD 3: Listen to BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('decap-cms-auth');
    channel.addEventListener('message', function(event) {
      console.log('✓ Auth received via BroadcastChannel:', event.data);
      // Trigger Decap CMS authentication
      window.postMessage(event.data, window.location.origin);
    });
  }
  
  console.log('All auth listeners initialized');
})();
