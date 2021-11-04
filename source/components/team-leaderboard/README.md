### Examples

*Standard Use*
```
<TeamLeaderboard activeOnly={false} team='105' />
```

*Sort by distance in miles*
```
<TeamLeaderboard activeOnly={false} team='105' sortBy='distance' miles={true} />
```

*Custom amount leaderboard (1 per £100 raised)*

```
<TeamLeaderboard
  activeOnly={false}
  team='hitachi-rail-uk'
  multiplier={0.01}
  pageSize={5}
  subtitleMethod={item => `$${Math.round(item.raised)}`}
  units={false}
/>
```
