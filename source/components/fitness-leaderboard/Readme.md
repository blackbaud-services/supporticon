### Examples

*Standard Use*

```
<FitnessLeaderboard
  campaign='au-21638'
/>
```

*Paginated Leaderboard*

```
<FitnessLeaderboard
  campaign='au-24234'
  limit={100}
  pageSize={10}
  showPage
/>
```

*Leaderboard by Team*

```
<FitnessLeaderboard
  campaign='au-21937'
  type='team'
  miles
/>
```

*Leaderboard by Group*

```
<FitnessLeaderboard
  campaign='au-21937'
  type='group'
  groupID={58}
  excludePageIds={['Sydney, NSW']}
/>
```

*Leaderboard by Elevation*

```
<FitnessLeaderboard
  campaign='nz-1608'
  sortBy='elevation'
  miles
/>
```

*Leaderboard by Duration*

```
<FitnessLeaderboard
  campaign='nz-1608'
  sortBy='duration'
  limit={50}
  page={1}
  pageSize={5}
/>
```

*Leaderboard by Calories*

```
<FitnessLeaderboard
  campaign='nz-1608'
  sortBy='calories'
/>
```

*Custom metric leaderboard (1 per 100km logged)*

```
<FitnessLeaderboard
  campaign='au-21638'
  limit={50}
  multiplier={0.00001}
  offset={-50000}
  page={1}
  pageSize={5}
  units={false}
/>
```
