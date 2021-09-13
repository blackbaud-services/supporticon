# JustGiving Connect Form

Show Email form

```
<JGConnectForm
  clientId='API_KEY'
  redirectUri='https://oauth.blackbaud-sites.com'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

Show Yes/No Buttons

```
<JGConnectForm
  clientId='API_KEY'
  redirectUri='https://oauth.blackbaud-sites.com'
  onSuccess={(result) => alert(JSON.stringify(result))}
  showButtons
/>
```
