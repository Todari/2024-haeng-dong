import {css} from '@emotion/react';

export const avatarStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.4rem',
  color: '#242126',
  lineHeight: 1.4,
  transition: 'transform 160ms ease',

  strong: {
    marginTop: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: 900,
  },

  '> span:last-of-type': {
    color: '#766E7A',
    fontFamily: 'monospace',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
  },

  '&:hover': {
    transform: 'translateY(-4px)',
  },
});

export const avatarImageFrameStyle = css({
  display: 'block',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  border: '2px solid #242126',
  borderRadius: '1rem',
  backgroundColor: '#F0E5FF',
  boxShadow: '4px 4px 0 #B575FF',
});

export const avatarImageStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});
