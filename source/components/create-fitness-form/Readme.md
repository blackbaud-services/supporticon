### Examples

```
<CreateFitnessForm
  pageId='123456'
  token='1234abcd'
  userId='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
  uom='mi'
/>
```

### Custom activity (distance) label

```
<CreateFitnessForm
  pageId='123456'
  token='1234abcd'
  userId='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
  distanceLabel='Burpees'
  includeDuration={false}
  includeElevation={false}
  includeType={false}
  includeUnit={false}
  type='run'
/>
```

### Minimal form

```
<CreateFitnessForm
  pageId='123456'
  token='1234abcd'
  userId='1234abcd'
  onSuccess={(result) => alert(JSON.stringify(result))}
  includeCaption={false}
  includeDate={false}
  includeDuration={false}
  includeElevation={false}
  includeType={false}
  includeUnit={false}
/>
```
