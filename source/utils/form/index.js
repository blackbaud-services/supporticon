import InputDate from 'constructicon/input-date';
import InputField from 'constructicon/input-field';
import InputSearch from 'constructicon/input-search';
import InputSelect from 'constructicon/input-select';
import InputSelectImage from 'constructicon/input-select-image';
import Label from 'constructicon/label';
import omit from 'lodash/omit';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

export const renderInput = (type) => {
  switch (type) {
    case 'date':
      return InputDate;
    case 'search':
      return InputSearch;
    case 'select':
      return InputSelect;
    case 'label':
      return Label;
    case 'imageSelect':
      return InputSelectImage;
    default:
      return InputField;
  }
};

export const renderFormFields = (fields, fieldsToOmit = [], sortKey = 'order') =>
  sortBy(values(omit(fields, fieldsToOmit)), [sortKey]);
