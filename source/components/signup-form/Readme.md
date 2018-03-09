### Examples

```
<SignupForm
  country='au'
  clientId='26de0618f8469b55bee0e134c56e938da64566234dd935855daec36c294a5a65'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

Without country prop supplied:

```
<SignupForm
  clientId='26de0618f8469b55bee0e134c56e938da64566234dd935855daec36c294a5a65'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```
