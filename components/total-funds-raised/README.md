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
  campaign='18e72585-37db-4773-b74a-b6b43b5f2418'
  country='ie'
  tagId='company-name-2'
  tagValue='Facebook'
/>
```
