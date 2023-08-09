import React from 'react';
import {
  instance,
  get,
  post,
  put,
  destroy,
  updateClient,
  getBaseURL,
  isStaging,
  servicesAPI,
  metadataAPI,
  imagesAPI,
  jgIdentityClient
} from '../../source/utils/client'
import InputSlug from '../../source/components/input-slug';
import DataProvider from '../../source/utils/data';

const App = () => {
  return (
    <>
      <h1>Supporticon Playground</h1>
      <span>Welcome to the Supporticon playground! Add a component in App.js to get started.</span>
      {/* <DataProvider> */}
        {/* Your component here... */}
      {/* </DataProvider> */}
    </>
    )
};

export default App;