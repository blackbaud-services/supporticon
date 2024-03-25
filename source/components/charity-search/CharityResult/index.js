import React from "react";
import Grid from "constructicon/grid";
import GridColumn from "constructicon/grid-column";
import Heading from "constructicon/heading";
import Image from "constructicon/image";
import InputSearchResult from "constructicon/input-search-result";

const CharityResult = ({ isActive, result }) => (
  <InputSearchResult isActive={isActive} spacing={{ x: 1, y: 0.25 }}>
    <Grid align="center" spacing={0.25}>
      <GridColumn xs={10}>
        <Heading size={0} spacing={{ y: 0.375 }}>
          {result.name}
        </Heading>
      </GridColumn>
      <GridColumn xs={2} xsAlign="right">
        {result.logo && (
          <Image
            alt={result.name}
            maxHeight={1.25}
            src={result.logo}
            styles={{ display: "inline-block" }}
          />
        )}
      </GridColumn>
    </Grid>
  </InputSearchResult>
);

export default CharityResult;
