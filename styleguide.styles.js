const { rhythm, colors } = require('constructicon/lib/traits')

const styles = {
  Logo: {
    logo: {
      color: colors.light
    }
  },
  StyleGuide: {
    logo: {
      borderColor: 'rgba(255,255,255,0.25)'
    },
    sidebar: {
      '& li > a': {
        color: `${colors.light} !important`
      }
    }
  },
  SectionHeading: {
    sectionName: {
      display: 'block',
      position: 'relative',
      fontWeight: 700,
      paddingTop: rhythm(1),
      paddingBottom: rhythm(0.5),
      marginBottom: rhythm(0.75),
      '&:before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: rhythm(3),
        height: '4px',
        backgroundColor: colors.primary,
        borderRadius: '4px'
      }
    }
  }
}

const theme = {
  color: {
    baseBackground: colors.light,
    border: colors.paleGrey,
    codeBackground: colors.paleGrey,
    error: colors.danger,
    light: colors.grey,
    lightest: colors.lightGrey,
    name: colors.primary,
    type: colors.seconday,
    base: colors.dark,
    link: colors.primary,
    linkHover: colors.tertiary,
    sidebarBackground: colors.primary
  },
  fontFamily: {
    base: '"proxima-nova", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  fontSize: {
    base: 15,
    text: 16,
    small: 13,
    h1: 38,
    h2: 32,
    h3: 22,
    h4: 18,
    h5: 16,
    h6: 16,
  },
  maxWidth: 760,
  sidebarWidth: 220
}

module.exports = {
  styles: styles,
  theme: theme
}
