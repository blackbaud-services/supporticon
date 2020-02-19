### Examples

N.B. Support for the default popup functionality is IE11+

```
<ProviderOauthButton
  clientId='26de0618f8469b55bee0e134c56e938da64566234dd935855daec36c294a5a65'
  redirectUri='https://oauth.blackbaud-sites.com'
  onClose={() => console.log('Popup closed!')}
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

You can disable the default popup functionality by setting `popup` to false.

```
<ProviderOauthButton
  clientId='26de0618f8469b55bee0e134c56e938da64566234dd935855daec36c294a5a65'
  redirectUri='https://oauth.blackbaud-sites.com'
  popup={false}
  provider='strava'
  label='Connect with Strava'
/>
```

```
<ProviderOauthButton
  clientId='26de0618f8469b55bee0e134c56e938da64566234dd935855daec36c294a5a65'
  redirectUri='https://oauth.blackbaud-sites.com'
  popup={false}
  provider='mapmyfitness'
  label='Connect with Map My Fitness'
/>
```

```
<ProviderOauthButton
  clientId='26de0618f8469b55bee0e134c56e938da64566234dd935855daec36c294a5a65'
  redirectUri='https://oauth.blackbaud-sites.com'
  onClose={() => console.log('Popup closed!')}
  onSuccess={(result) => alert(JSON.stringify(result))}
  useLocalStorage
/>
```

### JustGiving OAuth

```
<ProviderOauthButton
  clientId='44f34c65'
  label='Login with JustGiving'
  provider='justgiving'
  redirectUri='https://oauth.blackbaud-sites.com/'
  onClose={() => console.log('Popup closed!')}
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```
