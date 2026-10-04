# 용돈 기록장 (PWA)

초등학생이 받은 돈과 쓴 돈을 적고, 남은 돈과 저금 목표를 보는 용돈기입장이에요.
폰 홈 화면에 설치해서 앱처럼 쓰고, 인터넷이 없어도 열려요.

## 폴더 구성

- `public/` 앱 파일 (index.html, manifest.webmanifest, sw.js, icons/)
- `firebase.json` Firebase Hosting 설정 (`public/` 폴더를 올려요)

## 1. GitHub에 올리기

GitHub에서 빈 저장소를 하나 만든 뒤(예: `yongdon-book`), 이 폴더에서 아래를 실행해요.

```bash
git init
git add .
git commit -m "용돈 기록장 PWA 첫 버전"
git branch -M main
git remote add origin https://github.com/<내-아이디>/yongdon-book.git
git push -u origin main
```

## 2. Firebase Hosting에 올리기

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트를 만들어요.
2. 터미널에서 설치하고 로그인해요.

```bash
npm install -g firebase-tools
firebase login
```

3. 이 폴더에서 프로젝트를 연결해요. (`firebase.json`이 이미 있어서 `init`은 필요 없어요.)

```bash
firebase use --add
```

4. 올려요.

```bash
firebase deploy --only hosting
```

끝나면 `https://<프로젝트-ID>.web.app` 주소가 나와요.

### GitHub에 올릴 때마다 자동으로 배포하고 싶다면

```bash
firebase init hosting:github
```

안내에 따라 저장소를 고르면 push할 때마다 자동으로 올라가요.
(이때 `public` 폴더와 `index.html` 덮어쓰기를 물으면 모두 **No**를 골라 주세요.)

## 3. 폰에 설치하기

- 안드로이드(Chrome): 주소를 열고 메뉴의 "앱 설치" 또는 "홈 화면에 추가"
- 아이폰(Safari): 공유 버튼에서 "홈 화면에 추가"

## 고쳐서 다시 올릴 때

`public/sw.js` 맨 위의 `CACHE = 'yongdon-v1'`에서 숫자를 올려 주세요(`v2`, `v3`...).
그래야 이미 설치한 폰에도 새 버전이 들어가요.

## 기록이 저장되는 곳

기록은 지금 쓰는 기기 안에 저장돼요(브라우저 localStorage).
기기마다 따로 저장되고, 아이폰에서는 사파리로 적은 기록이 홈 화면 앱으로 넘어가지 않아요.
여러 기기에서 같은 기록을 보려면 Firebase 로그인과 Firestore 저장을 붙여야 해요.
