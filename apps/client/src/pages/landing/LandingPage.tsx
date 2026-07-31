import {useNavigate} from 'react-router-dom';

import Image from '@components/Design/components/Image/Image';
import {IconHeundeut} from '@components/Design/components/Icons/Icons/IconHeundeut';
import useRequestGetUserInfo from '@hooks/queries/user/useRequestGetUserInfo';

import getImageUrl from '@utils/getImageUrl';

import {ROUTER_URLS} from '@constants/routerUrls';

import CreatorSection from './Section/CreatorSection/CreatorSection';
import {
  badgeStyle,
  brandStyle,
  ctaButtonStyle,
  ctaCopyStyle,
  ctaSectionStyle,
  featureCardStyle,
  featureContentStyle,
  featureGridStyle,
  featureImageFrameStyle,
  featureImageStyle,
  featureNumberStyle,
  featureSectionStyle,
  footerStyle,
  heroArtStyle,
  heroCopyStyle,
  heroDogStyle,
  heroGridStyle,
  heroPreviewHeaderStyle,
  heroPreviewListStyle,
  heroPreviewTotalStyle,
  heroSectionStyle,
  heroStatusStyle,
  landingStyle,
  navInnerStyle,
  navStyle,
  painCardStyle,
  painGridStyle,
  painSectionStyle,
  processCardStyle,
  processGridStyle,
  processSectionStyle,
  secondaryLinkStyle,
  sectionDescriptionStyle,
  sectionEyebrowStyle,
  sectionHeadingStyle,
  skipLinkStyle,
} from './LandingPage.style';

const painPoints = [
  {
    marker: '01',
    title: '똑같이 나누면 억울해요',
    description: '늦게 온 사람, 술을 안 마신 사람까지 모두 같은 금액을 내면 정산 뒤에 꼭 이야기가 남아요.',
    color: '#FFCAE5',
  },
  {
    marker: '02',
    title: '계산보다 연락이 더 오래 걸려요',
    description: '참여자마다 먹은 메뉴와 금액이 달라지면 계산기를 두드리고 다시 확인하는 일이 반복돼요.',
    color: '#67E8F9',
  },
  {
    marker: '03',
    title: '누가 보냈는지 자꾸 놓쳐요',
    description: '계좌를 다시 보내고 입금 내역을 대조하다 보면 모임이 끝난 뒤에도 정산이 끝나지 않아요.',
    color: '#DFFF4F',
  },
] as const;

const processSteps = [
  {
    number: '1',
    title: '정산 링크 만들기',
    description: '가입 없이 모임 이름과 비밀번호만 정하면 바로 시작할 수 있어요.',
  },
  {
    number: '2',
    title: '지출과 참여자 기록하기',
    description: '각 지출에 누가 참여했는지만 고르면 복잡한 분배는 행동대장이 맡아요.',
  },
  {
    number: '3',
    title: '각자 금액 확인하고 보내기',
    description: '링크에서 내 금액을 확인하고 토스·카카오페이·계좌 복사로 바로 이어가요.',
  },
] as const;

const features = [
  {
    number: '01',
    label: 'LINK FIRST',
    title: '연락처가 없어도 링크 하나면 충분해요',
    description:
      '회사 회식, 동아리 모임, 여행처럼 서로의 연락처를 몰라도 괜찮아요. 정산 링크만 공유하면 누구나 자기 내역을 확인할 수 있어요.',
    image: 'feature1',
    color: '#67E8F9',
  },
  {
    number: '02',
    label: 'FAIR SPLIT',
    title: '먹은 사람끼리만 정확하게 나눠요',
    description:
      '메뉴마다 참여자를 선택하면 지출별 인원에 맞춰 자동으로 계산해요. 늦게 왔거나 특정 메뉴를 먹지 않은 사람도 공평하게 정산할 수 있어요.',
    image: 'feature2',
    color: '#B575FF',
  },
  {
    number: '03',
    label: 'PAYMENT CHECK',
    title: '입금 여부를 한눈에 관리해요',
    description:
      '참여자별 정산 금액과 입금 상태를 한곳에서 확인하고 기록해요. 누가 아직 보내지 않았는지 다시 계산할 필요가 없어요.',
    image: 'feature3',
    color: '#DFFF4F',
  },
  {
    number: '04',
    label: 'SEND FAST',
    title: '확인한 금액 그대로 송금으로 이어져요',
    description:
      '계좌와 금액을 다시 입력하지 않아도 돼요. 모바일에서는 토스와 카카오페이로, 어디서든 계좌 정보 복사로 간편하게 이어져요.',
    image: 'feature4',
    color: '#FFCAE5',
  },
] as const;

const LandingPage = () => {
  const navigate = useNavigate();
  const {userInfo} = useRequestGetUserInfo();
  const {isGuest} = userInfo;

  const startSettlement = () => {
    navigate(isGuest ? ROUTER_URLS.login : ROUTER_URLS.main);
  };

  return (
    <div css={landingStyle}>
      <a href="#landing-main" css={skipLinkStyle}>
        본문 바로가기
      </a>

      <header css={navStyle}>
        <div css={navInnerStyle}>
          <a href="/" css={brandStyle} aria-label="행동대장 홈">
            <IconHeundeut />
            <strong>행동대장</strong>
          </a>
          <button type="button" css={ctaButtonStyle('compact')} onClick={startSettlement}>
            정산 시작하기
          </button>
        </div>
      </header>

      <main id="landing-main">
        <section css={heroSectionStyle} aria-labelledby="hero-heading">
          <div css={heroGridStyle}>
            <div css={heroCopyStyle}>
              <p css={badgeStyle('#DFFF4F')}>모임의 끝까지 책임지는 정산 도구</p>
              <h1 id="hero-heading">
                모임은 즐겁게,
                <br />
                <span>정산은 행동대장에게.</span>
              </h1>
              <p>
                사람마다 먹은 것도, 도착한 시간도 달랐나요?
                <br />
                링크 하나로 지출을 기록하면 각자 낼 금액을 알아서 계산해 드려요.
              </p>
              <div>
                <button type="button" css={ctaButtonStyle('large')} onClick={startSettlement}>
                  지금 정산 시작하기
                  <span aria-hidden="true">↗</span>
                </button>
                <a href="#why" css={secondaryLinkStyle}>
                  왜 필요한지 보기 ↓
                </a>
              </div>
              <small>가입 없이 시작할 수 있어요 · 모바일에 최적화되어 있어요</small>
            </div>

            <div css={heroArtStyle} aria-label="행동대장 정산 화면 미리보기">
              <div css={heroPreviewHeaderStyle}>
                <span>제주도 여행</span>
                <b>정산 중</b>
              </div>
              <div css={heroPreviewTotalStyle}>
                <span>전체 지출</span>
                <strong>184,500원</strong>
              </div>
              <ul css={heroPreviewListStyle}>
                <li>
                  <span>민지</span>
                  <strong>62,500원</strong>
                </li>
                <li>
                  <span>정우</span>
                  <strong>48,000원</strong>
                </li>
                <li>
                  <span>서연</span>
                  <strong>74,000원</strong>
                </li>
              </ul>
              <div css={heroStatusStyle}>
                <span aria-hidden="true">✓</span>
                참여자별 계산이 끝났어요
              </div>
              <Image
                css={heroDogStyle}
                src={getImageUrl('standingDog', 'webp')}
                fallbackSrc={getImageUrl('standingDog', 'png')}
                alt="행동대장 마스코트 행댕이"
              />
            </div>
          </div>
        </section>

        <section id="why" css={painSectionStyle} aria-labelledby="why-heading">
          <div>
            <p css={sectionEyebrowStyle('#FFCAE5')}>WHY HAENGDONG?</p>
            <h2 id="why-heading" css={sectionHeadingStyle('light')}>
              정산은 계산보다
              <br />
              <span>사람을 맞추는 일이 더 어렵습니다.</span>
            </h2>
            <p css={sectionDescriptionStyle('light')}>
              행동대장은 총액을 똑같이 나누는 계산기가 아니에요.
              <br />
              서로 다르게 참여한 모임을 납득할 수 있게 정리하는 도구예요.
            </p>
          </div>
          <ol css={painGridStyle}>
            {painPoints.map(item => (
              <li key={item.marker} css={painCardStyle(item.color)}>
                <span>{item.marker}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section css={processSectionStyle} aria-labelledby="process-heading">
          <p css={sectionEyebrowStyle('#67E8F9')}>HOW IT WORKS</p>
          <h2 id="process-heading" css={sectionHeadingStyle('dark')}>
            복잡한 정산을
            <br />세 단계로 끝내세요.
          </h2>
          <ol css={processGridStyle}>
            {processSteps.map((step, index) => (
              <li key={step.number} css={processCardStyle}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < processSteps.length - 1 && <b aria-hidden="true">→</b>}
              </li>
            ))}
          </ol>
        </section>

        <section id="features" css={featureSectionStyle} aria-labelledby="feature-heading">
          <div>
            <p css={sectionEyebrowStyle('#DFFF4F')}>BUILT FOR REAL MEETUPS</p>
            <h2 id="feature-heading" css={sectionHeadingStyle('dark')}>
              실제 모임에서 필요한 기능만,
              <br />
              정산의 흐름대로 담았어요.
            </h2>
            <p css={sectionDescriptionStyle('dark')}>
              링크 공유부터 공평한 계산, 입금 확인과 송금까지 한곳에서 이어집니다.
            </p>
          </div>

          <div css={featureGridStyle}>
            {features.map((feature, index) => (
              <article key={feature.number} css={featureCardStyle(feature.color, index)}>
                <div css={featureContentStyle}>
                  <span css={featureNumberStyle(feature.color)}>{feature.number}</span>
                  <p>{feature.label}</p>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <div css={featureImageFrameStyle(feature.color)}>
                  <Image
                    css={featureImageStyle}
                    src={getImageUrl(feature.image, 'webp')}
                    fallbackSrc={getImageUrl(feature.image, 'png')}
                    alt={`${feature.title} 기능 화면`}
                    loading="lazy"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <CreatorSection />

        <section css={ctaSectionStyle} aria-labelledby="cta-heading">
          <div css={ctaCopyStyle}>
            <p css={sectionEyebrowStyle('#FFCAE5')}>READY TO SETTLE?</p>
            <h2 id="cta-heading">
              다음 모임의 정산은
              <br />
              행동대장에게 맡겨보세요.
            </h2>
            <p>누가 얼마를 내야 하는지, 더 이상 단체 채팅방에서 계산하지 않아도 돼요.</p>
          </div>
          <button type="button" css={ctaButtonStyle('large')} onClick={startSettlement}>
            무료로 정산 시작하기
            <span aria-hidden="true">↗</span>
          </button>
        </section>
      </main>

      <footer css={footerStyle}>
        <strong>행동대장</strong>
        <a href="https://github.com/Todari/2024-haeng-dong" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
