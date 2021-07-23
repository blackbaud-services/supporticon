### Examples

*Standard Use*

```
<FitnessLeaderboard
  campaign='31fde560-dc11-43ca-9696-e373818208a3'
/>
```

*Paginated Leaderboard*

```
<FitnessLeaderboard
  campaign='96e2266e-2fa2-4109-a2b6-c017b79011bd'
  limit={100}
  pageSize={10}
  showPage
  leaderboard={{
    columns: {
      sm: 2
    }
  }}
/>
```

*Leaderboard by Team*

```
<FitnessLeaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  type='team'
  miles
/>
```

*Leaderboard by Tag Value*

```
<FitnessLeaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  tagId='branch'
  tagValue='Sevenoaks'
/>
```


*Leaderboard by Tag*

```
<FitnessLeaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  tagId='branch'
/>
```

*Leaderboard by Elevation*

```
<FitnessLeaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  sortBy='elevation'
  miles
/>
```

*Leaderboard by Duration*

```
<FitnessLeaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  sortBy='duration'
  limit={50}
  page={1}
  pageSize={5}
/>
```

*Custom metric leaderboard (1 per 100km logged)*

```
<FitnessLeaderboard
  campaign='31fde560-dc11-43ca-9696-e373818208a3'
  limit={50}
  multiplier={0.00001}
  offset={-50000}
  page={1}
  pageSize={5}
  units={false}
/>
```
