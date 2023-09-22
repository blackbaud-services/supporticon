import InputSearch from 'constructicon/input-search';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { deserializeCharity, fetchCharity, searchCharities } from '../../api/charities';
import CharityResult from './CharityResult';

class CharitySearch extends Component {
  constructor(props) {
    super(props);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      results: [],
      status: null,
      value: null,
    };
  }

  componentDidMount() {
    const { initial } = this.props;

    if (initial) {
      Promise.resolve()
        .then(() => fetchCharity(initial))
        .then((data) => this.setState({ value: data.name }))
        .catch((error) => {
          this.setState({ value: null });
          return Promise.reject(error);
        });
    }
  }

  handleQuery(q) {
    const { campaign, country } = this.props;

    Promise.resolve()
      .then(() => this.setState({ status: 'fetching' }))
      .then(() => searchCharities({ campaign, country, q, limit: 25 }))
      .then((results) => results.map(deserializeCharity))
      .then((results) => this.setState({ results, status: 'fetched' }))
      .catch((error) => {
        this.setState({ status: 'failed' });
        return Promise.reject(error);
      });
  }

  handleSelect(selected = {}) {
    this.setState({ value: selected.name });

    if (selected.id) {
      this.props.onChange(selected);
    }
  }

  render() {
    const { inputProps, ResultComponent } = this.props;
    const { results, status, value } = this.state;

    return (
      <InputSearch
        {...inputProps}
        autoComplete="off"
        onChange={this.handleSelect}
        onSearch={this.handleQuery}
        ResultComponent={ResultComponent}
        results={results}
        showMore
        status={status}
        value={value}
      />
    );
  }
}

CharitySearch.propTypes = {
  /**
   * Only show charities in this country
   */
  country: PropTypes.oneOf(['au', 'nz', 'uk', 'us', 'ie']),

  /**
   * Only show charities in this campaign
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The id of the initially selected charity
   */
  initial: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * The props to be passed to the input search component
   */
  inputProps: PropTypes.object,

  /**
   * The callback to call when a selection is made
   */
  onChange: PropTypes.func,

  /**
   * The component to render the search results
   */
  ResultComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

CharitySearch.defaultProps = {
  ResultComponent: CharityResult,
};

export default CharitySearch;
