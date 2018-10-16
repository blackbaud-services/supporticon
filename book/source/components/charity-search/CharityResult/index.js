import React from 'react'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import Heading from 'constructicon/heading'
import Image from 'constructicon/image'
import InputSearchResult from 'constructicon/input-search-result'
import RichText from 'constructicon/rich-text'

const CharityResult = ({ isActive, result }) => (
  <InputSearchResult isActive={isActive} spacing={1}>
    <Grid align='center' spacing={0.5}>
      <GridColumn xs={2}>
        <Image alt={result.name} maxHeight={1.5} src={result.logo} />
      </GridColumn>
      <GridColumn xs={10}>
        <Heading size={0} spacing={{ b: 0.25 }}>
          {result.name}
        </Heading>
        <RichText lineClamp={2} size={-1}>
          <p>{result.description}</p>
        </RichText>
      </GridColumn>
    </Grid>
  </InputSearchResult>
)

export default CharityResult
