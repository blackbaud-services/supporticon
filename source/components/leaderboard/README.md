### Examples

*Standard Use*
```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  country='us'
/>
```

*Set Country*
```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  country='us'
/>
```

*Paginated Leaderboard*

```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  leaderboard={{
    columns: {
      sm: 2
    }
  }}
  limit={50}
  pageSize={10}
  showPage
/>
```

*Leaderboard by Team*

```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  type='team'
/>
```

*Leaderboard by Tag Value*

```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  tagId='branch'
  tagValue='Sevenoaks'
/>
```

*Leaderboard by Tag*

```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  tagId='branch'
/>
```

*Donations leaderboard*

```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  sortBy='donations'
/>
```

*Custom amount leaderboard (1 per $1000 raised)*

```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  currency={false}
  limit={50}
  multiplier={0.001}
  offset={-500}
  page={1}
  pageSize={5}
  subtitleMethod={item => `$${Math.round(item.raised)}`}
/>
```
