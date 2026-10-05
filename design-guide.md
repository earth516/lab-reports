# SJ 실험 보고서 — 디자인·형식 가이드

새 실험 보고서를 만들거나 기존 보고서를 손볼 때, **내용과 무관하게 항상 지켜야 하는 디자인/구조/기술적 규칙**을 정리한 문서다.
실제 실험 내용(빈칸 정답, 관찰 항목 등)은 여기 포함하지 않는다 — 그건 각 보고서 파일 자체와 README.md를 참고할 것.

> 이 문서는 다른 AI 어시스턴트(Gemini 등)에게 그대로 넘겨서 참고 자료로 써도 되도록 독립적으로 작성했다.
> 새 실험 HTML을 만들 때는 이 문서의 규칙을 따르는 것과 더불어, **기존 완성 파일 1~2개를 함께 참고 자료로 주고 "이 구조·스타일을 그대로 따라서 만들어줘"라고 요청하는 것**이 가장 정확하다 — 특히 모달·footer·PDF 저장 코드는 통째로 복사해서 값만 바꾸는 걸 권장한다.

---

## 1. 톤 & 컬러 시스템

다크 배경 + 민트 포인트. 모든 보고서가 아래 CSS 변수를 그대로 쓴다.

```css
:root{
  --paper:#0c0e12;   /* 가장 어두운 배경 (입력칸 안쪽) */
  --surface:#171a20; /* 카드/패널 배경 */
  --sunk:#1e222b;    /* 살짝 띄운 배경 (라벨칸, 고정 안내 박스) */
  --ink:#e8eaee;     /* 기본 텍스트 */
  --body:#b4b9c4;    /* 보조 텍스트 */
  --faint:#8b909b;   /* 흐린 텍스트 (힌트, placeholder) */
  --line:#2a2e37;    /* 테두리 */
  --line-soft:#22262b;
  --sea:#7dd3c8;      /* 포인트 컬러 (민트) */
  --sea-deep:#7dd3c8;
  --sea-soft:rgba(125,211,200,.14);
  --coral:#e06a5b;    /* 오답/에러 */
}
```

- 헤더 배경은 `#101216`(별도 하드코딩, 사이트 전체와 통일).
- 정답/성공 상태는 그린 계열(`#4ade80`)을 별도로 쓴다 — `--coral`(오답)과 짝을 이루는 색으로, 변수화하지 않고 직접 `.correct`/`.blank.correct` 규칙에 하드코딩되어 있다.
- 폰트는 Pretendard (`cdn.jsdelivr.net/gh/orioncactus/pretendard`), 본문 17px, `word-break:keep-all`(한글 단어 단위 줄바꿈).
- `:root`에 `color-scheme:dark;`를 반드시 넣는다. 이게 없으면 `<input type="date">`를 눌렀을 때 뜨는 브라우저 기본 달력 팝업이 흰 배경으로 튀어나와서 다크 테마랑 안 어울린다.

**보고서(#report, PDF로 나가는 부분)는 이 다크 팔레트를 쓰지 않는다.** `#report` 블록 안에서는 CSS 변수를 흰 종이용으로 재정의한다:

```css
#report{background:#fff;padding:20mm 16mm;color:#141414;
  --ink:#141414;--body:#4a4a4a;--faint:#9a9a9a;--line:#e0e0e0;--line-soft:#ececec;
  --sea:#141414;--sea-deep:#141414;--sea-soft:#ececec}
```

즉 **화면(입력 UI)은 다크, PDF/보고서 미리보기는 항상 흰 종이** — 이 원칙은 절대 깨지 않는다.

### 하위분류별 포인트 컬러

`--sea`(포인트 컬러) 하나만 바꾸면 버튼·강조 텍스트·정답 표시·footer 배지까지 전체가 자동으로 따라간다. **지구과학 탭의 대기·해양과 지질만 고유색을 쓰고, 나머지는 전부 기본 민트**를 쓴다.

| 탭 | 하위분류 | `--sea` / `--sea-deep` | `--sea-soft` |
|---|---|---|---|
| 지구과학 | 대기·해양 | `#6fb3e6` (블루) | `rgba(111,179,230,.14)` |
| 지구과학 | 지질 | `#e0913e` (황토) | `rgba(224,145,62,.14)` |
| 지구과학 | 우주 · 융합 | `#7dd3c8` (민트, 기본값) | `rgba(125,211,200,.14)` |
| 통합과학·과학탐구실험 | 물리학 · 화학 · 생명과학 · 지구과학 | `#7dd3c8` (민트, 기본값) | `rgba(125,211,200,.14)` |

같은 실험이라도 **어느 탭에 놓이느냐로 색이 정해진다.** 예: 지질시대 화석 박람회는 지구과학 탭 버전은 황토, 통합과학 탭 버전은 민트.

이 표는 허브 페이지(`index.html`)의 `SUB_META` 색과 반드시 일치시킨다. 색을 바꿀 때는 이 표, `SUB_META`, 해당 보고서 파일의 `:root` 세 곳을 같이 고친다.

---

## 2. 페이지 구조 (헤더 · 탭 내비게이션)

```
header.top (다크, kicker + h1)
nav (탭 버튼들, 가로 스크롤 가능, sticky)
.wrap
  section.step (탭마다 하나, 마지막 탭 = 보고서)
.bar (이전 / 다음 / 초기화 버튼, 하단 고정)
```

- 탭은 번호(`01`, `02`...) + 이름. 완료된 탭은 `.done` 클래스로 체크마크(✓) 표시.
- 마지막 탭은 항상 **보고서 미리보기 + PDF 저장 버튼**.
- 탭 순서 예시: 01 정보입력 → 02 활동안내(목표·준비물 고정 표시) → 03 이론적 배경(빈칸+채점) → 04 관찰/실험 → 05 조사하기 또는 자료해석 → 06 보고서.
  탭 개수·이름은 실험마다 다르지만 **"정보입력이 맨 앞, 보고서가 맨 뒤"** 구조는 고정.

### 제목 · kicker 규칙

실험 제목 하나(아래 "제목")를 정하면 네 군데에 똑같이 쓴다.

| 위치 | 형식 | 예 |
|---|---|---|
| 헤더 `<h1>` | 제목 (끝에 🔎 같은 이모지는 허용) | `화성암 관찰하기 🔎` |
| `<title>` | 제목 + ` · 활동 보고서` | `화성암 관찰하기 · 활동 보고서` |
| 보고서 머리 `<h2>` | 제목 + ` 활동 보고서` | `화성암 관찰하기 활동 보고서` |
| 허브 `REPORTS`의 `name` | 헤더 `<h1>`과 동일 | `화성암 관찰하기 🔎` |

- 제목이 "○○ 실험(부제)" 형태면 "활동 보고서" 대신 "탐구 보고서"를 쓴다. 예: `구름 만들기 실험(단열 변화) · 탐구 보고서`
- 번호가 붙는 연작은 `산화·환원 실험(1) - 구리판의 변화`처럼 괄호 앞에 띄어쓰기 없이 쓴다.
- "연구노트", "(feat. ○○)", "통합과학 실험 보고서 — ○○" 같은 변형은 쓰지 않는다.
- kicker는 `<탭 이름> 탐구활동 (<하위분류 이름>)` 형식이고, 하위분류 이름은 허브의 이름과 똑같이 쓴다. 예: `지구과학 탐구활동 (대기·해양)`, `통합과학 탐구활동 (화학)`. "(해양)"처럼 줄여 쓰지 않는다.

> **예외 파일**: `neutralization-reaction.html`(중화 반응)은 다른 보고서와 구조가 다르다(하단 `.bar` 대신 단계별 버튼, 별도 모달 시스템, PDF 여백 처리 방식 다름). 동작에는 문제가 없어서 그대로 두지만, **새 보고서의 베이스로는 쓰지 않는다.**

---

## 3. 01 정보입력 — 표 형식

카드 나열이 아니라 **표(`<table class="info-form">`) 형태**로 압축한다. 항목이 몇 개든 한 행에 최대한 몰아넣고, 라벨 칸은 내용 길이에 맞춰 자동으로 줄어든다(`width:1%` 트릭).

```css
.info-form td.lbl{width:1%;white-space:nowrap;background:var(--sunk);color:var(--sea);font-weight:700}
```

- 예시 텍스트(placeholder)는 실제 값처럼 보여서 학생이 헷갈릴 수 있으므로 **학번·이름·장소 등에는 넣지 않는다.** 형식 안내가 필요한 항목(반 등)에만 짧게 넣는다.
- 반(class) 입력 칸에는 **정규식 필터를 걸지 않는다.** 숫자·영문·한글 무엇이든 자유롭게 입력되게 두고 `maxlength`만 건다. 입력할 때마다 `replace()`로 값을 고쳐 쓰면 한글 IME 조합 중인 글자가 깨지는 버그가 생긴다(실제로 발생했던 버그).
- 모바일(700px 이하)에서는 표가 세로로 쌓이도록 반응형 처리한다.

---

## 4. 목표 · 준비물 — 고정값

학생이 수정할 수 없는 값은 **파일 상단 JS 상수**로 박아두고, 02번째 탭 정도에 고정 안내 박스로 보여준다.

```js
const FIXED_GOAL = "...";
const FIXED_MATERIALS = "...";
```

```html
<div class="fixed-note"><b>목표</b><span id="disp_goal"></span></div>
<div class="fixed-note"><b>준비물</b><span id="disp_materials"></span></div>
```

다른 실험지에 재사용할 때는 이 두 상수만 바꾸면 된다.

---

## 5. 사진 업로드

- `<input type="file" accept="image/*">` — **`capture` 속성을 넣지 않는다.** 넣으면 카메라만 강제로 켜져서 갤러리(사진 보관함) 선택이 막힌다.
- 업로드 즉시 캔버스로 리사이즈해서 **긴 변 900px, JPEG 품질 75%**로 저장한다(모든 파일 공통). 보고서 안의 사진은 대부분 높이 120~140px 칸에 들어가고, A4 폭 전체로 써도 900px이면 충분히 선명하다. 용량은 1100px일 때보다 30% 안팎 작아서 PDF도 가볍고 빨리 저장된다.
- 사진 처리 함수는 퇴적암 파일의 `shrink()`를 표준으로 복사해 쓴다(`createImageBitmap`의 `imageOrientation:'from-image'`로 방향 보정, 흰 배경 채우기, HEIC 등 못 읽는 형식은 안내 문구).
- WebP로 저장하지 않는다. 아이패드 Safari는 캔버스를 WebP로 저장하지 못하고 PNG로 바꿔 버려서 오히려 몇 배 커진다.
- 미리보기/보고서 이미지 모두 `object-fit:contain`을 쓴다(`cover`로 하면 비율이 안 맞을 때 사진이 잘리거나 늘어나 보인다).
- 보고서에 사진이 없을 수도 있는 자리는 `display:none`이 아니라 **`visibility:hidden`**을 써야 할 때가 있다 — 같은 행(그리드)에 있는 다른 칸과 높이를 맞춰야 할 때(display:none은 그 칸을 그리드에서 아예 없애버려서 정렬이 깨진다).

---

## 6. 빈칸 채우기 + 채점 시스템

### 빈칸 스타일
```html
<input class="blank save" id="b1" placeholder="ㅈㅈㅅㄷ" required>
```
- **이론적 배경·개념 확인 탭의 빈칸에는 빠짐없이 힌트를 넣는다.** 기본은 정답의 초성 힌트이고, 정답이 여러 단어면 단어 사이를 띄운다(예: 심층순환 → `ㅅㅊ ㅅㅎ`, 수산화 나트륨 → `ㅅㅅㅎ ㄴㅌㄹ`).
- "높아져/낮아져", "큰/작은"처럼 정반대 둘 중 하나를 고르는 빈칸도 `"A / B"` 선택지 대신 **초성**으로 쓴다(예: 높아져 → `ㄴㅇㅈ`). 선택지를 보여주면 둘 중 하나를 찍기만 하면 돼서 생각할 여지가 줄어든다. 숫자 답처럼 초성을 만들 수 없는 경우만 예외(예: `숫자:숫자`).
- 초성 힌트는 정답과 **글자 수·초성이 정확히 일치**해야 한다. 정답을 고치면 placeholder도 같이 고친다(정답은 `얻어`인데 힌트가 `ㅇㄷ`로 남아 있던 사례가 있었다).
- "명칭을 써봐요"처럼 힌트 없는 안내 문구나 빈 placeholder는 쓰지 않는다.
- 숫자 자체를 빈칸으로 만들지 않는다(암기 포인트가 아닌 단순 숫자는 그대로 텍스트로 둔다). 대신 개념어(용어)를 빈칸으로 만든다.

### 채점 시스템 (모든 보고서 공통)

1. **실시간 표시** — 입력하는 즉시(input 이벤트) 정답과 비교해서 맞으면 초록(`.correct`), 틀리면 빨강(`.invalid`)으로 바로 표시한다. 띄어쓰기 차이는 무시하고 채점(`norm()` 함수로 공백 제거 후 비교).
2. **"빈칸 확인하기" 버튼** — 버튼 글자는 항상 "빈칸 확인하기"다("채점하기", "정답 확인하기"로 쓰지 않는다). 전체를 한 번에 채점. 다 맞으면 **그 탭 안에 보이는 전용 안내창**에 "모두 정답이에요!" 표시(⚠️ 06 탭에 있는 `#msg`를 재사용하면 다른 탭에서는 안 보인다 — 반드시 해당 탭 전용 note 요소를 따로 둘 것, id 예: `theory-note`).
3. **오답 시 2회까지 재시도** — 1회차는 "OO개 틀렸어요, 다시 확인해 보세요"만 팝업으로 안내(정답 비공개). 2회차에도 틀리면 **정답을 팝업으로 공개**하고 통과 처리한다(`theoryPassed = true`). 통과한 단계는 PDF 저장 시 체크리스트(7장)에서 완료로 인정된다.
4. **팝업에는 틀린 것만** — 전체 문항을 다 나열하지 않는다. 또한 `id.toUpperCase()`(예: "B12") 같은 내부 코드를 그대로 보여주지 말고, **그 빈칸이 뭘 묻는지 짧은 설명**으로 바꿔서 보여준다 (`BLANK_LABELS` 매핑 객체 사용).
5. **정답 공개 후 재입력 유도(콜백)** — 2회차 팝업을 닫는 **순간**, 틀렸던 칸을 비우고 빨간 테두리도 지운다. 학생이 정답을 눈으로 본 뒤 손으로 다시 입력하게 만드는 게 목적(그냥 읽고 넘어가는 것보다 기억에 남는다). 이미 통과 처리는 됐으므로 다시 안 채워도 PDF 저장은 막히지 않는다 — 강제가 아니라 유도.
6. **`stepValid()`는 "채워졌는지"가 아니라 "통과했는지"만 본다** — `stepValid()`는 PDF 저장 시 `showChecklist()`(7장)가 단계별 완료 여부를 판단할 때 쓴다. 정답 공개 후 칸을 비우면 `required` 조건 때문에 오히려 저장이 막히는 버그가 생기므로, 이론적 배경 단계는 `theoryPassed` 플래그 하나로만 판단한다.
   ```js
   const stepValid = n => {
     if (n === 3) return theoryPassed;   // 이론적 배경 단계
     return [...secOf(n).querySelectorAll('[required]')].every(isFilled);
   };
   ```

### 재사용 가능한 표준 코드

**HTML** — 채점 버튼 + 탭 전용 안내창 + 모달(파일마다 1개만 두면 됨, 여러 채점 구간이 있어도 공유 가능):
```html
<button class="btn" type="button" id="check-theory" style="margin-top:.6rem">빈칸 확인하기</button>
<div id="theory-note" class="note"></div>

<div class="modal-overlay" id="answerModal" style="display:none">
  <div class="modal-box">
    <h3 id="answerModalTitle">정답 안내</h3>
    <p class="hint" style="margin-top:-.3rem" id="answerModalHint"></p>
    <div id="answerModalBody" class="r-txt"></div>
    <button class="btn solid" type="button" id="closeAnswerModal" style="margin-top:1.2rem">확인했어요</button>
  </div>
</div>
```

**CSS**:
```css
.modal-overlay{position:fixed;inset:0;background:rgba(6,8,11,.72);
  display:flex;align-items:center;justify-content:center;z-index:100;padding:1.5rem}
.modal-box{background:var(--surface);border:1px solid var(--line);border-radius:16px;
  padding:1.8rem;max-width:440px;width:100%;max-height:82vh;overflow-y:auto;
  box-shadow:0 20px 50px rgba(0,0,0,.4)}
.modal-box h3{font-size:1.15rem;font-weight:800;color:var(--sea);margin-bottom:.3rem}
.modal-box .r-txt{white-space:pre-wrap;color:var(--body);line-height:1.9}
```

**JS** — `showAnswerModal(title, hint, wrong, revealAnswer, onClose)`는 파일 안에 여러 채점 구간이 있어도(예: 심층순환의 이론적 배경 + T-S도 연습) **하나만 만들어 공유**한다:
```js
const norm = s => (s || '').replace(/\s+/g, '');
const THEORY_ANSWERS = { b1:'정답1', b2:'정답2', /* ... */ };
const BLANK_LABELS = { b1:'이 빈칸이 뭘 묻는지 한 줄 설명', b2:'...' };
let theoryAttempts = 0;
let theoryPassed = false;
let answerModalCb = null;

const showAnswerModal = (title, hint, wrong, revealAnswer, onClose) => {
  $('answerModalTitle').textContent = title;
  $('answerModalHint').textContent = hint;
  $('answerModalBody').innerHTML = wrong
    .map(r => {
      const label = BLANK_LABELS[r.id] || `${r.id.toUpperCase()}번 칸`;
      return revealAnswer ? `${label} — 정답: ${r.answer}` : label;
    })
    .join('<br>');
  $('answerModal').style.display = 'flex';
  answerModalCb = onClose || null;
};
const closeAnswerModal = () => {
  $('answerModal').style.display = 'none';
  if (answerModalCb) { const cb = answerModalCb; answerModalCb = null; cb(); }
};
$('closeAnswerModal').addEventListener('click', closeAnswerModal);

const checkTheory = () => {
  const results = Object.entries(THEORY_ANSWERS).map(([id, answer]) => {
    const el = $(id);
    const ok = norm(el.value) === norm(answer);
    el.classList.toggle('correct', ok);
    el.classList.toggle('invalid', !ok);
    return { id, answer, ok };
  });
  const wrong = results.filter(r => !r.ok);

  if (wrong.length === 0) {
    theoryPassed = true;
    const note = $('theory-note');
    note.textContent = '모두 정답이에요!';
    note.className = 'note ok';
    return;
  }
  $('theory-note').className = 'note';
  theoryAttempts++;
  if (theoryAttempts >= 2) {
    theoryPassed = true;
    showAnswerModal(
      '정답 안내',
      '틀린 칸의 정답이에요. 팝업을 닫으면 틀린 칸이 비워지니, 직접 다시 입력해 보세요.',
      wrong, true,
      () => { wrong.forEach(r => { $(r.id).classList.remove('invalid', 'correct'); $(r.id).value = ''; }); $(wrong[0].id).focus(); save(); }
    );
  } else {
    showAnswerModal('다시 확인해 보세요', `빨갛게 표시된 칸 중 ${wrong.length}개가 틀렸어요. 다시 한번 확인해 보세요. (${theoryAttempts}/2회)`, wrong, false);
  }
};
$('check-theory').addEventListener('click', checkTheory);  // 버튼 id는 자유, 텍스트는 항상 "빈칸 확인하기"
```

전역 `input` 리스너에 아래를 추가하면 실시간 표시가 된다(기존 `.invalid`/`.correct` 초기화 로직 바로 뒤에):
```js
if (THEORY_ANSWERS[e.target.id] !== undefined) {
  const val = e.target.value.trim();
  if (val) {
    const ok = norm(val) === norm(THEORY_ANSWERS[e.target.id]);
    e.target.classList.toggle('correct', ok);
    e.target.classList.toggle('invalid', !ok);
  }
}
```

**숫자 오차범위 채점(예: 심층순환 T-S도 연습)도 같은 `showAnswerModal`을 그대로 재사용할 수 있다** — `wrong` 배열의 각 항목에 `{ id, label, answerText }`를 넣고 정확히 일치하는 대신 `Math.abs(mine - actual) <= 허용오차`로 `ok` 판정만 다르게 하면 된다. 심층순환 파일의 `checkPractice` 함수 참고.



## 7. 탭 이동 — 완전 자유 이동 + PDF 저장 시에만 체크리스트 (2026-08 말 최종)

탭 클릭, "다음" 버튼, 보고서 탭 클릭 **전부 검증 없이 항상 이동**한다. 학생은 순서와 상관없이 원하는 곳부터 채울 수 있고, 미완성 상태에서 보고서 탭에 들어가면 `buildReport()`가 빈 칸을 "(미입력)"으로 표시한 미리보기를 보여준다. **검증은 오직 "PDF로 저장" 버튼(`exportPDF`)을 누를 때만** `showChecklist()`로 한 번에 이루어진다.

```js
const goTo = n => { step = Math.min(TOTAL, Math.max(1, n)); render(); };  // 검증 없음, 항상 이동

document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => goTo(+t.dataset.step)));
$('next').addEventListener('click', () => goTo(step + 1));
$('prev').addEventListener('click', () => goTo(step - 1));

/* PDF 저장 직전 — 안 끝난 항목을 한 번에 모아서 팝업으로 보여준다 */
const showChecklist = () => {
  const incomplete = [];
  for (let n = 1; n < TOTAL; n++) { if (!stepValid(n)) incomplete.push(MSG[n]); }
  if (incomplete.length === 0) return true;
  $('answerModalTitle').textContent = '아직 안 끝난 게 있어요';
  $('answerModalHint').textContent = 'PDF로 저장하기 전에 아래 항목을 마저 채워 주세요.';
  $('answerModalBody').innerHTML = incomplete.map(m => `• ${m}`).join('<br><br>');
  $('answerModal').style.display = 'flex';  // 파일에 따라 .classList.add('show') 방식일 수도 있음 — 그 파일의 기존 방식을 따를 것
  return false;
};

const exportPDF = async () => {
  if (!showChecklist()) return;   // 검증은 여기 한 곳에서만
  buildReport(); hideMsg();
  // ...이후 9장의 PDF 저장 로직
};
```

- `showChecklist()`는 **6장의 `showAnswerModal`용 모달을 그대로 재사용**한다(새 모달을 만들 필요 없음). 다만 모달을 여는 방식이 `style.display='flex'`인지 `.classList.add('show')`인지는 파일마다 다르므로, 그 파일에서 쓰던 방식을 따른다.
- **⚠️ 모달은 반드시 `.step` 섹션 바깥(`.sheet`가 끝난 직후, `<script>` 시작 전)에 둔다 — 매우 중요.** `.step{display:none}`이라, 모달을 실수로 특정 단계 안에 넣으면 JS가 `display:flex`를 정확히 적용해도 **부모가 숨겨져 있어 화면엔 안 보인다.** "그 단계에 있을 때만 우연히 보이고, 다른 탭에서 저장 버튼을 누르면 아무 반응이 없는" 증상으로 나타나 원인 찾기가 까다롭다(실제로 여러 파일에서 발생했던 버그).
  ```html
  </footer>
  </div><!-- sheet -->

  <div class="modal-overlay" id="answerModal" style="display:none">...</div>  <!-- .step 밖, body 직속 -->

  <script>
  ```
- **시뮬레이션 내부의 순차적 제약은 그대로 유지한다.** "반응이 끝나야 기록 버튼이 활성화된다" 같은 건 탭 이동과 다른 층위라서 건드리지 않는다. 자유롭게 이동할 수 있는 건 "탭 사이"이고, 한 탭 안의 실험 조작 순서는 각 시뮬레이션 로직이 책임진다.
- **폐기된 옛 방식 — 발견하면 정리할 것.** 예전에는 "다음"·탭을 누를 때마다 "⚗️ 잠깐!" 팝업으로 막았고, 그 뒤에는 보고서 탭 진입 시에만 막았다. 둘 다 더 이상 쓰지 않는다. `markInvalid`, `flash`, 탭별 블로킹 로직, "탭 5번 클릭하면 통과" 같은 우회 코드, 탭·"다음" 버튼에 걸린 `showChecklist()` 호출은 모두 죽은 코드다.

---

## 8. 보고서(마지막 탭) 구조

### 번호 체계
```
1. 이론적 배경(또는 개념 확인)
   가. ...
   나. ...
2. OO 관찰 / 실험 결과
   가. ...
   나. ...
3. 자료 해석 / 조사하기 (선택)
```
- 대분류는 아라비아 숫자(`1.` `2.`), 소분류는 가나다.
- 탭 이름과 보고서 라벨 이름은 **반드시 일치**시킨다(예: 03탭이 "개념 확인"이면 보고서도 "1. 개념 확인").

### 문단 매달림 들여쓰기
가/나/다 문단이 줄바꿈될 때 둘째 줄이 "가." 밑이 아니라 본문 텍스트 시작 위치에 맞춰지도록:
```css
.r-hang{padding-left:1.6em;text-indent:-1.6em}
```
문단마다 별도의 `<p class="r-hang">`로 렌더링해야 한다(하나의 텍스트 블록에 `\n`만 넣는 방식으로는 안 됨).

### 관찰 항목 그리드
- 항목 수가 **고정**되어 있으면(예: 3개) `grid-template-columns:repeat(3,1fr)`로 이름행/사진행/설명행이 정렬되는 진짜 그리드를 쓸 수 있다.
- 항목 수가 **가변**이거나 늘어날 수 있으면(추가 입력 등) `repeat(auto-fit, minmax(200px,1fr))`처럼 반응형으로 짜야 한다 — 고정 열 개수(N개)로 강제하면 항목이 늘어났을 때 칸이 좁아져 글자가 세로로 쪼개지는 버그가 생긴다.
- 사진+설명은 "사진(고정 크기 110×88px, 왼쪽) + 설명(나머지 공간, 오른쪽)"으로 나란히 배치하는 게 기본형이다. 사진을 `width:100%`로 늘리면 열 너비에 따라 사진이 넙적하게 늘어나 보이므로 피한다.

### 정보 요약 표(r-info)
일시/장소/준비물/목표 등은 `<table class="r-info">`로, 라벨 칸에 회색 배경을 준다.

---

## 9. PDF 저장 — 여백 버그 회피 (매우 중요)

`html2pdf.js`(html2canvas + jsPDF 조합) 특성상 아래 두 가지를 반드시 지켜야 여러 페이지짜리 PDF에서 여백이 깨지지 않는다.

1. **`#report` 자체 CSS 패딩과 `html2pdf`의 `margin` 옵션을 동시에 쓰지 않는다.** 화면에서는 `#report`가 padding(20mm 16mm)을 갖고 있어야 하지만(그래야 06 탭 미리보기가 예쁘다), PDF로 캡처하는 그 순간에만 JS로 위/아래 패딩을 0으로 내리고 `margin` 옵션으로 대체한다. 캡처가 끝나면 즉시 원래대로 복구한다(화면은 항상 그대로 보이게).
   ```js
   const reportEl = $('report');
   reportEl.style.paddingTop = '0';
   reportEl.style.paddingBottom = '0';
   // html2pdf 실행은 try 안에서, 복구는 finally에서 실행
   reportEl.style.paddingTop = '';
   reportEl.style.paddingBottom = '';
   ```
   좌우 패딩은 그대로 둬도 된다(페이지가 세로로만 나뉘기 때문에 좌우는 문제가 안 생긴다).

2. **`page-break-inside:avoid`를 표(`<table>`)나 큰 그리드에 걸어두지 않는다.** 이 속성이 걸린 요소가 페이지 경계에 살짝 걸치면, `html2pdf`가 그 요소를 다음 페이지로 밀어내려고 **실제로 빈 `<div>`를 앞에 삽입**하는데, 이게 페이지 위쪽에 큰 여백으로 나타나는 버그의 원인이다. `avoid`는 사진 2장짜리 작은 블록처럼 확실히 작은 요소에만 쓰고, 정보표나 관찰 그리드처럼 커질 수 있는 요소에는 쓰지 않는다. (단, 자유 서술형 텍스트처럼 길이를 `maxlength`로 캡핑해서 "확실히 작다"고 보장할 수 있으면 얘기가 다르다 — 4번 항목 참고.)

3. **캡처 전에 이미지 로딩을 기다린다.** 사진이 여러 장이면 `html2canvas`가 캡처를 시작하는 시점에 이미지 디코딩이 덜 끝나 있을 수 있어 레이아웃이 어긋날 수 있다.
   ```js
   const waitForImages = async root => {
     const imgs = [...root.querySelectorAll('img')].filter(img => img.src);
     await Promise.all(imgs.map(img =>
       img.complete && img.naturalWidth > 0 ? Promise.resolve()
       : (img.decode ? img.decode().catch(() => {}) : new Promise(res => { img.onload = res; img.onerror = res; }))
     ));
   };
   // exportPDF를 async 함수로 만들고 html2pdf() 호출 전에 await waitForImages(reportEl);
   ```

4. **자유 서술형 칸(까닭 설명, 우리 생활 속 예, 더 생각해보기 등)은 4중으로 안전장치를 건다.** 학생이 스페이스 없이 아주 긴 문자열을 치거나(장난이든 실수든), 붙여넣기로 긴 텍스트를 넣으면 PDF 페이지 경계에서 줄이 잘리거나 사라지거나 이상한 선이 생기는 버그가 난다. 이거 하나 때문에 정말 여러 번 고생했다 — 아래 네 가지를 **전부** 같이 적용해야 확실하다. 하나라도 빠지면 재발한다.

   **① `maxlength` — 애초에 너무 길게 못 치게.** 서술형 칸마다 합리적인 길이(짧은 소감 200자, 설명형 400자 등)를 정하고 `<textarea maxlength="200">`처럼 건다. 글자 수 카운터도 같이 달아주면 좋다.
   ```html
   <textarea id="reflect" maxlength="200" ...></textarea>
   <div style="text-align:right;font-size:.78rem;color:var(--faint)"><span id="reflectCount">0</span> / 200</div>
   ```
   ```js
   document.addEventListener('input', e => {
     if (e.target.id === 'reflect') $('reflectCount').textContent = e.target.value.length;
   });
   ```

   **② `word-break:break-all` — CSS만으로 강제 줄바꿈.** `#report`에 걸어둔 `overflow-wrap:break-word`(위 참고)만으로는 부족하다. 서술형 텍스트가 들어가는 `.r-txt` 같은 클래스에 **직접** `word-break:break-all`을 추가로 건다.
   ```css
   #report .r-txt{white-space:pre-wrap; ...; overflow-wrap:break-word; word-break:break-all}
   ```

   **③ `breakLongWords()` — CSS도 못 믿을 때를 위한 최후 보루.** `html2canvas`는 `word-break:break-all`을 완벽히 지키지 못할 때가 있다(특히 캡처 시점의 텍스트 측정 로직 한계로). CSS에만 기대지 말고, **텍스트 자체에 실제 줄바꿈 지점(zero-width space)을 미리 심어서** 어떤 렌더러에서도 확실히 끊기게 한다. 정상적인 문장(공백 있는 일반 텍스트)은 건드리지 않는다.
   ```js
   const breakLongWords = (str, maxLen = 15) =>
     str.replace(new RegExp(`\\S{${maxLen},}`, 'g'), s => s.replace(new RegExp(`(.{${maxLen}})`, 'g'), '$1\u200B'));
   // 보고서에 값을 넣는 v() 헬퍼 안에서 항상 감싸준다
   const v = id => breakLongWords(($(id).value || '').trim());
   ```

   **④ `restore()`/`loadState()`도 `maxLength`를 지키게 한다 — 잊기 쉬운 포인트.** `maxlength` 속성은 사람이 **타이핑/붙여넣기**할 때만 막는다. `localStorage`에서 예전(제한 걸기 전)에 저장해둔 초과 길이 데이터를 불러올 때는 이 제한을 무시하고 그대로 채워버린다. 그래서 `restore()`가 값을 채울 때 반드시 `maxLength`를 직접 확인해서 잘라내야, 이미 저장된 예전 데이터까지 안전해진다.
   ```js
   else if (v) el.value = el.maxLength > 0 ? v.slice(0, el.maxLength) : v;
   ```

   **길이가 보장됐으면 `avoid`를 다시 써도 된다.** 위 2번 규칙("avoid는 커질 수 있는 요소에 쓰지 않는다")과 모순돼 보이지만, ①로 길이를 캡핑했다면 그 요소는 이제 **확실히 한 페이지 안에 들어가는 게 보장**된 것이므로, 그 요소 하나에만(전체 `.r-txt`가 아니라 **그 id 하나만**) `page-break-inside:avoid`를 걸어도 안전하다 — 오히려 이게 있어야 페이지 경계에서 줄 중간이 안 잘린다.
   ```css
   #report #rep_reason, #report #rep_conclusion{page-break-inside:avoid;break-inside:avoid}
   ```
   즉 **"이 요소가 얼마나 커질 수 있는지"가 avoid를 써도 되는지의 기준**이다 — 무조건 쓰지 마라/써라가 아니다.

5. **특정 섹션을 항상 새 페이지에서 시작하게 하려면** `page-break-before:always`를 쓰되, 남발하지 않는다. 소단원(가/나/다)마다 강제로 페이지를 나누면 오히려 페이지마다 빈 공간이 많이 남는 역효과가 난다 — 큰 구획(예: "2. 관찰" 전체) 앞에만 걸고, 그 안의 소단원들은 자연스럽게 흐르도록 둔다("Enter"처럼, "Ctrl+Enter"처럼 강제로 끊지 않는다).
   ```css
   .r-pagebreak{page-break-before:always;break-before:page}
   ```

6. **html2pdf 옵션 고정값**:
   ```js
   html2pdf().set({
     margin: [20, 0, 20, 0],   // 좌우는 CSS가 담당하므로 0
     image: { type:'jpeg', quality:.95 },
     html2canvas: { scale:2, useCORS:true, backgroundColor:'#ffffff' },
     jsPDF: { unit:'mm', format:'a4', orientation:'portrait' },
     pagebreak: { mode:['css'] },   // 'legacy' 모드는 margin과 충돌하므로 쓰지 않는다
   }).from(reportEl).save()
   ```

---

## 10. 저장 · 검증 공통 로직

- `localStorage` 키는 보고서마다 다른 prefix(`KEY = 'deepcirc_'` 등)를 써서 서로 안 섞이게 한다. 같은 실험을 두 탭용으로 파일 두 개를 둔 경우에도 키를 다르게 한다(15장 체크리스트 참고).
- 사진은 `photos` 객체(또는 개별 변수)에 base64로 저장, `class="save"`가 붙은 일반 입력값과 별도로 저장/복원한다.
- 동적으로 추가되는 관찰 행도 자동 저장한다. 행 목록·이름·내용은 `extra_rows`에, 사진은 `extra_photo_<행 ID>`에 따로 저장한다. 글을 먼저 저장하고 행 ID를 유지해 삭제·새로고침 후에도 사진이 다른 표본에 연결되지 않게 한다. 초기화할 때 관련 키도 정리한다.
- 필수 입력 검증은 `[required]` 속성 + `isFilled()` 제네릭 함수로 처리하고, 탭별 예외(채점 통과 필요 등)만 `stepValid()`에서 개별 분기한다.
- **탭 이동 자체는 검증하지 않는다** — 검증은 오직 "PDF로 저장" 버튼을 누를 때(7장 `showChecklist()`)만 한 번에 이루어진다. `.invalid` 클래스로 안 채워진 칸을 시각 표시하는 것 자체는 그대로 쓰되, 그걸 이유로 탭 이동을 막지는 않는다.

---

### 공통 부가기능 — 진행 배지 · 저장 공간 경고 · PDF 저장 후 사진 정리

모든 보고서에 `/* ===== 공통 저장 안내 · 진행 상태 · PDF 처리 ... */` 코드가 들어 있다. 일반 보고서는 `DOMContentLoaded` 안쪽의 `KEY` 선언 다음, 중화 반응은 `STORE_KEY` 다음에 둔다. `sjPrefix`는 저장 키와 같아야 하며 `sjTotal()`은 보고서 탭을 제외한 단계 수를 반환한다. 초기화 코드를 마친 뒤 `sjInit()`을 한 번 호출한다. 새 보고서에서는 이 코드와 `.sj-toast` 스타일을 함께 복사한다.

- **진행 상태 기록**: 입력·클릭이 있을 때마다(0.6초 지연, 알림 닫기는 제외) `sjstatus:<보고서 경로>` 키에 `{ done, total, updated, pdf }`를 기록한다. 경로는 `reports/earth-science/geology/igneous-rocks`처럼 `reports/`부터 폴더까지이고, 허브가 같은 규칙으로 읽어서 카드에 "작성 중 · 2/5단계" 또는 "✓ PDF 저장 완료" 배지를 띄운다. `done`은 보고서 탭을 뺀 단계 중 `stepValid()`가 참인 단계 수다. 아직 아무것도 입력하지 않은 보고서는 배지가 없고, 전체 초기화 후 다시 열면 배지도 지워진다. 입력·실험 조작 후에는 완료 배지가 작성 중으로 바뀐다. 중화 반응의 ‘새 실험’은 실험 데이터만 초기화한다.
- **저장 공간 경고**: `save()`의 `catch`에서 `sjStorageFull()`을 부른다. 화면 아래쪽에 고정된 경고(토스트)가 떠서 어느 탭에 있든 보인다. 보고서 탭의 `#msg`(`showMsg`)로 경고하면 사진을 올리는 탭에서는 안 보이므로 쓰지 않는다.
- **PDF 저장 후 사진 정리**: 공통 `sjExportPDF()`가 `await html2pdf().set(...).from(...).save()`의 성공 이후에만 `sjAfterPdf()`를 부른다. 이 보고서 키(`KEY`로 시작) 중 값이 `data:image`인 것만 지우고, 글 입력값은 남긴다. 사진은 PDF에 이미 들어갔으므로 기기에 남길 필요가 없고, 한 학생이 여러 보고서를 쓰는 동안 사진이 쌓여 저장 공간(약 5MB, 사이트 전체가 공유)을 넘는 걸 막는다. 화면의 사진은 그대로라서 PDF를 다시 저장할 수 있고, 이후에 더 고치면 다시 자동 저장된다. 사진을 정리했다는 표식을 남기고, 페이지를 다시 열면 사진 재업로드 안내를 표시한다. 저장 도구의 완료 응답은 실제 기기에 파일이 보관됐음을 확인하는 검증은 아니므로, 학생에게 내려받은 파일 확인을 안내한다.

---

## 11. 버튼 · 알림 스타일

```css
.btn{border-radius:999px;border:1.5px solid #39404b;background:var(--surface);color:var(--ink)}
.btn.solid{background:var(--sea);color:#0c0e12}         /* 주요 액션(PDF 저장, 빈칸 확인하기) */
.btn.quiet{border-color:transparent;color:var(--faint)}  /* 보조 액션(삭제, 초기화) */
.note.ok{background:var(--sea-soft);border-left:3px solid var(--sea)}
.note.err{background:rgba(224,106,91,.12);border-left:3px solid var(--coral)}
```

- 알림(note)은 **해당 탭 안에 있는 전용 요소**를 써야 한다. 다른 탭에 있는 공용 `#msg`를 재사용하면 사용자에게 안 보이는 버그가 난다(6장 참고).

---

## 12. Footer (모든 파일 공통, 빠뜨리기 쉬움)

`.bar`(이전/다음/초기화) 바로 다음, `</div><!-- sheet -->` 직전에 항상 넣는다. 저작권 문구는 **정중앙**, 유튜브·Linktree 배지는 **오른쪽**.

```html
<footer class="site-footer">
  <div class="site-footer-top">
    <p class="site-footer-copy">© 교사 이상준. All rights reserved.<br>오류제보/문의: cepheid@kakao.com</p>
    <div class="site-footer-links">
      <a class="yt-badge" href="https://www.youtube.com/@science_earth" target="_blank" rel="noopener">
        <span class="play"></span> 유튜브
      </a>
      <a class="yt-badge" href="https://linktr.ee/earth_sj" target="_blank" rel="noopener">
        <span class="badge-icon">🌍</span> Linktree
      </a>
    </div>
  </div>
</footer>
```

```css
.site-footer{padding:1.4rem 2.6rem 1.8rem;background:var(--paper);border-top:1px solid var(--line)}
.site-footer-top{position:relative;display:flex;align-items:center;justify-content:flex-end;
  min-height:2.4rem}
.site-footer-copy{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  margin:0;font-size:12px;color:var(--faint);line-height:1.5;text-align:center;white-space:nowrap}
.site-footer-links{display:flex;align-items:center;gap:.6rem}
@media(max-width:640px){
  .site-footer-top{position:static;flex-direction:column-reverse;align-items:center;gap:.8rem}
  .site-footer-copy{position:static;transform:none;white-space:normal}
}
.yt-badge{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem .5rem .7rem;
  background:var(--surface);border:1.5px solid var(--line);border-radius:999px;
  color:var(--ink);text-decoration:none;font-weight:700;font-size:.8rem;
  transition:border-color .15s,transform .1s}
.yt-badge:hover{border-color:var(--sea);transform:translateY(-1px)}
.yt-badge .play{display:inline-flex;align-items:center;justify-content:center;
  width:18px;height:18px;border-radius:5px;background:var(--sea);flex:none}
.yt-badge .play::before{content:"";width:0;height:0;margin-left:2px;
  border-style:solid;border-width:4px 0 4px 7px;border-color:transparent transparent transparent #0c0e12}
.yt-badge .badge-icon{font-size:.85rem;line-height:1}
```

**정중앙 정렬 팁(중요)**: `.site-footer`의 `padding`은 반드시 **바깥(footer 자체)**에 준다. `.site-footer-top`(배지·문구를 담는 flex 박스) 안쪽에 padding을 넣으면, `top:50%`로 절대위치 정렬되는 저작권 문구의 기준점이 그 padding만큼 밀려서 배지랑 높이가 안 맞게 된다(실제로 이 버그 때문에 여러 번 고생했다). `.site-footer-top`은 배지 높이(약 40px)만큼의 순수한 콘텐츠 박스여야 한다.

---

## 13. 04 탭(실험하기/탐구) — 활동 유형별 구조

04 탭 내부 구조는 활동 유형에 따라 다르게 짠다. 새 보고서를 만들 때 먼저 어느 유형인지 정하고 시작한다.

**(A) 반응·결과가 정해진 실험** — 같은 조작을 하면 누구나 같은 결과가 나오는 실험(산화·환원, 중화 반응, 이온의 이동 등). 정답이 있으므로 6장의 채점 시스템을 결과 기록 칸에도 적용할 수 있고, 실제 실험을 대신하거나 보조하는 드래그 시뮬레이션을 넣을 수 있다(14장 규칙 적용). 예: `copper-oxidation.html`, `zinc-copper-reaction.html`, `ion-movement.html`.

**(B) 실측 데이터 조사형** — 외부 사이트에 접속해 실제 관측값을 찾아 기록하는 활동(ARGO 자료 비교 등). 학생마다 고르는 지점·시기에 따라 값이 달라 정답이 없으므로 **채점을 걸지 않고 필수 입력 여부만 확인**한다. 외부 링크 버튼 + 지점별 데이터·사진 입력 구조를 쓴다. 예: `argo-seawater-comparison.html`.

관찰형 활동(암석·화석 관찰처럼 사진을 찍고 특징을 적는 활동)은 (B)에 가깝게 다룬다 — 관찰 결과 자체는 채점하지 않고, 개념 확인용 빈칸(03 탭)에만 채점을 건다. 예: `igneous-rocks-index.html`, `geo-eras-expo-index.html`.

한 파일 안에 두 성격이 섞일 수 있다(예: 심층 순환은 실험 측정값 입력 + T-S도 해석 연습 채점). 이때는 칸 하나하나를 "정답이 정해져 있는가"로 판단해서 채점 여부를 정한다.

---

## 14. 인터랙티브 시뮬레이션 (SVG 드래그)

- 드래그로 움직이는 요소(시험관, 전극, 핀셋 등)는 div + CSS transform이 아니라 **SVG 좌표계 안에서 속성 기반 `transform`**으로 만든다. 화면 크기가 바뀌어도 `viewBox` 기준으로 위치가 유지되고, 포인터 좌표는 `getScreenCTM().inverse()`로 SVG 좌표로 변환해서 쓴다.
- 회전 중심이 되어야 할 지점(시험관을 기울이는 손잡이 등)을 그 요소 좌표계의 **원점 (0,0)**에 오도록 그린다. 그래야 `rotate(각도)`만으로 원하는 지점을 축으로 돈다.
- `<defs>`(그라데이션 등)에는 상태와 무관한 것만 공용으로 둔다. 반응에 따라 바뀌는 색(용액 색 변화 등)은 해당 씬 안에 로컬로 둔다 — 공용 그라데이션을 바꾸면 다른 씬까지 같이 바뀐다.
- 실험 결과를 보고서에 이미지로 넣어야 하면, 화면을 통째로 캡처하지 말고 결과 상태(색 변화 등)를 작은 `<canvas>`에 직접 그려서 넣는다. html2canvas로 SVG를 캡처하는 것보다 훨씬 안정적이다.
- 시뮬레이션 안의 순서 제약("반응이 끝나야 기록 가능")은 시뮬레이션이 스스로 관리한다(7장 참고 — 탭 이동 규칙과는 별개).

---

## 15. 체크리스트 (새 보고서 만들 때)

- [ ] 제목·kicker 규칙(2장) — `<h1>`, `<title>`, 보고서 `<h2>`, 허브 `name` 네 곳 일치, kicker 하위분류 이름은 허브와 동일
- [ ] `:root`에 `color-scheme:dark;`, `--sea`는 1장 색상 표(=허브 `SUB_META`)대로
- [ ] 01 정보입력 표 형식, 예시 placeholder는 학번/이름/장소에 넣지 않기, 반 입력에 정규식 필터 없음
- [ ] 목표·준비물 JS 상수로 고정
- [ ] 사진 업로드에 `capture` 속성 없음, `object-fit:contain`, 긴 변 900px · JPEG 75%
- [ ] 이론적 배경·개념 확인 빈칸마다 초성 힌트(양자택일 빈칸 포함), 정답과 초성 일치
- [ ] 빈칸에 실시간 채점 + "빈칸 확인하기" 2회 재시도 + 팝업(틀린 것만, 사람이 읽을 수 있는 라벨) + 정답 공개 후 재입력 유도
- [ ] 04 탭 활동 유형 (A)/(B) 판단(13장), 시뮬레이션이 있으면 14장 규칙
- [ ] 탭·"다음"·보고서 탭 전부 자유 이동(검증 없음), "PDF로 저장" 버튼에서만 `showChecklist()` (7장)
- [ ] 모달(`answerModal` 등)이 `.step` 섹션 밖(body 직속)에 있는지 확인 (7장)
- [ ] 보고서 번호(1./2.) + 가나다, 탭 이름과 보고서 라벨 이름 일치
- [ ] 문단 매달림 들여쓰기 적용
- [ ] PDF 여백 트릭(패딩 토글 + margin 옵션 + avoid 최소화 + 사진이 있으면 waitForImages) 적용
- [ ] 자유 서술형 칸마다 4중 안전장치(maxlength+카운터 / word-break:break-all / breakLongWords / restore() maxLength 적용) — 길이 캡핑됐으면 그 필드 하나에만 avoid 추가
- [ ] 공통 부가기능(10장)과 토스트 스타일 포함, `save()` catch에 `sjStorageFull()`, 정상 저장 후 `sjStorageSaved()`, PDF는 `sjExportPDF()`로 처리, 전체 초기화에 `sjClearStatus()` 호출
- [ ] localStorage 키 prefix 고유하게 설정 — **같은 실험을 두 탭에 따로 두는 경우에도 키를 다르게**(GitHub Pages에서는 모든 파일이 같은 도메인이라 키가 같으면 저장 내용이 섞인다. 예: `geofair_` / `geofairint_`). 한 키가 다른 키의 앞부분이 되지 않게 할 것(`geofair_`와 `geofair_int_`처럼 겹치면 PDF 저장 후 사진 정리 때 다른 보고서 사진까지 지워진다)
- [ ] 알림(note)은 탭별 전용 요소 사용
- [ ] footer(저작권 정중앙 + 유튜브/Linktree 오른쪽) 삽입, `.site-footer-top`엔 padding 넣지 않기
- [ ] 완성 후 허브(`index.html`)의 `REPORTS` 배열에 등록 + `reports/<탭 폴더>/<하위분류 폴더>/<실험 폴더>/index.html` 경로에 파일 배치 (자세한 폴더 규칙은 README.md 참고)

## 16. 현재 구현에서 보완한 동작

- PDF는 공통 `sjExportPDF()`를 사용한다. 도구 로딩 여부를 확인하고 사진 로딩을 기다린다. 사진 오류·시간 초과·동기 오류·다운로드 Promise 실패는 고정 알림으로 표시한다. `finally`에서 버튼과 캡처 중 바꾼 여백·애니메이션 스타일을 복구한다. 중화 반응의 기존 여백 설정은 유지한다.
- 9장의 이미지 대기 예시는 개념 설명이다. 실제 재사용 코드는 현재 파일의 `sjWaitForImages()`를 따른다. 사진 로딩 실패를 조용히 무시하거나 무한정 기다리지 않는다.
- 고정 알림에는 닫기 버튼이 있으며 저장 실패는 `role="alert"`, 일반 안내는 `role="status"`를 쓴다. 다른 탭 안에 있는 `#msg`로 저장 실패를 알리지 않는다.
- 과거 구리판 파일이 아연·구리 보고서로 바뀌어 있던 문제는 정상 원본으로 복구했다. 두 보고서의 입력값은 별도 저장 키로 관리한다.
- 문서의 예시 코드보다 현재 파일의 오류 처리와 추가 관찰 저장 구현을 우선 참고한다. 초성 힌트·제목·색상 변경 시 허브와 보고서를 함께 확인한다.
- `object-fit:contain`만으로는 PDF 사진 비율이 보장되지 않아, 캡처 직전에 보고서 사진의 표시 영역에 맞춘 이미지를 만든다. 빈 사진 자리는 투명 이미지로 처리한다. 완료·실패 시 모두 원래 이미지 주소를 복구한다.
- 제목과 짧은 본문은 높이를 확인해 작은 묶음으로만 페이지 나눔을 피한다. 보고서 머리의 가로 정렬은 이 처리에서 제외하며, 일반 입력 화면의 구조는 변경하지 않는다. ARGO의 짧은 Plus 항목은 새 페이지를 강제하지 않는다.
