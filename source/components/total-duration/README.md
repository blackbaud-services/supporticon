### Examples

```
<TotalDuration
  campaign='31fde560-dc11-43ca-9696-e373818208a3'
/>
```

### Multiple campaigns

```
<TotalDuration
  campaign={['31fde560-dc11-43ca-9696-e373818208a3', 'e5e9b4eb-b97c-415d-b324-004708c0bd38']}
/>
```

### Mutiplier & offset

```
<TotalDuration
  campaign='31fde560-dc11-43ca-9696-e373818208a3'
  multiplier={0.5}
  places={2}
  offset={1}
  units={false}
/>
```

### Filtered by tag

```
<TotalDuration
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  tagId='branch'
  tagValue='Weston Super Mare and North Somerset'
/>
```
