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
/>
```
