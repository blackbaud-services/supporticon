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

*Custom amount leaderboard (1 per $1000 raised)*

```
<Leaderboard
  campaign='au-23374'
  currency={false}
  limit={50}
  multiplier={0.001}
  offset={-500}
  page={1}
  pageSize={5}
  subtitleMethod={item => `$${Math.round(item.raised)}`}
/>
```
