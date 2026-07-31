import {css} from '@emotion/react';

export const sectionStyle = css({
  width: '100%',
  padding: '5.25rem 1.25rem 5.75rem',
  borderBottom: '2px solid #242126',
  color: '#242126',
  backgroundColor: '#F0E5FF',

  '@media (min-width: 768px)': {
    padding: '7rem 2rem 7.5rem',
  },
});

export const sectionInnerStyle = css({
  width: 'min(100%, 1120px)',
  margin: '0 auto',
});

export const creatorIntroStyle = css({
  maxWidth: '820px',

  '> p:last-of-type': {
    maxWidth: '650px',
    marginTop: '1.35rem',
    color: '#68616C',
    fontSize: 'clamp(0.98rem, 2vw, 1.12rem)',
    lineHeight: 1.75,
    wordBreak: 'keep-all',
  },
});

export const sectionLabelStyle = css({
  display: 'inline-flex',
  padding: '0.5rem 0.75rem',
  border: '1.5px solid #242126',
  borderRadius: '999px',
  color: '#242126',
  backgroundColor: '#FFFFFF',
  fontFamily: 'monospace',
  fontSize: '0.64rem',
  fontWeight: 850,
  letterSpacing: '0.13em',
  lineHeight: 1,
});

export const creatorHeadingStyle = css({
  marginTop: '1.55rem',
  fontSize: 'clamp(2.15rem, 5.5vw, 4.1rem)',
  fontWeight: 900,
  letterSpacing: '-0.052em',
  lineHeight: 1.08,
  wordBreak: 'keep-all',
});

export const partStyle = css({
  marginTop: '3.5rem',
});

export const teamLabelStyle = css({
  display: 'inline-flex',
  marginBottom: '1.35rem',
  padding: '0.45rem 0.7rem',
  border: '1.5px solid #242126',
  borderRadius: '0.6rem',
  color: '#242126',
  backgroundColor: '#FFFFFF',
  fontFamily: 'monospace',
  fontSize: '0.62rem',
  fontWeight: 850,
  letterSpacing: '0.1em',
  lineHeight: 1,
});

export const avatarContainerStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1.5rem 1.1rem',

  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '1.75rem',
  },

  '@media (min-width: 1024px)': {
    gap: '2.5rem',
  },
});
