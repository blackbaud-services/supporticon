### Examples

*Standard Use*
```
<Leaderboard
  campaign='au-21638'
/>
```

*Paginated Leaderboard*

```
<Leaderboard
  campaign='au-21638'
  limit={15}
  pageSize={10}
/>
```

*Leaderboard by Team*

```
<Leaderboard
  campaign='au-21937'
  type='team'
/>
```

*Leaderboard by Group*

```
<Leaderboard
  campaign='au-21937'
  type='group'
  groupID={58}
/>
```
