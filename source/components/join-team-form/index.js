import Form from 'constructicon/form';
import InputSearch from 'constructicon/input-search';
import withForm from 'constructicon/with-form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';

import { deserializeTeam, fetchTeam, fetchTeams, joinTeam } from '../../api/teams';
import form from './form';

class JoinTeamForm extends React.Component {
  constructor() {
    super();
    this.handleFilterResults = this.handleFilterResults.bind(this);
    this.handleJoinTeam = this.handleJoinTeam.bind(this);
    this.state = {
      errors: [],
      results: [],
      status: null,
      teams: [],
    };
  }

  componentDidMount() {
    const { campaign, excludeTeamIds } = this.props;

    const params = {
      campaign,
      limit: 25,
      allTeams: true,
    };

    this.setState({ status: 'fetching' });

    fetchTeams(params)
      .then((teams) => teams.map(deserializeTeam))
      .then((teams) =>
        teams.map((team) => ({
          id: team.id,
          owner: team.owner,
          slug: team.slug?.replace('team/', ''),
          label: team.name,
        }))
      )
      .then((teams) => {
        if (!excludeTeamIds) return teams;

        return teams.filter((team) =>
          ['id', 'slug'].reduce((current, key) => {
            if (!team[key]) return current;
            return current ? excludeTeamIds.indexOf(team[key].toString()) < 0 : false;
          }, true)
        );
      })
      .then((teams) => this.setState({ status: 'fetched', teams }))
      .catch(() => this.setState({ status: 'failed' }));
  }

  handleFilterResults(q) {
    const { teams } = this.state;
    const results = teams.filter(
      (team) => team.label.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );
    this.setState({ results });
  }

  handleJoinTeam(e) {
    e.preventDefault();
    const { form, onSuccess, pageId, pageSlug, token } = this.props;

    return form.submit().then((data) => {
      this.setState({ status: 'fetching' });

      const params = {
        id: data.team.owner || data.team.id,
        page: pageId,
        pageId,
        pageSlug,
        teamId: data.team.id,
        teamSlug: data.team.slug,
        token,
      };

      return Promise.resolve()
        .then(() => joinTeam(params))
        .then(() => fetchTeam(data.team.id))
        .then((team) => deserializeTeam(team))
        .then((team) => {
          this.setState({ status: 'fetched' });
          return onSuccess(team);
        })
        .catch((error) => {
          const formatMessage = (msg) => {
            if (msg.indexOf('incompatible-with-locks:campaign') > -1) {
              return 'Your page must be in the same campaign as this team.';
            }

            if (msg.indexOf('incompatible-with-locks:charity') > -1) {
              return 'Your page must be raising money for the same charity as this team.';
            }

            if (msg.indexOf('incompatible-with-locks:event') > -1) {
              return 'Your page must be in the same event as this team.';
            }

            return message;
          };

          const message = get(error, 'response.data.message', 'There was an unexpected error');
          const errors = [{ message: formatMessage(message) }];
          this.setState({ status: 'failed', errors });
          return Promise.reject(error);
        });
    });
  }

  render() {
    const { errors, results, status } = this.state;
    const { form, formProps, inputProps } = this.props;

    return (
      <Form
        isLoading={status === 'fetching'}
        noValidate
        submit="Join Team"
        errors={errors}
        onSubmit={this.handleJoinTeam}
        {...formProps}
      >
        <InputSearch
          {...form.fields.team}
          onBlur={() => {}}
          onSearch={this.handleFilterResults}
          results={results}
          valueFormatter={(team) => team.label}
          {...inputProps}
        />
      </Form>
    );
  }
}

JoinTeamForm.propTypes = {
  /**
   * The campaignId you want to join teams in
   */
  campaign: PropTypes.string,

  /**
   * Team ids you want to exclude from the list
   */
  excludeTeamIds: PropTypes.string,

  /**
   * Props to be passed to the Form component
   */
  formProps: PropTypes.object,

  /**
   * Props to be passed to the InputField components
   */
  inputProps: PropTypes.object,

  /**
   * The onSuccess event handler
   */
  onSuccess: PropTypes.func.isRequired,

  /**
   * The page (id) you want to add to the team
   */
  pageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * The page (slug) you want to add to the team
   */
  pageSlug: PropTypes.string,

  /**
   * The logged in users' auth token
   */
  token: PropTypes.string.isRequired,
};

export default withForm(form)(JoinTeamForm);
