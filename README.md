# 용돈 기록장 (PWA)

초등학생이 받은 돈과 쓴 돈을 적고, 남은 돈과 저금 목표를 보는 용돈기입장이에요.
폰 홈 화면에 설치해서 앱처럼 쓰고, 인터넷이 없어도 열려요.
구글로 로그인하면 여러 기기에서 같은 기록을 볼 수 있어요. (어린이 본인보다 부모님 구글 계정으로 로그인하는 걸 권해요.)

앱 주소: https://lee-cloud999.github.io/Yongdon/

## 폴더 구성

- `docs/` 앱 파일 (GitHub Pages가 이 폴더를 보여 줘요)
  - `index.html` 앱 화면과 기록 로직
  - `sync.js` 구글 로그인과 계정 저장 (Firebase Auth, Firestore)
  - `firebase-config.js` Firebase 웹 앱 설정 값
  - `sw.js`, `manifest.webmanifest`, `icons/` 설치와 오프라인용 파일
- `firebase/firestore-rules-snippet.txt` Firestore 보안 규칙에 추가한 내용

## 호스팅과 Firebase

- 앱 파일은 GitHub Pages에서 보여 줘요. (저장소 Settings > Pages: Branch `main`, 폴더 `/docs`)
- 로그인과 기록 저장은 마음조각 앱과 같은 Firebase 프로젝트(`maeum-jogak2`)를 같이 써요.
- 기록은 Firestore의 `yongdonBooks` 컬렉션에만 저장해요. 문서 하나가 한 사람의 기록이에요.
- Firebase 콘솔 Authentication > 설정 > 승인된 도메인에 `lee-cloud999.github.io`가 들어 있어야 로그인돼요.

## 폰에 설치하기

- 안드로이드(Chrome): 주소를 열고 메뉴의 "앱 설치" 또는 "홈 화면에 추가"
- 아이폰(Safari): 공유 버튼에서 "홈 화면에 추가"

## 고쳐서 다시 올릴 때

`docs/sw.js` 맨 위의 `CACHE = 'yongdon-v2'`에서 숫자를 올려 주세요(`v3`, `v4`...).
그래야 이미 설치한 폰에도 새 버전이 들어가요.

## 기록은 어디에 저장되나요

- 로그인하지 않으면: 지금 쓰는 기기 안에만 저장돼요. 기기마다 따로예요.
- 로그인하면: 기기에도 저장하고, 구글 계정(Firestore)에도 저장해요. 다른 기기에서 같은 계정으로 로그인하면 같은 기록이 보여요.
- 처음 로그인할 때는 이 기기의 기록과 계정의 기록을 합쳐요. 합칠 때는 지운 기록이 되살아날 수 있어요.
- 인터넷이 없으면 기기에만 저장하고, 다시 연결되면 계정에도 올라가요.
- 아이폰은 사파리와 홈 화면 앱의 저장 공간이 달라요. 홈 화면 앱에서 로그인하면 기록이 이어져요.
- 로그인 창이 뜨지 않는 환경(일부 아이폰 홈 화면 앱)에서는 창 대신 화면이 넘어가는 방식으로 다시 시도해요. 그것도 안 되면 사파리에서 로그인해 보세요.
