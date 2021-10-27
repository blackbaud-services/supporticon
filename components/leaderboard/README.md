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

*Donations leaderboard (Multiple campaigns)*

```
<Leaderboard
  campaign={['e8017c12-4119-41b0-b44a-2b3d9ccff22e', 'bcfb2b43-61ff-4812-9f06-af6384358d4b']}
  sortBy='donations'
  pageSize={10}
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

*Use graphql leaderboard*

```
<Leaderboard
  campaign='27b2edbf-ad04-4f20-9a3e-76f37b4515b6'
  country='us'
  leaderboard={{
    columns: { sm: 2 }
  }}
  limit={50}
  pageSize={15}
  useGraphql
  useOwnerImage
/>
```

*Use page owner image*

```
<Leaderboard
  campaign='e5e9b4eb-b97c-415d-b324-004708c0bd38'
  sortBy='raised'
  useOwnerImage
  limit={5}
/>
```
