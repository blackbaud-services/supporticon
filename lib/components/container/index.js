import React from 'react'
import { DataProvider } from '../../../source/utils/data'
import { ReactQueryDevtools } from 'react-query/devtools'
import StyleGuideRenderer from 'react-styleguidist/lib/client/rsg-components/StyleGuide/StyleGuideRenderer'

const Wrapper = props => (
	<DataProvider>
		<StyleGuideRenderer {...props} />
    <ReactQueryDevtools />
	</DataProvider>
)

export default Wrapper
