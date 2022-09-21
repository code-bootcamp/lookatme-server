<h1 style="border-bottom:2px solid gray; margin: 30px 0;">Look AT Me</h1>

<img src="https://user-images.githubusercontent.com/80080990/183401984-5e414592-acbc-4bc7-a62c-d1b5974f00a0.png">

<h2 style="text-align: center;">
2030을 위한 심리상담소<br> Look At Me
</h2>

<div style="border-top:2px solid gray; margin: 30px 0;"></div>

<div>
최근, 2030들은 인플레이션으로 인한 물가 상승, 수요에 비해 부족한 일자리 공급, 서로 간의 비교 등 많은 것에 지쳐있고 이로 인해 다양한 심리 문제가 발생하고 있습니다.
</div>
<br>
<div>
이런 사람들이 정신과에 가서 상담을 받거나 오프라인으로 심리 상담사한테 상담을 받는 등 행동까지 이어지기는 매우 번거롭고 부담스럽습니다.
</div>
<br>
<div>
이들을 위해, 온라인으로 본인의 고민을 털어놓고 같은 고민으로 힘들어하는 사람들과 소통할 수 있는 커뮤니티를 제공해주고 전문가들과 온라인 채팅을 통해 부담없이 상담을 받을 수 있는 플랫폼을 기획했습니다. </div>
<br>
<div>
인스타그램, 페이스북 등 SNS에서는 본인의 잘난 부분만 자랑하는 사람들이 대부분인 반면, 저희가 기획, 개발한 플랫폼에서는 본인의 가장 약한 부분, 가장 고민되는 부분 등을 거리낌없이 공유함으로써 모든 사람들이 함께 고민을 나눈다는 점에서 “나를 봐!” 라는 의미의 “Look At Me”란 이름으로 기획하였습니다.
</div>
<br>
<div>
Look At Me의 로고 속 눈동자는 나를 바라보고 있는 눈동자를 의미합니다.
</div>

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
