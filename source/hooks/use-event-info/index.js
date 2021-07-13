import { useState, useEffect, useCallback } from 'react'
import { deserializeEvent, fetchEvent } from '../../api/events'

export const useEventInfo = id => {
  if (useState === undefined) {
    console.error(
      'Current version of React does not support Hooks. Upgrade React to 16.8 to use supporticon/hooks'
    )
    return []
  }

  const [status, setStatus] = useState(null)
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const reload = useCallback(async () => {
    setStatus('fetching')
    try {
      const response = await fetchEvent(id)
      if (response && response.id) {
        setStatus('fetched')
        setEvent(deserializeEvent(response))
      } else {
        setStatus('failed')
        setError(response.message)
      }
    } catch (error) {
      setStatus('failed')
      setError(error)
    }
  }, [])

  useEffect(
    () => {
      reload()
    },
    [reload]
  )

  return { event, error, status, reload }
}
