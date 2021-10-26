### Examples

```
<TotalFundsRaised
  campaign='31fde560-dc11-43ca-9696-e373818208a3'
/>
```

### Exclude offline donations from total

```
<TotalFundsRaised
  campaign='31fde560-dc11-43ca-9696-e373818208a3'
  excludeOffline
  places={2}
  currency={false}
/>
```

### Filtered by tag

```
<TotalFundsRaised
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  tagId='branch'
  tagValue='Aberdeen'
/>
```
