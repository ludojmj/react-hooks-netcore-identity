const configuration = {
  configurations: [
    {
      origin: 'http://localhost:3000',
      config: {
        client_id: 'interactive.public.short',
        redirect_uri: 'http://localhost:3000/authentication/callback',
        response_type: 'code',
        post_logout_redirect_uri: 'http://localhost:3000/',
        scope: 'openid profile email api offline_access',
        authority: 'https://demo.identityserver.io',
        silent_redirect_uri: 'http://localhost:3000/authentication/silent_callback',
        automaticSilentRenew: true,
        loadUserInfo: true
      }
    },
    {
      origin: 'https://localhost:5001',
      config: {
        client_id: 'interactive.public.short',
        redirect_uri: 'https://localhost:5001/authentication/callback',
        response_type: 'code',
        post_logout_redirect_uri: 'https://localhost:5001/',
        scope: 'openid profile email api offline_access',
        authority: 'https://demo.identityserver.io',
        silent_redirect_uri: 'https://localhost:5001/authentication/silent_callback',
        automaticSilentRenew: true,
        loadUserInfo: true
      }
    },
    {
      origin: 'https://rita.azurewebsites.net',
      config: {
        client_id: 'interactive.public.short',
        redirect_uri: 'https://rita.azurewebsites.net/authentication/callback',
        response_type: 'code',
        post_logout_redirect_uri: 'https://rita.azurewebsites.net/',
        scope: 'openid profile email api offline_access',
        authority: 'https://demo.identityserver.io',
        silent_redirect_uri: 'https://rita.azurewebsites.net/authentication/silent_callback',
        automaticSilentRenew: true,
        loadUserInfo: true
      }
    },
    {
      origin: 'https://ludal.azurewebsites.net',
      config: {
        client_id: 'interactive.public.short',
        redirect_uri: 'https://ludal.azurewebsites.net/authentication/callback',
        response_type: 'code',
        post_logout_redirect_uri: 'https://ludal.azurewebsites.net/',
        scope: 'openid profile email api offline_access',
        authority: 'https://demo.identityserver.io',
        silent_redirect_uri: 'https://ludal.azurewebsites.net/authentication/silent_callback',
        automaticSilentRenew: true,
        loadUserInfo: true
      }
    }
  ]
};

export default configuration;
