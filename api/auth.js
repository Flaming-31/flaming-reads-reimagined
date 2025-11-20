module.exports = (req, res) => {
  const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
  
  if (!CLIENT_ID) {
    return res.status(500).json({ error: 'OAuth client ID not configured' });
  }

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
  
  res.writeHead(302, { Location: authUrl });
  res.end();
};
