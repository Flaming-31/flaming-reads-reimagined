const axios = require('axios');
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

module.exports = async (req, res) => {
  const { code } = req.query;

  try {
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
    res.status(500).json({ error: 'Authentication failed' });
  }
};
