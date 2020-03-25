import { useState, useEffect } from 'react'
import { fetchDonationFeed, deserializeDonation } from '../../api/feeds'

const useDonationFeed = params => {
  if (useState === undefined) {
    console.error(
      'Current version of React does not support Hooks. Upgrade React to 16.8 to use supporticon/hooks'
    )
    return []
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [donationFeed, setDonationFeed] = useState([])

  useEffect(() => {
    fetchDonationFeed(params)
      .then(result => result.map(deserializeDonation))
      .then(deserialized => {
        setDonationFeed(deserialized)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setError(error)
        Promise.reject(error)
      })
  }, [])

  return [donationFeed, loading, error]
}

export default useDonationFeed
