### Examples

```
<TotalElevation
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  miles
/>
```

### Multiple campaigns

```
<TotalElevation
  campaign={['e5e9b4eb-b97c-415d-b324-004708c0bd38', 'f440df6c-1101-4331-ac78-4fc5bc276f4e']}
/>
```

### Mutiplier & offset

```
<TotalElevation
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  multiplier={0.5}
  offset={1}
  places={2}
  units={false}
/>
```

### Filtered by tag

```
<TotalElevation
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  tagId='branch'
  tagValue='Aberdeen'
/>
```
