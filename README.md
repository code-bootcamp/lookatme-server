<h1 style="border-bottom:2px solid gray; margin: 30px 0;">Look AT Me</h1>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%; height: 450px; background-color: #73c0a9;">
<img style="overflow: hidden;" src="http://drive.google.com/uc?export=view&id=13r8IigMJgdQWc-fKmTI8UEULTAh2tJZD">
</div>

<h2 style="text-align: center;">
2030을 위한 심리상담소
<br>
Look At Me
</h2>

<div style="border-top:2px solid gray; margin: 30px 0;"></div>

```
최근, 2030들은 인플레이션으로 인한 많은 것에 지쳐있고 이로 인해 
다양한 심리적 문제가 발생하고 있습니다. 

하지만, 아직도 우리나라에서 정신과나 심리상담센터의 진입장벽은 상당히 높은 편입니다.

이러한 점을 개선하기 위해 온라인으로 본인의 고민을 털어놓고,
같은 고민으로 힘들어하는 사람들과 소통할 수 있는 커뮤니티를 제공해주고,
전문가들과 온라인 채팅을 통해 부담없이 상담을 받을 수 있는 플랫폼을 기획했습니다. 

인스타그램, 페이스북 등 SNS에서는 본인의 잘난 부분만 자랑하는 사람들이 대부분인 반면, 
저희가 기획, 개발한 플랫폼에서는 본인의 가장 약한 부분, 가장 고민되는 부분 등을 거리낌없이 공유함으로써
모든사람들이 함께 고민을 나눈다는 점에서 

“나를 봐!” 라는 의미의 “Look At Me”란 이름으로 기획하였습니다.
```

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">기술 스택</h2>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%; height: 450px;">
<img style="overflow: hidden;" src="http://drive.google.com/uc?export=view&id=1s98uhzGeDbsUjLYEZNT7odYuOl27dVNe">
</div>

<div style="margin-top: 20px">
  <li>TypeScript</li>
  <li>Node.js</li>
  <li>Nest.js</li>
  <li>MySQL</li>
  <li>GCP</li>
  <li>TypeORM</li>
  <li>Graphql</li>
  <li>WebSocket</li>
  <li>Cron-Scheduler</li>
  <li>Kubernetes</li>
  <li>Redis</li>
  <li>Git</li>
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">Flow Chart</h2>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%;">
<img src="http://drive.google.com/uc?export=view&id=1q4m00Nb19P7CxRcepAIBxPU7Ku9bjGM6">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">Pipeline</h2>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%; height: 600px;">
<img style="overflow: hidden;" src="http://drive.google.com/uc?export=view&id=1thrOH-j8DGroS7Vbwf2jWDUKf-wIkVFb">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">ERD</h2>

<img src="http://drive.google.com/uc?export=view&id=1r9xahl1h_rVgmFw0dZgvdWn8GClDzb08">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">API Docs</h2>
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%;">
<img src="http://drive.google.com/uc?export=view&id=1UMH_gH2KodnBNlX_YKec3jKY-Ivo-8gM">
<img src="http://drive.google.com/uc?export=view&id=1zjuVT5pZWQLVLdZsegdsMfjnaSjFhoc7">
<img src="http://drive.google.com/uc?export=view&id=1R1wnRL1_tR4hpIpftEs3LFbyNOAdzMlX">
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

<h3>송재의</h3>
<div>
    <a href = "https://github.com/x0ng120x"> <img alt="GitHub" src ="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white"/> </a>
    <img alt="Gmail" src="https://img.shields.io/badge/jaysong0120@gmail.com-EA4335.svg?&style=for-the-badge&logo=Gmail&logoColor=white"/>
  <li>Git 관리</li>
  <li>Backend CI/CD 배포</li>
  <li>ERD 설계 및 API DOCS 작업</li>
  <li>채팅 기능 구현</li>
  <li>Task Scheduling을 활용한 명언 주기적 자동 업데이트 기능 구현</li>
  <li>로그인 기능 구현</li>
  <li>회원가입 기능 구현</li>
  <li>결제 기능 구현</li>
</div>

<h3 style="margin-top: 30px;">조영래</h3>
<div>
    <a href = "https://github.com/chohyanglae"> <img alt="GitHub" src ="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white"/> </a>
    <img alt="Gmail" src="https://img.shields.io/badge/jaws100707@gmail.com-EA4335.svg?&style=for-the-badge&logo=Gmail&logoColor=white"/>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</div>
