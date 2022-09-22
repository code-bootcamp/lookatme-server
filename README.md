<h1 style="border-bottom:2px solid gray; margin: 30px 0;">Look AT Me</h1>

<div align="center">
<img src="https://user-images.githubusercontent.com/78432849/191470673-c3010e9c-969d-4dca-b695-bf352f106757.png">
</div>

<h2 align="center">
2030을 위한 심리상담소!
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
<img style="overflow: hidden;" src="https://user-images.githubusercontent.com/78432849/191470854-1a3aba59-9ffd-480e-b0f7-1192159f1658.png">
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
<img src="https://user-images.githubusercontent.com/78432849/191491114-ddf250f3-1d03-4f50-a241-0e15fc8578e2.png">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">Pipeline</h2>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%; height: 600px;">
<img style="overflow: hidden;" src="https://user-images.githubusercontent.com/78432849/191471089-be6fdb23-7b71-4852-bdac-7ab9594ccce2.png">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">ERD</h2>

<img src="https://user-images.githubusercontent.com/78432849/191471151-6d049733-94ce-49ef-9f56-f692cabf0d45.png">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">API Docs</h2>
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%;">
<img src="https://user-images.githubusercontent.com/78432849/191713336-33847cf7-d410-4d19-be64-89352dff7332.png">
<img src="https://user-images.githubusercontent.com/78432849/191713366-673be413-1421-400e-a583-95ddd9127bd8.png">
<img src="https://user-images.githubusercontent.com/78432849/191713379-5e21f398-41a5-4e1d-95a5-24a203b172a8.png">
</div>

<h2 style="border-bottom:2px solid gray; margin: 30px 0;">폴더 구조</h2>

```
f8b4_team06_server
├── .vscode
│   └── settings.json
├── src
│   ├── apis
│   │   ├── admin
│   │   │   ├── dto
│   │   │   │   └── createAdmin.input.ts
│   │   │   ├── entities
│   │   │   │   └── admin.entity.ts
│   │   │   ├── admins.module.ts
│   │   │   ├── admins.resolver.ts
│   │   │   └── admins.service.ts
│   │   ├── auth
│   │   │   ├── auths.controller.ts
│   │   │   ├── auths.module.ts
│   │   │   ├── auths.resolver.ts
│   │   │   └── auths.service.ts
│   │   ├── batch
│   │   │   ├── batches.controller.ts
│   │   │   ├── batches.module.ts
│   │   │   └── batches.service.ts
│   │   ├── category
│   │   │   ├── entites
│   │   │   │   └── category.entity.ts
│   │   │   └── categories.service.ts
│   │   ├── chat
│   │   │   ├── dto
│   │   │   │   └── chatList.output.ts
│   │   │   ├── entities
│   │   │   │   ├── chatMessage.entity.ts
│   │   │   │   └── specialistChatMessage.entity.ts
│   │   │   ├── chats.gateway.ts
│   │   │   ├── chats.module.ts
│   │   │   ├── chats.resolver.ts
│   │   │   └── chats.service.ts
│   │   ├── comment
│   │   │   ├── dto
│   │   │   │   ├── createComment.input.ts
│   │   │   │   └── updateComment.input.ts
│   │   │   ├── entities
│   │   │   │   └── comment.entity.ts
│   │   │   ├── comments.module.ts
│   │   │   ├── comments.resolver.ts
│   │   │   └── comments.service.ts
│   │   ├── file
│   │   │   ├── files.module.ts
│   │   │   ├── files.resolver.ts
│   │   │   └── files.service.ts
│   │   ├── iamport
│   │   │   ├── iamports.module.ts
│   │   │   └── iamports.service.ts
│   │   ├── payment
│   │   │   ├── entities
│   │   │   │   └── payment.entity.ts
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.resolver.ts
│   │   │   └── payments.service.ts
│   │   ├── quote
│   │   │   ├── dto
│   │   │   │   ├── createQuote.input.ts
│   │   │   │   └── updateQuote.input.ts
│   │   │   ├── entities
│   │   │   │   └── quote.entity.ts
│   │   │   ├── defaultQuoteList.ts
│   │   │   ├── quotes.module.ts
│   │   │   ├── quotes.resolver.ts
│   │   │   └── quotes.service.ts
│   │   ├── specialist
│   │   │   ├── dto
│   │   │   │   ├── createSpecialist.input.ts
│   │   │   │   └── updateSpecialist.input.ts
│   │   │   ├── entities
│   │   │   │   └── specialist.entity.ts
│   │   │   ├── specialists.module.ts
│   │   │   ├── specialists.resolver.ts
│   │   │   └── specialists.service.ts
│   │   ├── specialistComment
│   │   │   ├── dto
│   │   │   │   ├── createSpecialistComment.input.ts
│   │   │   │   └── updateSpecialistComment.input.ts
│   │   │   ├── entities
│   │   │   │   └── specialistComment.entity.ts
│   │   │   ├── specialistComments.module.ts
│   │   │   ├── specialistComments.resolver.ts
│   │   │   └── specialistComments.service.ts
│   │   ├── specialistReview
│   │   │   ├── dto
│   │   │   │   └── createSpecialistReveiw.input.ts
│   │   │   ├── entities
│   │   │   │   └── specialistReveiw.entity.ts
│   │   │   ├── specialistReveiws.module.ts
│   │   │   ├── specialistReveiws.resolver.ts
│   │   │   └── specialistReveiws.service.ts
│   │   ├── story
│   │   │   ├── dto
│   │   │   │   ├── createStory.input.ts
│   │   │   │   └── updateStory.input.ts
│   │   │   ├── entities
│   │   │   │   └── story.entity.ts
│   │   │   ├── stories.module.ts
│   │   │   ├── stories.resolver.ts
│   │   │   └── stories.service.ts
│   │   ├── storyImage
│   │   │   ├── entities
│   │   │   │   └── storyImage.entity.ts
│   │   ├── ticket
│   │   │   ├── entities
│   │   │   │   └── ticket.entity.ts
│   │   │   ├── tickets.module.ts
│   │   │   ├── tickets.resolver.ts
│   │   │   └── tickets.service.ts
│   │   ├── underComment
│   │   │   ├── dto
│   │   │   │   ├── createunderComment.input.ts
│   │   │   │   └── updateunderComment.input.ts
│   │   │   ├── entities
│   │   │   │   └── UnderComment.entity.ts
│   │   │   ├── underComments.module.ts
│   │   │   ├── underComments.resolver.ts
│   │   │   └── underComments.service.ts
│   │   ├── underSpecialistComment
│   │   │   ├── dto
│   │   │   │   ├── createUnderSpecialistComment.input.ts
│   │   │   │   └── updateUnderSpecialistComment.input.ts
│   │   │   ├── entities
│   │   │   │   └── underSpecialistComment.entity.ts
│   │   │   ├── underSpecialistComments.module.ts
│   │   │   ├── underSpecialistComments.resolver.ts
│   │   │   └── underSpecialistComments.service.ts
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
│   │   │   ├── gql-auth.guard.ts
│   │   │   ├── jwt-access.strategy.ts
│   │   │   ├── jwt-admin-access.strategy.ts
│   │   │   ├── jwt-refresh.strategy.ts
│   │   │   ├── jwt-social-google.strategy.ts
│   │   │   ├── jwt-social-kakao.strategy.ts
│   │   │   ├── jwt-social-naver.strategy.ts
│   │   │   └── jwt-specialist-access.strategy.ts
│   │   ├── filter
│   │   │   └── http-exception.filter.ts
│   │   └── graphql
│   │   │    └── schema.gql
│   │   └── libraries
│   │   │   └── utills.ts
│   │   └── type
│   │   │   ├── context.ts
│   │   │   └── enum.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── test
├── .dockerignore
├── .env
├── .env.docker
├── .env.prod
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── cloudbuild.yaml
├── docker-compose.dev.yaml
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
  <li>DATABASE_TYPE</li>
  <li>DATABASE_HOST</li>
  <li>DATABASE_PORT</li>
  <li>DATABASE_USERNAME</li>
  <li>DATABASE_PASSWORD</li>
  <li>DATABASE_DATABASE</li>
  <li>GOOGLE_CLIENT_ID</li>
  <li>GOOGLE_CLIENT_SECRET</li>
  <li>NAVER_CLIENT_ID</li>
  <li>NAVER_CLIENT_SECRET</li>
  <li>KAKAO_CLIENT_ID</li>
  <li>KAKAO_CLIENT_SECRET</li>
  <li>IMP_CLIENT_KEY</li>
  <li>IMP_CLIENT_SECRET</li>
  <li>PROJECT_ID</li>
  <li>KEY_FILENAME</li>
  <li>BUCKET_NAME</li>
  <li>HASH_SALT</li>
  <li>JWT_ACCESS_SECRET</li>
  <li>JWT_REFRESH_SECRET</li>
  <li>SMS_KEY</li>
  <li>SMS_SECRET</li>
  <li>SMS_SENDER</li>
  <li>EMAIL_USER</li>
  <li>EMAIL_PASS</li>
  <li>EMAIL_SENDER</li>
  <li>CLIENT_DOMAIN</li>
  <li>LOCALHOST_DOMAIN</li>
  <li>SERVER_DOMAIN</li>
  <li>REDIS_IP</li>
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

<h3 style="margin-top: 30px;">조향래</h3>
<div>
    <a href = "https://github.com/chohyanglae"> <img alt="GitHub" src ="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white"/> </a>
    <img alt="Gmail" src="https://img.shields.io/badge/jaws100707@gmail.com-EA4335.svg?&style=for-the-badge&logo=Gmail&logoColor=white"/>
  <li>ERD 설계 및 API DOCS 작업</li>
  <li>파이프라인 작성</li>
  <li>이미지 파일 업로드 구현</li>
  <li>CRUD API 구현</li>
</div>
