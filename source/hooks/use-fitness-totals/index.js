import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchFitnessTotals } from '../../api/fitness-totals'

const initialState = { data: {}, errors: [], status: 'initial' }

export const FitnessTotalsContext = createContext({
  totals: initialState,
  setTotals: totals => {
    throw new Error(
      'You must wrap your application with a FitnessTotalsProvider component'
    )
  }
})

export const FitnessTotalsProvider = ({ children }) => {
  const [totals, setTotals] = useState(initialState)

  return (
    <FitnessTotalsContext.Provider value={{ totals, setTotals }}>
      {children}
    </FitnessTotalsContext.Provider>
  )
}

export const useFitnessTotalsContext = () => useContext(FitnessTotalsContext)

export const withFitnessTotals = WrappedComponent => props => (
  <FitnessTotalsProvider>
    <WrappedComponent {...props} />
  </FitnessTotalsProvider>
)

export const useFitnessTotals = params => {
  const { totals, setTotals } = useFitnessTotalsContext()

  useEffect(
    () => {
      if (totals.status !== 'fetched' && totals.status !== 'fetching') {
        setTotals({ data: totals.data, errors: [], status: 'fetching' })

        fetchFitnessTotals(params)
          .then(data => setTotals({ data, errors: [], status: 'fetched' }))
          .catch(error => {
            setTotals({ data: {}, errors: error.data, status: 'failed' })
            Promise.reject(error)
          })
      }
    },
    [...Object.values(params), totals.status]
  )

  return totals
}

export default useFitnessTotals
