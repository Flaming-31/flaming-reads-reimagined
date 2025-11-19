module.exports = (req, res) => {
  try {
    const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
    
    if (!CLIENT_ID) {
      return res.status(500).json({ 
        error: 'Missing OAUTH_CLIENT_ID environment variable' 
      });
    }

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
    
    res.writeHead(302, {
      Location: authUrl
    });
    res.end();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication initialization failed' });
  }
};
