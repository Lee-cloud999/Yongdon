# 용돈 기록장 (PWA)

초등학생이 받은 돈과 쓴 돈을 적고, 남은 돈과 저금 목표를 보는 용돈기입장이에요.
폰 홈 화면에 설치해서 앱처럼 쓰고, 인터넷이 없어도 열려요.
구글로 로그인하면 여러 기기에서 같은 기록을 볼 수 있어요. (어린이 본인보다 부모님 구글 계정으로 로그인하는 걸 권해요.)

## 폴더 구성

- `public/` 앱 파일
  - `index.html` 앱 화면과 기록 로직
  - `sync.js` 구글 로그인과 계정 저장 (Firebase Auth, Firestore)
  - `firebase-config.js` Firebase 웹 앱 설정 값
  - `sw.js`, `manifest.webmanifest`, `icons/` 설치와 오프라인용 파일
- `firebase.json`, `.firebaserc` Firebase Hosting 설정 (별도 사이트 `yongdon-book`)
- `docs/firestore-rules-snippet.txt` Firestore 보안 규칙에 추가할 내용

## 이 앱이 쓰는 Firebase 프로젝트

마음조각 앱과 같은 프로젝트(`maeum-jogak2`)를 같이 써요. 서로 섞이지 않게 이렇게 나눴어요.

- 호스팅: 기본 사이트(`maeum-jogak2.web.app`)는 건드리지 않고, 별도 사이트 `yongdon-book`에 올려요.
- 데이터: Firestore의 `yongdonBooks` 컬렉션에만 저장해요. 문서 하나가 한 사람의 기록이에요.
- 보안 규칙: 기존 규칙에 한 블록만 추가해요. 덮어쓰지 않아요.

## 처음 한 번만 하기

1. **구글 로그인 켜기**: Firebase 콘솔 > Authentication > 로그인 방법에서 Google이 켜져 있는지 확인해요.
2. **보안 규칙 추가**: 콘솔 > Firestore Database > 규칙에서 `docs/firestore-rules-snippet.txt`의 블록을 기존 규칙 안에 붙여 넣고 게시해요.
   (터미널의 `firebase deploy --only firestore:rules`는 쓰지 마세요. 마음조각 앱 규칙이 덮어써져요.)
3. **호스팅 사이트 만들기**:

```bash
npm install -g firebase-tools
firebase login
firebase hosting:sites:create yongdon-book
```

   `yongdon-book`이 이미 쓰이고 있으면 다른 이름으로 만들고, `.firebaserc`의 `"yongdon-book"`도 같은 이름으로 바꿔요.
4. **로그인 허용 주소 추가**: 콘솔 > Authentication > 설정 > 승인된 도메인에 `yongdon-book.web.app`을 추가해요. (사이트 이름을 바꿨다면 그 이름으로요.) 이걸 빼먹으면 로그인 창이 오류로 닫혀요.

## 올리기

이 폴더에서:

```bash
firebase deploy --only hosting:yongdon
```

끝나면 `https://yongdon-book.web.app` 주소가 나와요.
`firebase init`은 실행하지 마세요. 설정 파일이 덮어써져요.

## 폰에 설치하기

- 안드로이드(Chrome): 주소를 열고 메뉴의 "앱 설치" 또는 "홈 화면에 추가"
- 아이폰(Safari): 공유 버튼에서 "홈 화면에 추가"

## 고쳐서 다시 올릴 때

`public/sw.js` 맨 위의 `CACHE = 'yongdon-v2'`에서 숫자를 올려 주세요(`v3`, `v4`...).
그래야 이미 설치한 폰에도 새 버전이 들어가요.

## 기록은 어디에 저장되나요

- 로그인하지 않으면: 지금 쓰는 기기 안에만 저장돼요. 기기마다 따로예요.
- 로그인하면: 기기에도 저장하고, 구글 계정(Firestore)에도 저장해요. 다른 기기에서 같은 계정으로 로그인하면 같은 기록이 보여요.
- 처음 로그인할 때는 이 기기의 기록과 계정의 기록을 합쳐요. 합칠 때는 지운 기록이 되살아날 수 있어요.
- 인터넷이 없으면 기기에만 저장하고, 다시 연결되면 계정에도 올라가요.
- 아이폰은 사파리와 홈 화면 앱의 저장 공간이 달라요. 홈 화면 앱에서 로그인하면 기록이 이어져요.
- 로그인 창이 뜨지 않는 환경(일부 아이폰 홈 화면 앱)에서는 창 대신 화면이 넘어가는 방식으로 다시 시도해요. 그것도 안 되면 사파리에서 로그인해 보세요.
