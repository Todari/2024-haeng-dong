import {css} from '@emotion/react';

const COLORS = {
  primary: '#B575FF',
  primarySoft: '#F0E5FF',
  ink: '#242126',
  paper: '#FCFAF5',
  surface: '#FFFFFF',
  muted: '#68616C',
  line: '#D8D2DB',
} as const;

export const landingStyle = css({
  width: '100%',
  minWidth: 0,
  overflowX: 'hidden',
  color: COLORS.ink,
  backgroundColor: COLORS.paper,
  lineHeight: 1.5,

  '::selection': {
    color: COLORS.ink,
    backgroundColor: COLORS.primary,
  },

  'button, a': {
    WebkitTapHighlightColor: 'transparent',
  },

  '@media (prefers-reduced-motion: reduce)': {
    '*, *::before, *::after': {
      animationDuration: '0.01ms',
      animationIterationCount: 1,
      scrollBehavior: 'auto',
      transitionDuration: '0.01ms',
    },
  },
});

export const skipLinkStyle = css({
  position: 'fixed',
  top: '0.75rem',
  left: '0.75rem',
  zIndex: 100,
  padding: '0.75rem 1rem',
  border: `2px solid ${COLORS.ink}`,
  borderRadius: '0.65rem',
  color: COLORS.ink,
  backgroundColor: COLORS.surface,
  boxShadow: `3px 3px 0 ${COLORS.ink}`,
  fontWeight: 800,
  transform: 'translateY(-150%)',

  '&:focus': {
    transform: 'translateY(0)',
  },
});

export const navStyle = css({
  position: 'sticky',
  top: 0,
  zIndex: 30,
  width: '100%',
  borderBottom: `2px solid ${COLORS.ink}`,
  backgroundColor: 'rgba(252, 250, 245, 0.96)',
  backdropFilter: 'blur(12px)',
});

export const navInnerStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 'min(100%, 1120px)',
  minHeight: '4.5rem',
  margin: '0 auto',
  padding: '0.75rem 1.25rem',

  '@media (min-width: 768px)': {
    padding: '0.75rem 2rem',
  },
});

export const brandStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: COLORS.ink,
  fontSize: '1.1rem',
  lineHeight: 1,

  strong: {
    fontWeight: 900,
    letterSpacing: '-0.045em',
  },
});

type CtaSize = 'compact' | 'large';

export const ctaButtonStyle = (size: CtaSize) =>
  css({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.65rem',
    minHeight: size === 'large' ? '3.5rem' : '2.6rem',
    padding: size === 'large' ? '0.95rem 1.35rem' : '0.7rem 0.9rem',
    border: `2px solid ${COLORS.ink}`,
    borderRadius: size === 'large' ? '0.85rem' : '0.65rem',
    color: COLORS.ink,
    backgroundColor: COLORS.primary,
    boxShadow: size === 'large' ? `4px 4px 0 ${COLORS.ink}` : `3px 3px 0 ${COLORS.ink}`,
    fontSize: size === 'large' ? '0.98rem' : '0.78rem',
    fontWeight: 800,
    lineHeight: 1,
    transition: 'transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease',

    '&:hover': {
      backgroundColor: '#C494FF',
      boxShadow: `2px 2px 0 ${COLORS.ink}`,
      transform: 'translate(2px, 2px)',
    },

    '&:active': {
      boxShadow: 'none',
      transform: 'translate(4px, 4px)',
    },

    '@media (min-width: 768px)': {
      padding: size === 'large' ? '1rem 1.55rem' : '0.75rem 1rem',
      fontSize: size === 'large' ? '1.05rem' : '0.85rem',
    },
  });

export const heroSectionStyle = css({
  display: 'flex',
  alignItems: 'center',
  padding: '3.5rem 1.25rem 4.5rem',
  borderBottom: `2px solid ${COLORS.ink}`,
  backgroundColor: COLORS.paper,

  '@media (min-width: 768px)': {
    padding: '4.5rem 2rem 5rem',
  },
});

export const heroGridStyle = css({
  display: 'grid',
  alignItems: 'center',
  gap: '3.5rem',
  width: 'min(100%, 1120px)',
  margin: '0 auto',

  '@media (min-width: 920px)': {
    gridTemplateColumns: 'minmax(0, 1.05fr) minmax(25rem, 0.95fr)',
    gap: '5rem',
  },
});

export const heroCopyStyle = css({
  h1: {
    maxWidth: '720px',
    marginTop: '1.6rem',
    fontSize: 'clamp(2.65rem, 7vw, 5.25rem)',
    fontWeight: 900,
    letterSpacing: '-0.06em',
    lineHeight: 1.02,
    wordBreak: 'keep-all',
  },

  'h1 span': {
    color: '#7544B8',
  },

  '> p': {
    maxWidth: '600px',
    marginTop: '1.8rem',
    color: COLORS.muted,
    fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
    fontWeight: 500,
    lineHeight: 1.75,
    wordBreak: 'keep-all',
  },

  '> div': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '1.35rem',
    marginTop: '2.15rem',
  },

  small: {
    display: 'block',
    marginTop: '1.5rem',
    color: '#7B7480',
    fontSize: '0.78rem',
    fontWeight: 650,
    lineHeight: 1.5,
  },
});

export const badgeStyle = (backgroundColor: string) =>
  css({
    display: 'inline-flex',
    padding: '0.5rem 0.8rem',
    border: `2px solid ${COLORS.ink}`,
    borderRadius: '999px',
    color: COLORS.ink,
    backgroundColor,
    fontSize: '0.68rem',
    fontWeight: 850,
    letterSpacing: '0.01em',
    lineHeight: 1,

    '@media (min-width: 768px)': {
      padding: '0.58rem 0.9rem',
      fontSize: '0.76rem',
    },
  });

export const secondaryLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '2.6rem',
  padding: '0.65rem 0',
  borderBottom: `1.5px solid ${COLORS.ink}`,
  color: COLORS.ink,
  fontSize: '0.86rem',
  fontWeight: 750,
  lineHeight: 1,

  '&:hover': {
    color: '#7544B8',
    borderColor: '#7544B8',
  },
});

export const heroArtStyle = css({
  position: 'relative',
  width: 'min(100%, 28rem)',
  minHeight: '29rem',
  margin: '0 auto',
  padding: '1.4rem',
  overflow: 'hidden',
  border: `2px solid ${COLORS.ink}`,
  borderRadius: '1.25rem',
  backgroundColor: COLORS.surface,
  boxShadow: `7px 7px 0 ${COLORS.primary}`,

  '@media (max-width: 480px)': {
    minHeight: '26.5rem',
    padding: '1.15rem',
  },
});

export const heroPreviewHeaderStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '1rem',
  borderBottom: `1px solid ${COLORS.line}`,

  span: {
    fontSize: '0.95rem',
    fontWeight: 850,
  },

  b: {
    padding: '0.35rem 0.55rem',
    border: `1.5px solid ${COLORS.ink}`,
    borderRadius: '999px',
    backgroundColor: COLORS.primarySoft,
    fontSize: '0.65rem',
    fontWeight: 800,
    lineHeight: 1,
  },
});

export const heroPreviewTotalStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: '1.5rem 0 1.25rem',

  span: {
    color: COLORS.muted,
    fontSize: '0.75rem',
    fontWeight: 700,
  },

  strong: {
    fontSize: '1.75rem',
    fontWeight: 900,
    letterSpacing: '-0.04em',
  },
});

export const heroPreviewListStyle = css({
  display: 'grid',
  gap: '0.65rem',

  li: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 0.9rem',
    border: `1.5px solid ${COLORS.ink}`,
    borderRadius: '0.7rem',
    backgroundColor: COLORS.paper,
  },

  span: {
    fontSize: '0.78rem',
    fontWeight: 700,
  },

  strong: {
    fontSize: '0.82rem',
    fontWeight: 850,
  },
});

export const heroStatusStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
  padding: '0.65rem 0.8rem',
  borderRadius: '0.65rem',
  color: '#553184',
  backgroundColor: COLORS.primarySoft,
  fontSize: '0.72rem',
  fontWeight: 800,

  span: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    color: COLORS.surface,
    backgroundColor: '#7544B8',
    fontSize: '0.65rem',
  },
});

export const heroDogStyle = css({
  position: 'absolute',
  right: '-1.2rem',
  bottom: '-0.75rem',
  width: '9rem',
  height: '9rem',
  objectFit: 'contain',
  filter: 'drop-shadow(3px 4px 0 rgba(36, 33, 38, 0.16))',

  '@media (min-width: 480px)': {
    right: '-0.5rem',
    width: '10.5rem',
    height: '10.5rem',
  },
});

export const painSectionStyle = css({
  padding: '5.25rem 1.25rem 5.75rem',
  borderBottom: `2px solid ${COLORS.ink}`,
  backgroundColor: COLORS.primarySoft,

  '> div': {
    width: 'min(100%, 1120px)',
    margin: '0 auto',
  },

  '@media (min-width: 768px)': {
    padding: '7rem 2rem 7.5rem',
  },
});

type TextTone = 'light' | 'dark';

export const sectionEyebrowStyle = (backgroundColor: string) =>
  css({
    display: 'inline-flex',
    padding: '0.5rem 0.75rem',
    border: `1.5px solid ${COLORS.ink}`,
    borderRadius: '999px',
    color: COLORS.ink,
    backgroundColor,
    fontFamily: 'monospace',
    fontSize: '0.64rem',
    fontWeight: 850,
    letterSpacing: '0.13em',
    lineHeight: 1,
  });

export const sectionHeadingStyle = (_tone: TextTone) =>
  css({
    maxWidth: '900px',
    marginTop: '1.55rem',
    color: COLORS.ink,
    fontSize: 'clamp(2.15rem, 5.5vw, 4.1rem)',
    fontWeight: 900,
    letterSpacing: '-0.052em',
    lineHeight: 1.08,
    wordBreak: 'keep-all',

    span: {
      color: '#7544B8',
    },
  });

export const sectionDescriptionStyle = (_tone: TextTone) =>
  css({
    maxWidth: '700px',
    marginTop: '1.5rem',
    color: COLORS.muted,
    fontSize: 'clamp(0.98rem, 2vw, 1.12rem)',
    lineHeight: 1.75,
    wordBreak: 'keep-all',
  });

export const painGridStyle = css({
  display: 'grid',
  gap: '1rem',
  width: 'min(100%, 1120px)',
  margin: '3rem auto 0',

  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.2rem',
  },
});

export const painCardStyle = (accentColor: string) =>
  css({
    minHeight: '15rem',
    padding: '1.5rem',
    border: `2px solid ${COLORS.ink}`,
    borderRadius: '1rem',
    backgroundColor: COLORS.surface,
    boxShadow: `4px 4px 0 ${COLORS.ink}`,

    '> span': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '2.5rem',
      height: '2.1rem',
      padding: '0 0.55rem',
      border: `1.5px solid ${COLORS.ink}`,
      borderRadius: '999px',
      backgroundColor: accentColor,
      fontFamily: 'monospace',
      fontSize: '0.68rem',
      fontWeight: 850,
    },

    h3: {
      marginTop: '2rem',
      fontSize: '1.28rem',
      fontWeight: 850,
      letterSpacing: '-0.025em',
      lineHeight: 1.3,
      wordBreak: 'keep-all',
    },

    p: {
      marginTop: '0.85rem',
      color: COLORS.muted,
      fontSize: '0.9rem',
      lineHeight: 1.7,
      wordBreak: 'keep-all',
    },
  });

export const processSectionStyle = css({
  padding: '5.25rem 1.25rem 5.75rem',
  borderBottom: `2px solid ${COLORS.ink}`,
  backgroundColor: COLORS.paper,

  '> p, > h2, > ol': {
    width: 'min(100%, 1120px)',
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  '@media (min-width: 768px)': {
    padding: '7rem 2rem 7.5rem',
  },
});

export const processGridStyle = css({
  display: 'grid',
  gap: '1rem',
  marginTop: '3rem !important',

  '@media (min-width: 880px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

export const processCardStyle = css({
  position: 'relative',
  minHeight: '13.5rem',
  padding: '1.5rem',
  borderTop: `2px solid ${COLORS.ink}`,

  '> span': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    border: `2px solid ${COLORS.ink}`,
    borderRadius: '0.65rem',
    backgroundColor: COLORS.primary,
    fontFamily: 'monospace',
    fontWeight: 900,
  },

  h3: {
    marginTop: '1.55rem',
    fontSize: '1.18rem',
    fontWeight: 850,
    letterSpacing: '-0.02em',
    lineHeight: 1.35,
  },

  p: {
    marginTop: '0.75rem',
    color: COLORS.muted,
    fontSize: '0.88rem',
    lineHeight: 1.7,
    wordBreak: 'keep-all',
  },

  b: {
    display: 'none',
  },

  '@media (min-width: 880px)': {
    paddingRight: '2.5rem',

    b: {
      position: 'absolute',
      top: '1.75rem',
      right: '0.25rem',
      display: 'block',
      color: '#958C99',
      fontSize: '1.35rem',
    },
  },
});

export const featureSectionStyle = css({
  padding: '5.25rem 1.25rem 5.75rem',
  borderBottom: `2px solid ${COLORS.ink}`,
  backgroundColor: COLORS.surface,

  '> div': {
    width: 'min(100%, 1120px)',
    margin: '0 auto',
  },

  '@media (min-width: 768px)': {
    padding: '7rem 2rem 7.5rem',
  },
});

export const featureGridStyle = css({
  display: 'grid',
  gap: '1.5rem',
  marginTop: '3rem !important',
});

export const featureCardStyle = (accentColor: string, index: number) =>
  css({
    display: 'grid',
    gap: '2rem',
    alignItems: 'center',
    padding: '1.35rem',
    border: `2px solid ${COLORS.ink}`,
    borderRadius: '1.15rem',
    backgroundColor: COLORS.paper,
    boxShadow: `5px 5px 0 ${accentColor}`,

    '@media (min-width: 860px)': {
      gridTemplateColumns: 'minmax(0, 0.9fr) minmax(22rem, 1.1fr)',
      gap: '3.5rem',
      padding: '2.5rem',

      '> div:first-of-type': {
        order: index % 2 === 0 ? 0 : 2,
      },

      '> div:last-of-type': {
        order: index % 2 === 0 ? 2 : 0,
      },
    },
  });

export const featureContentStyle = css({
  '> p:first-of-type': {
    marginTop: '1.25rem',
    color: '#7A717F',
    fontFamily: 'monospace',
    fontSize: '0.64rem',
    fontWeight: 850,
    letterSpacing: '0.13em',
  },

  h3: {
    marginTop: '0.75rem',
    fontSize: 'clamp(1.65rem, 3.5vw, 2.5rem)',
    fontWeight: 900,
    letterSpacing: '-0.045em',
    lineHeight: 1.14,
    wordBreak: 'keep-all',
  },

  '> p:last-of-type': {
    marginTop: '1.1rem',
    color: COLORS.muted,
    fontSize: '0.92rem',
    lineHeight: 1.75,
    wordBreak: 'keep-all',
  },
});

export const featureNumberStyle = (backgroundColor: string) =>
  css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '3rem',
    height: '2.35rem',
    padding: '0 0.65rem',
    border: `1.5px solid ${COLORS.ink}`,
    borderRadius: '999px',
    backgroundColor,
    fontFamily: 'monospace',
    fontSize: '0.72rem',
    fontWeight: 850,
  });

export const featureImageFrameStyle = (backgroundColor: string) =>
  css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '18rem',
    padding: '1.25rem',
    overflow: 'hidden',
    border: `1.5px solid ${COLORS.ink}`,
    borderRadius: '0.9rem',
    backgroundColor,

    '@media (min-width: 768px)': {
      minHeight: '24rem',
      padding: '1.75rem',
    },
  });

export const featureImageStyle = css({
  width: '100%',
  maxWidth: '24rem',
  maxHeight: '22rem',
  objectFit: 'contain',
  filter: 'drop-shadow(0 10px 12px rgba(36, 33, 38, 0.14))',
});

export const ctaSectionStyle = css({
  display: 'grid',
  alignItems: 'end',
  gap: '2rem',
  width: 'min(calc(100% - 2.5rem), 1120px)',
  margin: '4.5rem auto',
  padding: '1.75rem',
  border: `2px solid ${COLORS.ink}`,
  borderRadius: '1.15rem',
  backgroundColor: COLORS.primary,
  boxShadow: `6px 6px 0 ${COLORS.ink}`,

  '> button': {
    justifySelf: 'start',
    backgroundColor: COLORS.surface,
  },

  '@media (min-width: 768px)': {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: '3rem',
    margin: '6.5rem auto',
    padding: '3rem',

    '> button': {
      justifySelf: 'end',
    },
  },
});

export const ctaCopyStyle = css({
  h2: {
    marginTop: '1.35rem',
    fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
    fontWeight: 900,
    letterSpacing: '-0.052em',
    lineHeight: 1.1,
    wordBreak: 'keep-all',
  },

  '> p:last-of-type': {
    maxWidth: '620px',
    marginTop: '1.1rem',
    color: '#493657',
    fontSize: '0.95rem',
    lineHeight: 1.7,
    wordBreak: 'keep-all',
  },
});

export const footerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.7rem',
  padding: '2.25rem 1.25rem',
  borderTop: `2px solid ${COLORS.ink}`,
  color: COLORS.paper,
  backgroundColor: COLORS.ink,

  strong: {
    fontSize: '1.1rem',
    fontWeight: 900,
  },

  a: {
    alignSelf: 'flex-start',
    color: '#CFA8FF',
    fontSize: '0.78rem',
    fontWeight: 800,
    lineHeight: 1.4,
  },

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem max(2rem, calc((100vw - 1120px) / 2))',
  },
});
