const CLIENT_ID = process.env.OAUTH_CLIENT_ID;

module.exports = (req, res) => {
  const provider = req.query.provider || 'github';
  if (provider !== 'github') {
    return res.status(400).json({ error: 'Unsupported provider' });
  }

  if (!CLIENT_ID) {
    return res.status(500).json({ error: 'Missing OAUTH_CLIENT_ID' });
  }

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
  res.redirect(authUrl);
};
