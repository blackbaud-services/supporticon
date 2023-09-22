export const localityLabel = (country) => {
  switch (country) {
    case 'au':
      return 'Town/Suburb';
    case 'nz':
      return 'Suburb';
    case 'ie':
      return 'Town/City';
    case 'uk':
    case 'gb':
      return 'Town';
    default:
      return 'City';
  }
};

export const regionLabel = (country) => {
  switch (country) {
    case 'uk':
    case 'gb':
    case 'ie':
      return 'County';
    case 'ca':
      return 'Province';
    case 'nz':
      return 'City';
    default:
      return 'State';
  }
};

export const postCodeLabel = (country) => {
  switch (country) {
    case 'us':
      return 'Zip Code';
    default:
      return 'Postcode';
  }
};
