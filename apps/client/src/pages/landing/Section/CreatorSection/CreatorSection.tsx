import useAmplitude from '@hooks/useAmplitude';

import Avatar from './Avatar';
import {
  avatarContainerStyle,
  creatorHeadingStyle,
  creatorIntroStyle,
  partStyle,
  sectionInnerStyle,
  sectionLabelStyle,
  sectionStyle,
  teamLabelStyle,
} from './CreatorSection.style';
import InViewportTrigger from './InViewportTrigger';

const CreatorSection = () => {
  const frontEndDevelopers = [
    {imagePath: 'todari', name: '토다리', navigateUrl: 'https://github.com/Todari'},
    {imagePath: 'cookie', name: '쿠키', navigateUrl: 'https://github.com/jinhokim98'},
    {imagePath: 'soha', name: '소하', navigateUrl: 'https://github.com/soi-ha'},
    {imagePath: 'weadie', name: '웨디', navigateUrl: 'https://github.com/pakxe'},
  ];
  const backEndDevelopers = [
    {imagePath: '2sang', name: '이상', navigateUrl: 'https://github.com/kunsanglee'},
    {imagePath: 'baekho', name: '백호', navigateUrl: 'https://github.com/Arachneee'},
    {imagePath: 'mangcho', name: '망쵸', navigateUrl: 'https://github.com/3Juhwan'},
    {imagePath: 'gamja', name: '감자', navigateUrl: 'https://github.com/khabh'},
  ];

  const {trackViewLandingPageBottom} = useAmplitude();

  return (
    <InViewportTrigger callback={trackViewLandingPageBottom} css={sectionStyle}>
      <div css={sectionInnerStyle}>
        <div css={creatorIntroStyle}>
          <p css={sectionLabelStyle}>THE ORIGINAL TEAM</p>
          <h2 css={creatorHeadingStyle}>
            행동대장을 처음 만든
            <br />
            여덟 명의 행동대장들
          </h2>
          <p>서로 다른 역할의 팀원들이 모여, 모임의 마지막까지 기분 좋게 끝낼 수 있는 정산 경험을 만들었습니다.</p>
        </div>

        <div css={partStyle}>
          <p css={teamLabelStyle}>FRONTEND · 04</p>
          <div css={avatarContainerStyle}>
            {frontEndDevelopers.map(developer => (
              <Avatar key={developer.imagePath} {...developer} />
            ))}
          </div>
        </div>

        <div css={partStyle}>
          <p css={teamLabelStyle}>BACKEND · 04</p>
          <div css={avatarContainerStyle}>
            {backEndDevelopers.map(developer => (
              <Avatar key={developer.imagePath} {...developer} />
            ))}
          </div>
        </div>
      </div>
    </InViewportTrigger>
  );
};

export default CreatorSection;
