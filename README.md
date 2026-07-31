# SJ 활동 · 실험 보고서 사이트

서버 없이 정적 HTML 파일들로만 동작하는 실험 보고서 모음 사이트. GitHub Pages로 그대로 배포한다.

## 폴더 구조

```
/
├── index.html                                   ← 허브 페이지 (여기서 항목을 클릭하면 각 보고서로 이동)
├── README.md
└── reports/
    ├── earth-science/                            ← 지구과학 탭
    │   ├── atmosphere-ocean/                     ← 하위분류: 대기·해양
    │   │   └── deep-circulation/
    │   │       └── index.html                    ← "심층 순환의 발생 원리 추론하기" 실험 보고서
    │   ├── geology/                               ← 하위분류: 지질
    │   │   ├── igneous-rocks/
    │   │   │   └── index.html                    ← "화성암 관찰하기" 활동 보고서
    │   │   └── sedimentary-rocks/
    │   │       └── index.html                    ← "퇴적암 관찰하기" 활동 보고서
    │   ├── astronomy/                             ← 하위분류: 우주 (아직 없음)
    │   └── fusion/                                 ← 하위분류: 융합 (아직 없음)
    └── integrated-science/                        ← 통합과학·과학탐구실험 탭
        ├── physics/                                ← 하위분류: 물리학 (아직 없음)
        ├── chemistry/                              ← 하위분류: 화학 (아직 없음)
        ├── biology/                                ← 하위분류: 생명과학 (아직 없음)
        └── earth-science/                          ← 하위분류: 지구과학
            └── geo-eras-expo/
                └── index.html                    ← "지질시대 화석 박람회" 활동 보고서
```

**폴더 위치가 곧 분류다.** `reports/<탭 폴더>/<하위분류 폴더>/<보고서 폴더>/index.html` — 이 3단 경로를 보고
허브 페이지가 어느 탭·어느 하위분류에 넣을지 스스로 계산한다. 탭/하위분류 값을 어딘가에 따로 적어 둘 필요가 없다.

> **폴더 이름은 한글 대신 영문·하이픈을 쓴다.** 한글 폴더명은 깃허브에서 인식이 잘 안 될 때가
> 있다 (맥에서 만든 폴더는 유니코드가 분해형(NFD)으로 저장되는데 깃허브·브라우저는 완성형(NFC)을
> 기대해서 링크가 깨지는 경우가 흔하다).

`reports/` 아래는 **탭 폴더 → 하위분류 폴더 → 보고서 폴더 → `index.html`** 4단 구조다.
**어느 폴더에 두느냐가 곧 화면에 뜨는 탭·하위분류를 결정한다** — 루트 `index.html`의 `TAB_FOLDERS`·`SUB_FOLDERS`에
"폴더명 → 화면에 뜨는 이름"이 매핑되어 있고, 보고서의 `url` 경로에서 그 폴더명을 읽어 자동으로 계산한다.
그래서 `REPORTS` 배열에는 탭·하위분류 값을 따로 적지 않아도 된다.

보고서 하나 = 폴더 하나 = `index.html` 파일 하나. 각 보고서 파일은 완전히 독립적으로 동작한다
(다른 파일을 참조하지 않는다).

## GitHub Pages로 배포하기

1. 이 폴더 전체를 GitHub 저장소에 올린다 (레포 이름 아무거나, 예: `sj-lab-reports`).
2. 저장소 **Settings → Pages**로 들어간다.
3. **Source**를 `Deploy from a branch`로, **Branch**를 `main` / `(root)`로 설정하고 저장한다.
4. 몇 분 뒤 `https://<깃허브아이디>.github.io/<저장소이름>/` 주소로 접속되면 끝.
   허브 페이지(`index.html`)가 첫 화면으로 뜨고, 각 카드를 누르면 `reports/.../index.html`로 이동한다.

이후로는 **그냥 이 폴더에 파일을 추가하고 커밋 → 푸시**하면 사이트에 바로 반영된다. 별도 빌드 과정이 없다.

## 각 실험이 어느 영역에 들어가는지 정하는 법 — 폴더 위치로 결정

허브 페이지는 **탭(대분류) → 하위분류** 2단 구조고, 이 둘 다 **`reports/` 다음에 오는 폴더 이름 두 개**로 정해진다.

```
reports/ <탭 폴더>          / <하위분류 폴더>       / <보고서 폴더> / index.html
reports/ earth-science      / geology              / igneous-rocks / index.html
         └ 지구과학 탭        └ 지질 하위분류
```

루트 `index.html`의 `TAB_FOLDERS`·`SUB_FOLDERS`에 등록된 폴더명만 쓰면 된다:

```
탭 폴더               → 화면 탭 이름
earth-science         → 지구과학
integrated-science    → 통합과학·과학탐구실험

하위분류 폴더           → 화면 하위분류 이름
atmosphere-ocean      → 대기·해양     (지구과학 탭 안)
geology               → 지질          (지구과학 탭 안)
astronomy             → 우주          (지구과학 탭 안)
fusion                → 융합          (지구과학 탭 안)
physics               → 물리학        (통합과학 탭 안)
chemistry             → 화학          (통합과학 탭 안)
biology               → 생명과학      (통합과학 탭 안)
earth-science         → 지구과학      (통합과학 탭 안 — 탭 폴더의 earth-science와는 별개)
```

**어느 탭인지 정하는 기준** — "지구과학 선택 수업(2·3학년)에서만 다루는 심화 내용인가, 1학년 통합과학처럼 전체 학생이 배우는 내용인가"로 나누면 된다.
- 지구과학 선택 수업 학생만 듣는 심화 실험/탐구활동 → `earth-science` 탭 폴더
- 통합과학(1학년 공통) 수업이나 과학탐구실험 시간에 쓰는 활동 → `integrated-science` 탭 폴더 (내용이 지구과학 소재라도 여기로 — 예: 지질시대 화석 박람회는 `integrated-science/earth-science/`에 있다)

이 판단이 애매하면 아무 쪽 폴더에나 넣어도 된다 — 나중에 **폴더째로 옮기기만 하면** 분류도 같이 옮겨진다(코드를 따로 고칠 필요 없음).

**같은 실험을 두 탭에 동시에 노출하고 싶으면**(예: 통합과학 수업과 지구과학 수업 둘 다에서 쓰는 실험) — 두 가지 방법이 있다.

**방법 A. 파일을 실제로 두 곳에 둔 경우** (예: `reports/earth-science/geology/geo-eras-expo/`와
`reports/integrated-science/earth-science/geo-eras-expo/`에 각각 파일이 있음) — `REPORTS` 배열에
**각자의 실제 경로**로 항목을 하나씩 만들면 된다. `tab`·`subcategory`는 각 url에서 알아서 계산된다.

```js
{
  name: '지질시대 화석 박람회',
  desc: '지질시대의 대표 표준화석을 관찰하고 정보를 찾아 기록해요',
  emoji: '🦴',
  url: 'reports/earth-science/geology/geo-eras-expo/index.html'
  /* → 지구과학 · 지질 */
},
{
  name: '지질시대 화석 박람회',
  desc: '지질시대의 대표 표준화석을 관찰하고 정보를 찾아 기록해요',
  emoji: '🦴',
  url: 'reports/integrated-science/earth-science/geo-eras-expo/index.html'
  /* → 통합과학·과학탐구실험 · 지구과학 */
}
```

**방법 B. 파일은 한 곳에만 있는 경우** — 파일을 복사해 둘 필요 없이, `REPORTS` 배열에 **같은 `url`로
항목을 하나 더 추가**하고 그 항목에만 `tab`·`subcategory`를 직접 적으면 된다. 직접 적은 값이 폴더에서
자동 계산한 값보다 우선한다.

```js
{
  name: '...',
  url: 'reports/earth-science/geology/폴더명/index.html',
  tab: 'integrated', subcategory: '지구과학'   /* 수동 지정 → 자동 계산 대신 이 값 사용 */
}
```

## 새 실험 보고서 추가하는 법

1. `reports/<탭 폴더>/<하위분류 폴더>/` 안에 새 폴더를 만든다. 폴더 이름은 반드시 영문·하이픈으로
   (예: `reports/earth-science/geology/salinity-density/`).
   탭 폴더·하위분류 폴더가 아직 없다면 위 표의 이름 그대로 새로 만들면 된다(오타 나면 그 카드는 화면에 안 뜬다).
2. 그 안에 보고서 HTML 파일을 넣고 이름을 `index.html`로 한다.
   (기존 보고서 중 구조가 비슷한 걸 복사해서 내용만 바꾸는 게 제일 빠르다 — 표준화석/암석 관찰 활동이면
   `reports/earth-science/geology/igneous-rocks/index.html`을, 수치 입력·그래프가 있는 실험이면
   `reports/earth-science/atmosphere-ocean/deep-circulation/index.html`을 베이스로 쓰면 된다.)
3. 루트의 `index.html`을 열어 `<script>` 안 `REPORTS` 배열에 한 줄 추가한다. **`url`의 폴더 경로만 정확하면
   탭·하위분류는 자동으로 계산되므로 따로 적지 않는다.**

```js
const REPORTS = [
  {
    name: '심층 순환의 발생 원리 추론하기',
    desc: '수온·염분 차이로 밀도류와 심층 순환이 일어나는 원리를 추론해요',
    emoji: '🌊',
    url: 'reports/earth-science/atmosphere-ocean/deep-circulation/index.html'
  },
  {
    name: '화성암 관찰하기 🔎',
    desc: '화성암의 색과 결정 크기를 관찰하고 특징에 따라 분류해요',
    emoji: '🌋',
    url: 'reports/earth-science/geology/igneous-rocks/index.html'
  },
  {
    name: '퇴적암 관찰하기 🔎',
    desc: '퇴적암을 기원·입자 크기·성분에 따라 관찰하고 분류해요',
    emoji: '🪨',
    url: 'reports/earth-science/geology/sedimentary-rocks/index.html'
  },
  {
    name: '지질시대 화석 박람회',
    desc: '지질시대의 대표 표준화석을 관찰하고 정보를 찾아 기록해요',
    emoji: '🦴',
    url: 'reports/integrated-science/earth-science/geo-eras-expo/index.html'
  },
  {
    name: '여기에 새 실험 제목',
    desc: '한두 문장으로 이 실험이 뭘 다루는지 설명',
    emoji: '🧪',
    url: 'reports/integrated-science/chemistry/new-folder-name/index.html'
  }
].map(r => Object.assign(r, deriveMeta(r.url)));
```

4. 커밋하고 푸시하면 끝. 새 카드가 폴더 위치에 맞는 탭·하위분류 아래에 자동으로 나타난다.

> **참고**: git은 빈 폴더를 저장하지 않는다. 새 하위분류 폴더를 만들었는데 아직 보고서가 하나도 없다면,
> 그 폴더가 저장소에서 사라지지 않도록 폴더 안에 `README.md` 같은 파일을 하나 넣어 두자.
> 첫 보고서를 추가하면 그 안내용 파일은 지워도 무방하다.

## 탭·하위분류·색상을 추가/변경하려면

루트 `index.html`의 `TABS` 배열, `SUB_META` 객체, 그리고 폴더명→이름 매핑인
`TAB_FOLDERS`·`SUB_FOLDERS` 객체에서 관리한다.

```js
const SUB_META = {
  '대기·해양': { color: '#6fb3e6', icon: '🌊' },
  '지질':      { color: '#e0913e', icon: '🌋' },
  '우주':      { color: '#7d8cff', icon: '🪐' },
  '융합':      { color: '#2bb6a4', icon: '🔗' },
  '물리학':    { color: '#7d8cff', icon: '⚛️' },
  '화학':      { color: '#ff8a65', icon: '🧪' },
  '생명과학':  { color: '#6fcf97', icon: '🧬' },
  '지구과학':  { color: '#e0913e', icon: '🌍' },
};

const TABS = [
  { id: 'earth',      label: '지구과학',            subs: ['대기·해양', '지질', '우주', '융합'] },
  { id: 'integrated', label: '통합과학·과학탐구실험', subs: ['물리학', '화학', '생명과학', '지구과학'] },
];

const TAB_FOLDERS = {
  'earth-science': 'earth',
  'integrated-science': 'integrated',
};
const SUB_FOLDERS = {
  'atmosphere-ocean': '대기·해양',
  'geology': '지질',
  'astronomy': '우주',
  'fusion': '융합',
  'physics': '물리학',
  'chemistry': '화학',
  'biology': '생명과학',
  'earth-science': '지구과학',
};
```

새 탭/하위분류를 추가하려면 네 군데를 같이 고쳐야 한다:
1. `TABS`에 `{ id: '고유id', label: '화면에 뜰 이름', subs: [...] }` 추가 (또는 기존 탭의 `subs`에 이름 추가)
2. `SUB_META`에 그 하위분류의 색·아이콘 추가
3. `TAB_FOLDERS`(새 탭인 경우) 또는 `SUB_FOLDERS`(새 하위분류인 경우)에 "폴더명 → id/이름" 매핑 추가
4. `reports/` 아래에 그 폴더명으로 실제 폴더를 만든다

- 하위분류에 아직 보고서가 없어도 점선 테두리로 "곧 추가될 실험을 위한 자리예요"가 자동으로 표시된다.
- `SUB_FOLDERS`에 등록 안 된 폴더명을 쓰면 `융합`으로, `TAB_FOLDERS`에 없는 폴더명을 쓰면 첫 번째 탭으로 조용히 분류된다 — 에러는 안 나지만 의도한 곳에 안 나타나니 폴더명은 항상 표와 정확히 맞춰 쓸 것.

## 각 보고서 파일 자체를 재사용하는 법

각 보고서(`reports/*/index.html`)는 이번에 정리해 둔 디자인(다크 배경 + 민트 포인트, Pretendard 폰트),
표 형태 정보입력, 목표·준비물 고정 표시, 자동 저장, 빈칸+정답 확인(맞으면 초록/틀리면 빨강 표시),
사진 업로드(카메라 촬영 또는 갤러리 선택), PDF 저장 구조를 그대로 갖고 있다. 새 실험을 만들 때는

- 정보 입력 탭의 필드 구성(반/학번/이름/일시/장소 등, 실험 성격에 맞게 가감)
- 이론적 배경(또는 개념 확인) 탭의 빈칸 내용과 `THEORY_ANSWERS`(정답)
- 관찰/실험 탭의 항목 구성
- 파일 상단의 `FIXED_GOAL`·`FIXED_MATERIALS`(목표·준비물, 학생이 수정 불가), `DEFAULT_SUBMIT_URL`(제출 링크)

만 그 실험에 맞게 바꾸면, 나머지 구조(저장, 검증, PDF 내보내기 등)는 그대로 재사용할 수 있다.

### 정답 확인 기능 추가하는 법

빈칸(`<input class="blank save" id="b1" ...>`)에 정답 확인 기능을 넣으려면:

```js
const THEORY_ANSWERS = { b1:'정답1', b2:'정답2', /* ... */ };
const norm = s => (s || '').replace(/\s+/g, '');   // 띄어쓰기 차이는 무시하고 채점
const checkTheory = () => {
  const lines = Object.entries(THEORY_ANSWERS).map(([id, answer]) => {
    const el = $(id);
    const mine = el.value;
    const ok = norm(mine) === norm(answer);
    el.classList.toggle('correct', ok);   // 맞으면 초록
    el.classList.toggle('invalid', !ok);  // 틀리면 빨강
    return `${id.toUpperCase()} — 내 답: ${mine || '미입력'} · 정답: ${answer}${ok ? ' ✓' : ''}`;
  });
  $('theory-result').innerHTML = lines.join('<br>');
  $('theory-result').className = 'note ok';
};
```

그리고 해당 탭 안에 버튼과 결과창을 추가하면 된다.

```html
<button class="btn" type="button" id="check-theory">정답 확인하기</button>
<div id="theory-result" class="note"></div>
```

`$('check-theory').addEventListener('click', checkTheory);`로 연결하는 것도 잊지 말 것.
