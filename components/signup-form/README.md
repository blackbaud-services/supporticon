### Examples

```
<SignupForm
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

Without country prop supplied:

```
<SignupForm
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
    label: <span>I agree to the <a href='https://www.justgiving.com/info/terms-of-service' target='_blank'>Terms & Conditions</a></span>,
    type: 'checkbox',
    required: true,
    validators: [
      required('You must agree to the terms and conditions')
    ]
  }
};

<SignupForm
  onSuccess={(result) => alert(JSON.stringify(result))}
  fields={fields}
/>
```
