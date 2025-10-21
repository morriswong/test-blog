/**
 * Cloudflare Worker for Decap CMS OAuth with GitHub
 * This worker handles the OAuth flow between Decap CMS and GitHub
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Handle /auth endpoint - redirect to GitHub OAuth
    if (url.pathname === '/auth') {
      const clientId = env.GITHUB_CLIENT_ID;
      const scope = url.searchParams.get('scope') || 'repo,user';

      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      githubAuthUrl.searchParams.set('client_id', clientId);
      githubAuthUrl.searchParams.set('scope', scope);
      githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);

      return Response.redirect(githubAuthUrl.toString(), 302);
    }

    // Handle /callback endpoint - exchange code for token
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        return new Response('No code provided', { status: 400 });
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          console.error('GitHub OAuth error:', tokenData);
          return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
        }

        // Extract the access token
        const accessToken = tokenData.access_token;

        if (!accessToken) {
          console.error('No access token in response:', tokenData);
          return new Response('OAuth error: No access token received', { status: 400 });
        }

        // Return success page that posts message to opener
        const successPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Success</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .success {
      color: #28a745;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }
    p {
      color: #666;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">✓</div>
    <h1>Authorization Successful!</h1>
    <p>You can close this window and return to the CMS.</p>
  </div>
  <script>
    (function() {
      const token = ${JSON.stringify(accessToken)};
      const tokenData = {
        token: token,
        provider: 'github'
      };

      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify(tokenData),
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);

      window.opener.postMessage("authorizing:github", "*");

      // Auto-close after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);
    })();
  </script>
</body>
</html>`;

        return new Response(successPage, {
          headers: {
            'Content-Type': 'text/html',
            ...corsHeaders,
          },
        });
      } catch (error) {
        console.error('OAuth error:', error);
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
    }

    // Handle /success endpoint - alternative callback handler
    if (url.pathname === '/success') {
      const token = url.searchParams.get('token');

      const successPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Success</title>
</head>
<body>
  <script>
    (function() {
      window.opener.postMessage(
        'authorization:github:success:{"token":"${token}"}',
        '*'
      );
      window.close();
    })();
  </script>
</body>
</html>`;

      return new Response(successPage, {
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      });
    }

    // Default response
    return new Response('Decap CMS OAuth Server\n\nEndpoints:\n- /auth - Start OAuth flow\n- /callback - OAuth callback', {
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders,
      },
    });
  },
};
