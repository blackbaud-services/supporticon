# React hooks for API methods

#### (React 16.8)

Hooks that can be dropped into a react function component that contain fetch
status and relevant data.

## Example usage

A simple function component that fetches and displays a leaderboard making use
of the `useLeaderboard` hook

```
import useLeaderboard from 'supporticon/hooks/use-leaderboard'

const Leaderboard = ({ campaign }) => {
  const [leaderboard, loading, error] = useLeaderboard({ limit: 5, campaign })

  if (error) return <SomeErrorComponent />
  if (loading) return <SomeLoadingComponent />

  return (
    <div>
      {leaderboard.map((leader, i) => (
        <div>{leader.rank} - {leader.name}</div>
      ))}
    </div>
  )
}
```
