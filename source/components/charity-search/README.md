### Examples

```
<CharitySearch
  onChange={(value) => window.alert(JSON.stringify(value))}
/>
```

**With preselected charity**

```
<CharitySearch
  onChange={(value) => window.alert(JSON.stringify(value))}
  initial={2050}
/>
```
