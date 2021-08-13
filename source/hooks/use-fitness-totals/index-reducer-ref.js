import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect
} from 'react'
import { fetchFitnessTotals } from '../../api/fitness-totals'

export const FitnessTotalsContext = React.createContext()

export const FitnessTotalsProvider = ({ children }) => {
  const initialState = { data: {}, errors: [], status: 'initial' }

  const ref = useRef(initialState)

  function reducer (state, action) {
    switch (action.type) {
      case 'fetch':
        ref.current = { data: state.data, errors: [], status: 'fetching' }
        return ref.current
      case 'success':
        ref.current = { data: action.payload, errors: [], status: 'fetched' }
        return ref.current
      case 'failed':
        ref.current = {
          data: state.data,
          errors: action.payload,
          status: 'failed'
        }
        return ref.current
      default:
        throw new Error(`Nah mate, no such action as ${action.type}`)
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <FitnessTotalsContext.Provider value={[ref, dispatch]}>
      {children}
    </FitnessTotalsContext.Provider>
  )
}

export const useFitnessTotalsContext = () => useContext(FitnessTotalsContext)

export const useFitnessTotals = params => {
  const [ref, dispatch] = useFitnessTotalsContext()

  console.log('useFitnessTotals', ref.current)

  useEffect(
    () => {
      console.log('useFitnessTotals.useEffect', ref.current)
      if (
        ref.current.status !== 'fetched' &&
        ref.current.status !== 'fetching'
      ) {
        dispatch({ type: 'fetch' })

        fetchFitnessTotals(params)
          .then(data => dispatch({ type: 'success', payload: data }))
          .catch(error => {
            dispatch({ type: 'failed', payload: error.data })
            Promise.reject(error)
          })
      }
    },
    [...Object.values(params), ref.current.status]
  )

  return ref.current
}

export default useFitnessTotals

// export const FitnessTotalsContext = createContext({
//   totals: initialState,
//   setTotals: totals => {
//     throw new Error(
//       'You must wrap your application with a FitnessTotalsProvider component'
//     )
//   }
// })
//
// export const FitnessTotalsProvider = ({ children }) => {
//   const [totals, setTotals] = useState(initialState)
//
//   return (
//     <FitnessTotalsContext.Provider value={{ totals, setTotals }}>
//       {children}
//     </FitnessTotalsContext.Provider>
//   )
// }

// export const withFitnessTotals = WrappedComponent => props => (
//   <FitnessTotalsProvider>
//     <WrappedComponent {...props} />
//   </FitnessTotalsProvider>
// )
