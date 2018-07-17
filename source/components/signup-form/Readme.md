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

With custom fields supplied:

```

const required = (msg = 'This field is required') => {
  return (val) => {
    switch (typeof val) {
      case 'string':
        return !val.trim() && msg
      default:
        return !val && msg
    }
  }
};

const fields = {
  target: {
    label: <span>I agree to the <a href='https://everydayhero.com/au/terms/' target='_blank'>Terms & Conditions</a></span>,
    type: 'checkbox',
    required: true,
    validators: [
      required('You must agree to the terms and conditions')
    ]
  }
};

<SignupForm
  clientId='26de0618f8469b55bee0e134c56e938da64566234dd935855daec36c294a5a65'
  onSuccess={(result) => alert(JSON.stringify(result))}
  fields={fields}
/>
```
