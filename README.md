<img width="1888" height="932" alt="Image" src="https://github.com/user-attachments/assets/c54cd4ac-dc02-4159-af54-9e5df56ecf83" />

🛒 GreenCart

친환경 중고거래 플랫폼입니다. 사용자 간의 실시간 1:1 채팅과 카카오 소셜 로그인을 지원합니다.

🛠 기술 스택

Frontend: React, TypeScript, Zustand, Styled-Components

Backend: Node.js, Express, Socket.io, MongoDB

✨ 주요 기능

간편 로그인: 카카오 API(OAuth 2.0)를 활용한 소셜 로그인 지원

실시간 채팅: Socket.io를 활용한 1:1 대화 및 전역 알림 기능

상품 관리: 상품 등록, 수정, 삭제, 검색 및 페이지네이션

마이페이지: 내 판매 내역 관리, 찜한 상품 모아보기, 내 정보 수정

UI/UX: 상태 관리(Zustand)와 낙관적 업데이트를 적용한 즉각적인 하트(찜) 반응

💻 실행 방법

1. 패키지 설치

# 프론트엔드 종속성 설치

cd front

yarn install

# 백엔드 종속성 설치

cd backend

npm install

2. 환경 변수 설정 (.env)

프론트엔드 루트와 backend 폴더에 각각 .env 파일을 만들고 아래 변수를 설정합니다.

VITE_KAKAO_REST_API_KEY, MONGO_URI, JWT_SECRET 등

3. 프로젝트 실행

# 프론트엔드 실행 (새 터미널)

cd front

yarn dev

# 백엔드 실행 (새 터미널)

cd backend

npm run dev
