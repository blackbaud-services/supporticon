### Examples
```
<AddressSearch onChange={(value) => window.alert(JSON.stringify(value))} />
```

```
<AddressSearch
  onChange={(value) => console.log(value)}
  onCancel={(value) => console.log(value)}
/>
```

```
<AddressSearch country='uk' onChange={(value) => window.alert(JSON.stringify(value))} />
```
