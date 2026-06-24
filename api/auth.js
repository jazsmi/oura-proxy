if (process.env.NODE_ENV === 'production') {
  return res.status(404).end();
}
export default function handler(req, res) {
  const clientId = process.env.OURA_CLIENT_ID;
  const redirectUri = process.env.OURA_REDIRECT_URI;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'daily personal heartrate',
  });

  const authUrl = `https://cloud.ouraring.com/oauth/authorize?${params}`;
  res.redirect(authUrl);
}
