import Form from 'constructicon/form';
import Grid from 'constructicon/grid';
import GridColumn from 'constructicon/grid-column';
import InputField from 'constructicon/input-field';
import InputSelect from 'constructicon/input-select';
import * as validators from 'constructicon/lib/validators';
import withForm from 'constructicon/with-form';
import dayjs from 'dayjs';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import merge from 'lodash/merge';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { createFitnessActivity } from '../../api/fitness-activities';

class CreateFitnessForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      status: 'empty',
      errors: [],
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const { pageSlug, pageId, form, onSuccess, token, userId } = this.props;

    return form.submit().then((data) => {
      this.setState({ errors: [], status: 'fetching' });

      const dataPayload = merge(data, {
        pageId,
        pageSlug,
        token,
        userId,
        startedAt: dayjs(data.startedAt).isSame(dayjs(), 'day') ? dayjs().format() : data.startedAt,
        type: data.type,
      });

      return Promise.resolve()
        .then(() => createFitnessActivity(dataPayload))
        .then((result) => {
          this.setState({ status: 'fetched' });
          return onSuccess(result, dataPayload);
        })
        .catch((error) => {
          const message =
            get(error, 'data.error.message') ||
            get(error, 'data.errorMessage') ||
            get(error, 'message') ||
            'There was an unexpected error';

          this.setState({
            status: 'failed',
            errors: message ? [{ message }] : [],
          });

          return Promise.reject(error);
        });
    });
  }

  render() {
    const {
      disableInvalidForm,
      form,
      formComponent,
      includeDescription,
      includeDate,
      includeDuration,
      includeElevation,
      includeTitle,
      includeType,
      includeUnit,
      inputField,
      submit,
    } = this.props;

    const { status, errors } = this.state;

    return (
      <Form
        errors={errors}
        isDisabled={disableInvalidForm && form.invalid}
        isLoading={status === 'fetching'}
        noValidate
        onSubmit={this.handleSubmit}
        submit={submit}
        autoComplete="off"
        {...formComponent}
      >
        <Grid spacing={{ x: 0.5 }}>
          {includeUnit ? (
            <GridColumn>
              <Grid spacing={{ x: 0.25 }}>
                <GridColumn xs={7} sm={7.5} md={8} lg={9}>
                  <InputField {...form.fields.distance} {...inputField} />
                </GridColumn>
                <GridColumn xs={5} sm={4.5} md={4} lg={3}>
                  <InputSelect {...form.fields.unit} {...inputField} />
                </GridColumn>
              </Grid>
            </GridColumn>
          ) : (
            <GridColumn>
              <InputField {...form.fields.distance} {...inputField} />
            </GridColumn>
          )}

          {includeDuration && (
            <GridColumn lg={includeElevation ? 6 : 12}>
              <Grid spacing={{ x: 0.25 }}>
                <GridColumn xs={6} sm={6.5} md={7} lg={8}>
                  <InputField {...form.fields.duration} {...inputField} />
                </GridColumn>
                <GridColumn xs={6} sm={5.5} md={5} lg={4}>
                  <InputSelect {...form.fields.durationUnit} {...inputField} />
                </GridColumn>
              </Grid>
            </GridColumn>
          )}

          {includeElevation && (
            <GridColumn lg={includeDuration ? 6 : 12}>
              <Grid spacing={{ x: 0.25 }}>
                <GridColumn xs={7} sm={7.5} md={8} lg={9}>
                  <InputField {...form.fields.elevation} {...inputField} />
                </GridColumn>
                <GridColumn xs={5} sm={4.5} md={4} lg={3}>
                  <InputSelect {...form.fields.elevationUnit} {...inputField} />
                </GridColumn>
              </Grid>
            </GridColumn>
          )}

          {includeType && (
            <GridColumn lg={includeDate ? 6 : 12}>
              <InputSelect {...form.fields.type} {...inputField} />
            </GridColumn>
          )}

          {includeDate && (
            <GridColumn lg={includeType ? 6 : 12}>
              <InputField {...form.fields.startedAt} {...inputField} />
            </GridColumn>
          )}

          {includeTitle && (
            <GridColumn>
              <InputField {...form.fields.title} {...inputField} />
            </GridColumn>
          )}

          {includeDescription && (
            <GridColumn>
              <InputField {...form.fields.description} {...inputField} maxLength={600} />
            </GridColumn>
          )}
        </Grid>
      </Form>
    );
  }
}

CreateFitnessForm.propTypes = {
  /**
   * The ID for a valid page (pageGuid for JG)
   */
  pageId: PropTypes.string.isRequired,

  /**
   * The user guid
   */
  userId: PropTypes.string.isRequired,

  /**
   * Units of measurement (Metric or Imperial)
   */
  uom: PropTypes.oneOf(['km', 'mi']),

  /**
   * Disable form submission when invalid
   */
  disableInvalidForm: PropTypes.bool,

  /**
   * The label for required distance value
   */
  distanceLabel: PropTypes.string,

  /**
   * Props to be passed to the Form component
   */
  formComponent: PropTypes.object,

  /**
   * Props to be passed to the InputField components
   */
  inputField: PropTypes.object,

  /**
   * The onSuccess event handler
   */
  onSuccess: PropTypes.func.isRequired,

  /**
   * The label for the form submit button
   */
  submit: PropTypes.string,

  /**
   * The logged in users' auth token
   */
  token: PropTypes.string.isRequired,

  /**
   * The initial selected fitness activity type
   */
  type: PropTypes.oneOf(['walk', 'run', 'ride', 'swim', 'hike', 'wheelchair']),

  /**
   * The available fitness activity types
   */
  types: PropTypes.array,

  /**
   * Include elevation in fitness activity
   */
  includeElevation: PropTypes.bool,

  /**
   * Include duration in fitness activity
   */
  includeDuration: PropTypes.bool,

  /**
   * Include date in fitness activity
   */
  includeDate: PropTypes.bool,

  /**
   * Include title
   */
  includeTitle: PropTypes.bool,

  /**
   * Include description/message
   */
  includeDescription: PropTypes.bool,

  /**
   * Include distance type
   */
  includeType: PropTypes.bool,

  /**
   * Include distance units
   */
  includeUnit: PropTypes.bool,

  /**
   * Only allow fitness on or after this date
   */
  startDate: PropTypes.string,

  /**
   * Only allow fitness on or before this date
   */
  endDate: PropTypes.string,
};

CreateFitnessForm.defaultProps = {
  disableInvalidForm: false,
  distanceLabel: 'Distance',
  includeDescription: true,
  includeDate: true,
  includeElevation: true,
  includeDuration: true,
  includeTitle: false,
  includeType: true,
  includeUnit: true,
  submit: 'Log fitness activity',
  type: 'walk',
  types: ['walk', 'run', 'ride', 'swim', 'wheelchair'],
  uom: 'km',
};

const form = (props) => {
  return {
    fields: merge(
      {
        distance: {
          type: 'text',
          inputmode: 'decimal',
          label: props.distanceLabel,
          initial: '0',
          min: 0,
          required: true,
          validators: [validators.required(`Please enter a ${props.distanceLabel.toLowerCase()}`)],
        },
        type: {
          label: 'Activity Type',
          type: 'select',
          initial: props.type,
          options: props.types.map((value) => ({
            value,
            label: capitalize(value),
          })),
        },
      },
      {
        ...(props.includeTitle && {
          description: {
            label: 'Title',
            placeholder: 'Morning Exercise',
          },
        }),
        ...(props.includeDescription && {
          description: {
            label: 'Description',
            type: 'contenteditable',
            placeholder: 'Describe your activity...',
          },
        }),
        ...(props.includeDate && {
          startedAt: {
            label: 'Date',
            initial: dayjs().format('YYYY-MM-DD'),
            type: 'date',
            validators: [
              (val) => val && dayjs(val).isAfter() && "Date can't be in the future",
              (val) =>
                val &&
                props.startDate &&
                dayjs(val).isBefore(dayjs(props.startDate)) &&
                `Date can't be before ${dayjs(props.startDate).format('MMMM Do')}`,
              (val) =>
                val &&
                props.endDate &&
                dayjs(val).isAfter(dayjs(props.endDate)) &&
                `Date can't be after ${dayjs(props.startDate).format('MMMM Do')}`,
            ],
          },
        }),
        ...(props.includeUnit && {
          unit: {
            type: 'select',
            label: '​',
            initial: props.uom,
            options: ['km', 'mi'].map((value) => ({ value, label: value })),
          },
        }),
        ...(props.includeDuration && {
          duration: {
            type: 'number',
            label: 'Time',
            initial: '0',
            min: 0,
          },
          durationUnit: {
            type: 'select',
            label: '​',
            initial: 'minutes',
            options: [
              { value: 'minutes', label: 'mins' },
              { value: 'hours', label: 'hrs' },
            ],
          },
        }),
        ...(props.includeElevation && {
          elevation: {
            type: 'number',
            label: 'Elevation',
            initial: '0',
            min: 0,
          },
          elevationUnit: {
            type: 'select',
            label: '​',
            initial: props.uom === 'mi' ? 'ft' : 'm',
            options: ['m', 'ft'].map((value) => ({ value, label: value })),
          },
        }),
      }
    ),
  };
};

export default withForm(form)(CreateFitnessForm);
