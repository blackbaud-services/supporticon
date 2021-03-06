### Examples

```
<CreatePageForm
  campaignId='au-0'
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
  campaignId='au-0'
  token='1234abcd'
  fields={fields}
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With groups (EDH only)

```
<CreatePageForm
  campaignId='au-21937'
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With charity search

```
<CreatePageForm
  campaignId='au-0'
  token='1234abcd'
  includeCharitySearch
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With charity select

```
<CreatePageForm
  campaignId='au-6839'
  token='1234abcd'
  includeCharitySearch='select'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With address (EDH only)

```
<CreatePageForm
  campaignId='au-0'
  includeAddress
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With address and default country (EDH only)

```
<CreatePageForm
  campaignId='au-0'
  country='uk'
  includeAddress
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```

### With initial values

```
<CreatePageForm
  campaignId='au-0'
  initialValues={{ birthday: '2010-01-01' }}
  token='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
/>
```
