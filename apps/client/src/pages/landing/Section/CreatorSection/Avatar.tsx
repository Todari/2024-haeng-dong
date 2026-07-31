import Image from '@components/Design/components/Image/Image';

import getImageUrl from '@utils/getImageUrl';

import {avatarImageFrameStyle, avatarImageStyle, avatarStyle} from './Avatar.style';

interface Props {
  imagePath: string;
  name: string;
  navigateUrl: string;
}

const Avatar = ({imagePath, name, navigateUrl}: Props) => {
  return (
    <a href={navigateUrl} target="_blank" rel="noreferrer" css={avatarStyle}>
      <span css={avatarImageFrameStyle}>
        <Image
          src={getImageUrl(imagePath, 'webp')}
          fallbackSrc={getImageUrl(imagePath, 'png')}
          loading="lazy"
          css={avatarImageStyle}
          alt={`${name} 프로필`}
        />
      </span>
      <strong>{name}</strong>
      <span>GitHub ↗</span>
    </a>
  );
};

export default Avatar;
