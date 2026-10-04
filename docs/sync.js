/* 용돈 기록장: 구글 로그인과 계정 저장.
   인터넷이 없거나 Firebase를 불러오지 못해도 앱은 이 기기에서 그대로 써요. */
import { firebaseConfig } from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';
const app = window.YongdonApp;
const SAVED = '구글 계정에 저장돼요.';
let started = false;

async function main() {
  if (started || !app) return;

  let A, F, S;
  try {
    [A, F, S] = await Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js'),
      import(SDK + 'firebase-firestore.js')
    ]);
  } catch (e) {
    return; // 인터넷이 없어요. 다시 연결되면 한 번 더 해 봐요.
  }
  started = true;

  const fbApp = A.initializeApp(firebaseConfig);
  const auth = F.getAuth(fbApp);
  const db = S.getFirestore(fbApp);
  const btn = document.getElementById('authBtn');
  btn.hidden = false;

  let unsub = null;
  let ref = null;
  let timer = null;
  let writing = false;
  let again = false;
  let first = true;
  let baseText = '';

  function flash(text) {
    app.setSyncText(text);
    setTimeout(() => app.setSyncText(baseText), 4000);
  }

  async function push() {
    if (!ref) return;
    if (writing) { again = true; return; }
    writing = true;
    try {
      do {
        again = false;
        await S.setDoc(ref, app.getState());
      } while (again);
      baseText = SAVED;
      app.setSyncText(baseText);
    } catch (e) {
      app.setSyncText('계정에 저장하지 못했어요. 이 기기에는 저장됐어요.');
    }
    writing = false;
  }

  function schedulePush() {
    clearTimeout(timer);
    timer = setTimeout(push, 600);
  }

  F.getRedirectResult(auth).catch(() => {});

  F.onAuthStateChanged(auth, (user) => {
    if (unsub) { unsub(); unsub = null; }
    clearTimeout(timer);
    app.onChange = null;
    ref = null;
    first = true;

    if (!user) {
      btn.textContent = '구글로 로그인';
      baseText = '';
      app.setSyncText('');
      return;
    }

    btn.textContent = '로그아웃';
    baseText = SAVED;
    app.setSyncText(baseText);
    ref = S.doc(db, 'yongdonBooks', user.uid);

    unsub = S.onSnapshot(ref, (snap) => {
      if (snap.metadata.hasPendingWrites) return; // 내가 방금 쓴 것
      if (snap.metadata.fromCache && !snap.exists()) return; // 아직 서버 답이 아니에요. 기다려요.
      const data = snap.exists() ? snap.data() : null;
      if (first) {
        first = false;
        app.onChange = schedulePush;
        if (data) app.mergeRemote(data);          // 이 기기 기록과 계정 기록을 합쳐요
        else if (app.getState().rev > 0) schedulePush();
        return;
      }
      if (data) app.applyRemote(data);            // 다른 기기에서 바꾼 기록
    }, () => {
      app.setSyncText('계정에 연결하지 못했어요. 이 기기에는 저장돼요.');
    });
  });

  btn.addEventListener('click', async () => {
    if (auth.currentUser) {
      await F.signOut(auth);
      return;
    }
    const provider = new F.GoogleAuthProvider();
    btn.disabled = true;
    try {
      await F.signInWithPopup(auth, provider);
    } catch (e) {
      const code = e && e.code;
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        try {
          await F.signInWithRedirect(auth, provider);
        } catch (e2) {
          flash('로그인하지 못했어요. 다시 해 볼까요?');
        }
      } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        flash('로그인하지 못했어요. 다시 해 볼까요?');
      }
    }
    btn.disabled = false;
  });
}

main();
window.addEventListener('online', main);
