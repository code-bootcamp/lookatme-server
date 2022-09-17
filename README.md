<h1 style="border-bottom:2px solid gray; margin: 30px 0;">SHAKI</h1>

<img src="https://user-images.githubusercontent.com/80080990/183401984-5e414592-acbc-4bc7-a62c-d1b5974f00a0.png">

<h2 style="text-align: center;">신개념 공유주방 플랫폼 <br> [Sha(re) Ki(tchen)] 쉐이키 
</h2>
<div style="border-top:2px solid gray; margin: 30px 0;"></div>

<div>연인과의 데이트나 지인들과의 모임 전 고민이 오늘 뭐 먹지?,  어디 음식점을 가야 하지?, 우리 인원이 다 들어갈 수 있을까? 고민이 될 때! 매 번 맛집을 검색해서 가도 웨이팅(waiting) 너무 길고 지난번 갔던 그 음식점은 한 번 가봐서 끌리지 않을때!! 공유주방 Shaki(쉐이키) 가 이색적인 모임공간을 대여 해드립니다!</div>
<br>
<div>공유주방 Shaki(쉐이키)는 특별한 날 친구,연인,가족 들과 최신 시설의 주방 및 주방용품과 무드있는 식사공간을 대여해 맛있는 음식을 해 먹으면서 추억도 쌓고!, 위생적으로도 믿음이 가고!, 시끄럽든 안시끄럽든 남의 눈치 볼 필요 없고! 분위기 내고 싶은대로 골라서 대여 할 수 있는 소셜 다이닝 플랫폼입니다.</div>

<div style="border-top:2px solid gray; margin: 30px 0;"></div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">기술 스택</h2>

<img src="https://user-images.githubusercontent.com/80080990/183402203-1a33347f-6b47-4f25-8144-89886cafeb2b.jpg">
</div>

<div style="margin-top: 20px 0">
  <li>TypeScript</li>
  <li>NodeJS</li>
  <li>NestJS</li>
  <li>GraphQL</li>
  <li>TypeORM</li>
  <li>Redis</li>
  <li>Mysql</li>
  <li>Docker</li>
  <li>Git, Github</li>
  <li>Kubernetes</li>
  <li>GCP</li>
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">Flow Chart</h2>

<img src="https://user-images.githubusercontent.com/80080990/183402451-1c6c1a6c-c635-42a2-9443-0f7d3942ed88.png">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">ERD</h2>

<img src="https://user-images.githubusercontent.com/80080990/183402619-9d68b1e3-e53a-49e4-b99b-e768c439af13.png">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">폴더 구조</h2>

```
f7b3_team04_server
├── .vscode
│   └── settings.json
├── src
│   ├── apis
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.resolver.ts
│   │   │   └── auth.service.ts
│   │   ├── branch
│   │   │   ├── __test__
│   │   │   │   ├── branch.resolver.spec.ts
│   │   │   │   └── branch.service.spec.ts
│   │   │   ├── entities
│   │   │   │   └── branch.entity.ts
│   │   │   ├── branch.module.ts
│   │   │   ├── branch.resolver.ts
│   │   │   └── branch.service.ts
│   │   ├── file
│   │   │   ├── file.module.ts
│   │   │   ├── file.resolver.ts
│   │   │   └── file.service.ts
│   │   ├── https
│   │   │   ├── https.controller.ts
│   │   │   └── https.module.ts
│   │   ├── iamport
│   │   │   └── iamport.service.ts
│   │   ├── payment
│   │   │   ├── dto
│   │   │   │   └── createPayment.input.ts
│   │   │   ├── entities
│   │   │   │   └── payment.entity.ts
│   │   │   ├── payment.module.ts
│   │   │   ├── payment.resolver.ts
│   │   │   └── payment.service.ts
│   │   ├── question
│   │   │   ├── dto
│   │   │   │   ├── createQuestion.input.ts
│   │   │   │   └── replyQuestion.input.ts
│   │   │   ├── entities
│   │   │   │   └── question.entity.ts
│   │   │   ├── question.module.ts
│   │   │   ├── question.resolver.ts
│   │   │   └── question.service.ts
│   │   ├── review
│   │   │   ├── dto
│   │   │   │   └── createReview.input.ts
│   │   │   ├── entities
│   │   │   │   └── review.entity.ts
│   │   │   ├── review.module.ts
│   │   │   ├── review.resolver.ts
│   │   │   └── review.service.ts
│   │   ├── room
│   │   │   ├── dto
│   │   │   │   ├── createRoom.input.ts
│   │   │   │   └── updateRoom.input.ts
│   │   │   ├── entities
│   │   │   │   ├── images.entity.ts
│   │   │   │   ├── room.entity.ts
│   │   │   │   └── review.entity.ts
│   │   │   ├── room.module.ts
│   │   │   ├── room.resolver.ts
│   │   │   └── room.service.ts
│   │   └── user
│   │       ├── dto
│   │       │   ├── createUser.input.ts
│   │       │   └── updateUser.input.ts
│   │       ├── entities
│   │       │   └── user.entity.ts
│   │       ├── user.module.ts
│   │       ├── user.resolver.ts
│   │       └── user.service.ts
│   ├── commons
│   │   ├── auth
│   │   │   ├── jwt-access.strategy.ts
│   │   │   ├── jwt-refresh.strategy.ts
│   │   │   ├── jwt-social-google.strategy.ts
│   │   │   ├── jwt-social-kakao.strategy.ts
│   │   │   └── jwt-social-naver.strategy.ts
│   │   ├── filter
│   │   │   └── http-exception.filter.ts
│   │   └── graphql
│   │       └── http-exception.filter.ts
│   ├── app.module.ts
│   ├── app.moduleLocal.ts
│   └── main.ts
├── test
├── .dockerignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── cloudbuild.yaml
├── docker-compose.prod.yaml
├── docker-compose.yaml
├── Dockerfile
├── Dockerfile.prod
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">. env 설정</h2>

<div>
  <li>EMAIL_USER</li>
  <li>EMAIL_PASS</li>
  <li>EMAIL_SENDER</li>
  <li>GOOGLE_CLIENT_ID</li>
  <li>GOOGLE_CLIENT_SECRET</li>
  <li>NAVER_CLIENT_ID</li>
  <li>NAVER_CLIENT_SECRET</li>
  <li>KAKAO_CLIENT_ID</li>
  <li>KAKAO_CLIENT_SECRET</li>
  <li>GCP_STORAGE_KEYFILENAME</li>
  <li>GCP_STORAGE_PROJECTID</li>
  <li>GCP_STORAGE_BUCKET</li>
  <li>IMP_KEY</li>
  <li>IMP_SECRET</li>
  <li>ACCESS_KEY</li>
  <li>REFRESH_KEY</li>
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">BackEnd 팀원 역할</h2>

<h3>임성준</h3>
<div>
  <li>Email: </li>
  <li>Github: </li> 
  <li>Git 관리</li>
  <li>ERD 설계 및 API DOCS 작업</li>
  <li>Backend CI/CD 배포</li>
  <li>예약, 리뷰 및 문의 기능 구현</li>
  <li>테스트 코드 작성</li>
</div>

<h3 style="margin-top: 30px;">조영래</h3>
<div>
  <li>Email: </li>
  <li>Github: </li>
  <li>ERD 설계 및 API DOCS 작업</li>
  <li>로그인 기능 구현</li>
  <li>회원가입 기능 구현</li>
  <li>결제 기능 구현</li>
  <li>이미지 업로드 기능 구현</li>
  <li>테스트 코드 작성</li>
</div>
