### Examples

*Standard Use*

```
<DonationTicker
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  label='Donations'
  withCleanup={true}
/>
```

*Custom format*

```
<DonationTicker
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  layout='amount-only'
  ticker={{
    background: 'secondary',
    foreground: 'light',
    speed: 'fast'
  }}
/>
```

*Donor Message*

```
<DonationTicker
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  label='Messages'
  layout='name-message'
/>
```

*Refresh Interval*

```
<DonationTicker
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  refreshInterval={10000}
/>
```
