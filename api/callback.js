const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { code } = req.query;
    const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
    const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ error: 'Missing OAuth credentials' });
    }

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const token = response.data.access_token;

    if (!token) {
      return res.status(500).json({ error: 'Failed to obtain access token' });
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Complete</title>
        </head>
        <body>
          <script>
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token, provider: 'github' })}',
              window.location.origin
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
