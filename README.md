<div align="center">
  <img
    src="https://d392hh8td3eqj7.cloudfront.net/runningDog.png"
    width="150"
    alt="행동대장 마스코트 행댕이"
  />

# 행동대장

**가입 없이 링크 하나로 시작하는 모임 정산 서비스**

여행, 회식, 동아리처럼 각자 참여한 내역이 다른 모임에서도
지출별 참여자를 기준으로 금액을 계산하고 입금 확인과 송금까지 이어갈 수 있습니다.

[서비스 사용하기](https://haengdong.todari.dev) ·
[문제 제보하기](https://github.com/Todari/2024-haeng-dong/issues)

</div>

![행동대장 서비스 소개](https://github.com/user-attachments/assets/9e51f7a3-0326-4c06-8b03-65aca574c10c)

## 왜 행동대장인가요?

모임 총무가 모든 금액을 똑같이 나누면 늦게 온 사람이나 특정 메뉴를 먹지 않은 사람이 불공평하게
느낄 수 있습니다. 계산이 끝난 뒤에도 계좌를 다시 공유하고, 입금 내역을 대조하고, 아직 보내지
않은 사람을 확인하는 일이 남습니다.

행동대장은 이 과정을 하나의 정산 링크 안에서 처리합니다.

- 회원가입 없이 모임 이름과 비밀번호만으로 정산을 시작합니다.
- 연락처를 몰라도 링크를 공유해 각자의 정산 내역을 확인할 수 있습니다.
- 지출마다 참여자를 선택해 실제 참여 내역에 맞게 금액을 나눕니다.
- 참여자별 입금 상태를 기록하고 확인한 금액 그대로 송금으로 이어갑니다.

## 핵심 기능

| 기능               | 설명                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| 비회원 모임 생성   | 모임 이름, 닉네임, 비밀번호만으로 정산 링크를 만듭니다.                  |
| 링크 공유          | 참여자는 별도 가입 없이 공유받은 링크에서 자신의 정산 내역을 확인합니다. |
| 참여자별 자동 계산 | 지출마다 참여자를 지정하고, 고정 금액과 균등 분배를 조합해 계산합니다.   |
| 입금 현황 관리     | 참여자별 정산 금액과 입금 여부를 한 화면에서 관리합니다.                 |
| 계좌·송금 연결     | 총무의 계좌 정보를 공유하고 확인한 금액을 송금 흐름으로 연결합니다.      |
| 카카오 로그인      | 반복해서 모임을 관리할 사용자는 카카오 계정으로 로그인할 수 있습니다.    |

## 사용 흐름

1. 총무가 모임 이름과 비밀번호를 입력해 정산 링크를 만듭니다.
2. 참여자와 지출 내역을 추가하고 각 지출에 참여한 사람을 선택합니다.
3. 행동대장이 참여자별 최종 정산 금액을 계산합니다.
4. 링크를 공유하면 참여자가 자신의 금액과 계좌 정보를 확인합니다.
5. 총무는 입금 여부를 기록하며 정산을 마무리합니다.

## 기술 구성

| 영역           | 기술                                                            |
| -------------- | --------------------------------------------------------------- |
| Client         | React 18, TypeScript, Webpack, Emotion, TanStack Query, Zustand |
| Server         | NestJS, TypeScript, Prisma, Passport JWT                        |
| Database       | PostgreSQL                                                      |
| Authentication | 비회원 비밀번호 인증, Kakao OAuth                               |
| Test           | Jest, Testing Library, MSW, Storybook, Chromatic                |
| Infrastructure | Vercel, AWS EC2, Docker Compose, Nginx, CloudFront              |
| Observability  | Sentry, Google Analytics 4                                      |

### 시스템 구조

![행동대장 인프라 구조](https://github.com/user-attachments/assets/c89bcedf-dee1-4c02-a3df-249e112186f6)

- 웹 클라이언트는 Vercel에서 제공합니다.
- API는 `api.haengdong.todari.dev`를 통해 EC2의 NestJS 서버로 전달됩니다.
- PostgreSQL과 API 서버는 Docker Compose로 실행합니다.
- 이미지 자산은 서비스 도메인과 분리된 CloudFront 배포 주소를 사용합니다.

## 저장소 구조

```text
.
├── apps
│   ├── client          # React 웹 애플리케이션
│   └── server          # 현재 운영 중인 NestJS API
├── packages
│   └── shared          # 클라이언트·서버 공용 타입과 로직
├── deploy
│   └── nginx           # 프로덕션 API 리버스 프록시 설정
├── server              # 초기 Spring 서버 구현 기록
├── docker-compose.yml      # PostgreSQL·NestJS 로컬 컨테이너 구성
├── docker-compose.prod.yml # 프로덕션 컨테이너 구성
└── pnpm-workspace.yaml
```

## 로컬 개발

### 요구 사항

- Node.js 20.15.1 이상
- pnpm 9.15.0
- Docker와 Docker Compose

### 설치

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
```

### 클라이언트 실행

```bash
pnpm dev:client
```

기본 주소는 `http://localhost:3000`입니다. 현재 개발 서버의 `/api` 프록시는 배포된 API를
바라보므로 상태를 변경하는 테스트를 할 때는 실제 운영 데이터가 생성되지 않도록 주의해야 합니다.

### 로컬 API 실행

먼저 PostgreSQL을 실행합니다.

```bash
docker compose up -d db
```

로컬 전용 환경변수를 설정한 뒤 Prisma 스키마를 반영하고 서버를 실행합니다. 실제 비밀값은
저장소에 커밋하지 마세요.

```bash
export DATABASE_URL="postgresql://haengdong:haengdong@localhost:5432/haengdong?schema=public"
export JWT_SECRET="local-only-secret"
export CORS_ORIGIN="http://localhost:3000"

pnpm --filter @haeng-dong/server prisma:generate
pnpm --filter @haeng-dong/server exec prisma db push
pnpm dev:server
```

API 기본 주소는 `http://localhost:8080/api`입니다. 카카오 로그인을 로컬에서 확인하려면
`KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`과 Kakao Developers의 로컬 Redirect URI 등록이
추가로 필요합니다.

### 자주 쓰는 명령

| 명령                                         | 설명                            |
| -------------------------------------------- | ------------------------------- |
| `pnpm dev:client`                            | 클라이언트 개발 서버 실행       |
| `pnpm dev:server`                            | NestJS 개발 서버 실행           |
| `pnpm lint`                                  | 전체 워크스페이스 린트          |
| `pnpm test`                                  | 전체 워크스페이스 테스트        |
| `pnpm build`                                 | 전체 워크스페이스 프로덕션 빌드 |
| `pnpm --filter @haeng-dong/client storybook` | Storybook 실행                  |

## CI/CD

Pull Request에서 클라이언트와 서버의 린트·테스트·빌드를 검증합니다. `main` 반영 후 클라이언트는
Vercel, 서버는 GitHub Actions와 Docker Compose를 통해 배포합니다.

<details>
<summary>Backend CI/CD 파이프라인</summary>

![행동대장 Backend CI/CD](https://github.com/user-attachments/assets/3e0d414e-b5cd-4f13-a334-3a26b5c942aa)

</details>

<details>
<summary>Frontend CI/CD 파이프라인</summary>

![행동대장 Frontend CI/CD](https://github.com/user-attachments/assets/fc924c43-ea3a-47e3-b455-310afad1e61e)

</details>

## 프로젝트 배경

행동대장은 2024년 우아한테크코스 팀 프로젝트로 시작했습니다. 처음 만든 팀의 기록과 기여 이력은
그대로 보존하면서, 현재 코드베이스는 React 클라이언트와 NestJS API를 중심으로 유지하고 있습니다.

[전체 기여자 보기](https://github.com/Todari/2024-haeng-dong/graphs/contributors)
