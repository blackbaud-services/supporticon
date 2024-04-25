import React from 'react'
// import {
//   instance,
//   get,
//   post,
//   put,
//   destroy,
//   updateClient,
//   getBaseURL,
//   isStaging,
//   servicesAPI,
//   metadataAPI,
//   imagesAPI,
//   jgIdentityClient
// } from '../../source/utils/client'
// import InputSlug from '../../source/components/input-slug'
// import DataProvider from '../../source/utils/data'
import AddressSearch from '../../source/components/address-search'
import CharitySearch from '../../source/components/charity-search'

const App = () => {
  return (
    <>
      <h1>Supporticon Playground</h1>
      <span>
        Welcome to the Supporticon playground! Add a component in App.js to get
        started.
      </span>
      <AddressSearch
        country='UK'
        onChange={(item) => {
          console.log('item', item)
        }}
      />
      <CharitySearch />
      {/* <DataProvider> */}
      {/* Your component here... */}
      {/* </DataProvider> */}
    </>
  )
}

export default App
