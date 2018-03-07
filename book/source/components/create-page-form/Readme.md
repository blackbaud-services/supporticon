# Examples

```
<CreatePageForm
  campaignId='au-0'
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

**With extra fields:**

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

<CreatePageForm
  campaignId='au-0'
  token='1234abcd'
  fields={{
    target: {
      label: 'Fundraising Target',
      type: 'number',
      placeholder: '500',
      required: true,
      validators: [
        required('Please enter a target')
      ]
    }
  }}
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```
