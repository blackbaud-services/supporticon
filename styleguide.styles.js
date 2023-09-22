const { rhythm, colors } = require('constructicon/lib/traits');

const theme = {
  color: {
    baseBackground: colors.light,
    border: colors.paleGrey,
    codeBackground: colors.paleGrey,
    error: colors.danger,
    light: colors.grey,
    lightest: colors.lightGrey,
    name: colors.justgiving,
    type: colors.secondary,
    base: colors.dark,
    link: colors.justgiving,
    linkHover: colors.tertiary,
    sidebarBackground: colors.justgiving,
  },
  fontFamily: {
    base: '"Blackbaud Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    monospace: 'Consolas, "Liberation Mono", Menlo, monospace',
  },
  fontSize: {
    base: 15,
    text: 16,
    small: 13,
    h1: 38,
    h2: 32,
    h3: 18,
    h4: 18,
    h5: 16,
    h6: 16,
  },
  maxWidth: 780,
  sidebarWidth: 230,
};

const styles = {
  ComponentsList: {
    heading: {
      fontWeight: '700 !important',
    },
  },
  Heading: {
    heading1: {
      display: 'block',
      position: 'relative',
      paddingBottom: rhythm(0.75),
      marginBottom: rhythm(0.75),
      fontWeight: 700,
      '&:before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: rhythm(3),
        height: '4px',
        backgroundColor: colors.justgiving,
        borderRadius: '4px',
      },
      '& > a': {
        fontWeight: '700 !important',
      },
    },
    heading2: {
      marginBottom: rhythm(0.5),
    },
    heading3: {
      borderBottom: `thin solid ${colors.lightGrey}`,
      paddingBottom: rhythm(0.25),
      marginBottom: rhythm(1),
      textTransform: 'uppercase',
      fontWeight: '700',
    },
  },
  ReactComponent: {
    tabs: {
      backgroundColor: colors.paleGrey,
      padding: `${rhythm(0.5)} ${rhythm(1)}`,
      overflow: 'auto',
    },
    tabButtons: {
      marginBottom: 0,
    },
  },
  SectionHeading: {
    sectionName: {
      display: 'block',
      paddingTop: `${rhythm(1)} !important`,
      textDecoration: 'none !important',
      '&:hover': {
        opacity: 0.75,
      },
    },
  },
  StyleGuide: {
    content: {
      paddingTop: rhythm(2.5),
      '@media (max-width: 600px)': {
        padding: rhythm(1.5),
      },
    },
    logo: {
      border: 0,
      paddingBottom: 0,
      '& .rsg-logo': {
        display: 'block',
        color: colors.light,
        margin: rhythm(-0.5),
        padding: rhythm(0.5),
        fontSize: theme.fontSize.h3,
        fontFamily: theme.fontFamily.base,
        transition: 'all 250ms ease',
        cursor: 'pointer',
        '&:after, &:hover:after': {
          content: '"\\2197"',
          position: 'absolute',
          top: 0,
          right: 0,
          padding: rhythm(0.5),
          opacity: 0.25,
          transition: 'all 250ms ease',
          cursor: 'pointer',
        },
        '&:hover:after': {
          opacity: 0.75,
          color: colors.light,
        },
      },
      '& .rsg-logo-name, & .rsg-logo-version': {
        display: 'inline-block',
        verticalAlign: 'middle',
        pointerEvents: 'none',
      },
      '& .rsg-logo-name': {
        fontWeight: 700,
      },
      '& .rsg-logo-version': {
        marginLeft: rhythm(0.25),
        opacity: 0.5,
      },
    },
    sidebar: {
      border: 0,
      '& li > a': {
        color: `${colors.light} !important`,
      },
    },
  },
  TabButton: {
    button: {
      width: '100%',
    },
    isActive: {
      border: 0,
    },
  },
  Table: {
    table: {
      marginTop: rhythm(0.5),
      marginBottom: rhythm(0.5),
      minWidth: '600px',
    },
    cellHeading: {
      borderBottom: `thin solid ${colors.lightGrey}`,
    },
    cell: {
      paddingBottom: 0,
      '& p': {
        marginBottom: `${rhythm(0.125)} !important`,
      },
      '& div[class*="para"]': {
        marginBottom: `${rhythm(0.125)} !important`,
      },
    },
  },
};

module.exports = {
  styles,
  theme,
};
