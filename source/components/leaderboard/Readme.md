### Examples

*Standard Use*
```
<Leaderboard
  campaign='au-23374'
/>
```

*Paginated Leaderboard*

```
<Leaderboard
  campaign='au-23374'
  limit={50}
  pageSize={10}
  showPage
/>
```

*Leaderboard by Team*

```
<Leaderboard
  campaign='au-23374'
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
