### Examples

```
<CreatePageForm
  campaignId='96e2266e-2fa2-4109-a2b6-c017b79011bd'
  charityId='54'
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With extra fields

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
    label: 'Fundraising Target',
    type: 'number',
    placeholder: '500',
    required: true,
    validators: [
      required('Please enter a target')
    ]
  }
};

<CreatePageForm
  campaignId='96e2266e-2fa2-4109-a2b6-c017b79011bd'
  charityId='54'
  token='1234abcd'
  fields={fields}
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```


### With charity search

```
<CreatePageForm
  campaignId='96e2266e-2fa2-4109-a2b6-c017b79011bd'
  token='1234abcd'
  includeCharitySearch
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With address

```
<CreatePageForm
  campaignId='96e2266e-2fa2-4109-a2b6-c017b79011bd'
  charityId='54'
  includeAddress
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With address and default country

```
<CreatePageForm
  campaignId='96e2266e-2fa2-4109-a2b6-c017b79011bd'
  charityId='54'
  country='uk'
  includeAddress
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With initial values

```
<CreatePageForm
  campaignId='96e2266e-2fa2-4109-a2b6-c017b79011bd'
  charityId='54'
  initialValues={{ name: 'My Page' }}
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```
