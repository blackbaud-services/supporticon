import { useState, useEffect } from 'react'
import {
  fetchFitnessLeaderboard,
  deserializeFitnessLeaderboard
} from '../../api/fitness-leaderboard'

const useFitnessLeaderboard = params => {
  if (useState === undefined) {
    console.error(
      'Current version of React does not support Hooks. Upgrade React to 16.8 to use supporticon/hooks'
    )
    return []
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    fetchFitnessLeaderboard(params)
      .then(result => result.map(deserializeFitnessLeaderboard))
      .then(deserialized => {
        setLeaderboard(deserialized)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setError(error)
        Promise.reject(error)
      })
  }, [])

  return [leaderboard, loading, error]
}

export default useFitnessLeaderboard
