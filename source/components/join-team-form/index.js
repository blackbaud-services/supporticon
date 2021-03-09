import React from 'react'
import PropTypes from 'prop-types'
import withForm from 'constructicon/with-form'
import form from './form'
import {
  deserializeTeam,
  fetchTeam,
  fetchTeams,
  joinTeam
} from '../../api/teams'

import Form from 'constructicon/form'
import InputSearch from 'constructicon/input-search'

class JoinTeamForm extends React.Component {
  constructor () {
    super()
    this.filterResults = this.filterResults.bind(this)
    this.handleJoinTeam = this.handleJoinTeam.bind(this)
    this.state = {
      errors: [],
      results: [],
      status: null,
      teams: []
    }
  }

  componentDidMount () {
    const { campaign } = this.props

    const params = {
      campaign,
      limit: 1000
    }

    fetchTeams(params)
      .then(teams => teams.map(deserializeTeam))
      .then(teams =>
        teams.map(team => ({
          id: team.id,
          owner: team.owner,
          slug: team.slug,
          label: team.name
        }))
      )
      .then(teams => this.setState({ status: 'fetched', teams }))
  }

  filterResults (q) {
    const { teams } = this.state
    const results = teams.filter(
      team => team.label.toLowerCase().indexOf(q.toLowerCase()) !== -1
    )
    this.setState({ results })
  }

  handleJoinTeam (e) {
    e.preventDefault()
    const { form, onSuccess, pageId, pageSlug, token } = this.props

    return form.submit().then(data => {
      this.setState({ status: 'fetching' })

      const params = {
        id: data.team.owner || data.team.id,
        page: pageId,
        pageId,
        pageSlug: pageSlug,
        teamId: data.team.id,
        teamSlug: data.team.slug,
        token
      }

      return Promise.resolve()
        .then(() => joinTeam(params))
        .then(() => fetchTeam(data.team.id))
        .then(team => deserializeTeam(team))
        .then(team => {
          this.setState({ status: 'fetched' })
          return onSuccess(team)
        })
        .catch(error => {
          const errors = [{ message: 'There was an unexpected error' }]
          this.setState({ status: 'failed', errors })
          return Promise.reject(error)
        })
    })
  }

  render () {
    const { errors, results, status } = this.state
    const { form, formProps, inputProps } = this.props

    return (
      <Form
        isLoading={status === 'fetching'}
        noValidate
        submit='Join Team'
        errors={errors}
        onSubmit={this.handleJoinTeam}
        {...formProps}
      >
        <InputSearch
          {...form.fields.team}
          onBlur={() => {}}
          onSearch={this.filterResults}
          results={results}
          valueFormatter={team => team.label}
          {...inputProps}
        />
      </Form>
    )
  }
}

JoinTeamForm.propTypes = {
  /**
   * The campaignId you want to join teams in
   */
  campaign: PropTypes.string,

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
  token: PropTypes.string.isRequired
}

export default withForm(form)(JoinTeamForm)
