### Examples

*Standard Use*
```
<TeamLeaderboard team='105' />
```

*Sort by distance in miles*
```
<TeamLeaderboard team='105' sortBy='distance' miles={true} />
```

*Custom amount leaderboard (1 per $1000 raised)*

```
<TeamLeaderboard
  team='hitachi-rail-uk'
  multiplier={0.001}
  offset={-500}
  pageSize={5}
  subtitleMethod={item => `$${Math.round(item.raised)}`}
/>
```
