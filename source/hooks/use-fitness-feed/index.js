import { useState, useEffect } from 'react'
import {
  fetchFitnessActivities,
  deserializeFitnessActivity
} from '../../api/fitness-activities'

const useFitnessFeed = params => {
  if (useState === undefined) {
    console.error(
      'Current version of React does not support Hooks. Upgrade React to 16.8 to use supporticon/hooks'
    )
    return []
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [fitnessFeed, setFitnessFeed] = useState([])

  useEffect(() => {
    fetchFitnessActivities(params)
      .then(result => result.map(deserializeFitnessActivity))
      .then(deserialized => {
        setFitnessFeed(deserialized)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setError(error)
        Promise.reject(error)
      })
  }, [])

  return [fitnessFeed, loading, error]
}

export default useFitnessFeed
