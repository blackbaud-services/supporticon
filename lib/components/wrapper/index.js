import React from 'react'
import { DataProvider } from '../../../source/utils/data'

const Wrapper = ({ children }) => (
  <DataProvider>
    {children}
  </DataProvider>
)

export default Wrapper
