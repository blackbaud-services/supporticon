### Examples

*Standard Use*

```
<DonationTicker
  campaign='au-23374'
  label='Donations'
/>
```

*Custom format*

```
<DonationTicker
  charity='au-23374'
  format='0a'
  layout='amount-only'
  ticker={{
    background: 'secondary',
    foreground: 'light',
    speed: 'fast'
  }}
/>
```
