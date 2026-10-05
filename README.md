# SJ 활동 · 실험 보고서 사이트

서버 없이 정적 HTML 파일들로만 동작하는 실험 보고서 모음 사이트. GitHub Pages로 그대로 배포한다.

## 폴더 구조

```
/
├── index.html                                   ← 허브 페이지 (여기서 항목을 클릭하면 각 보고서로 이동)
├── README.md
├── design-guide.md                             ← 디자인·동작 기준
└── reports/
    ├── earth-science/                            ← 지구과학 탭
    │   ├── atmosphere-ocean/                     ← 하위분류: 대기·해양
    │   │   ├── deep-circulation/                 ← 심층 순환의 발생 원리 추론하기
    │   │   ├── argo-seawater-comparison/         ← ARGO 자료로 해수의 성질 비교하기
    │   │   └── cloud-formation/                  ← 구름 만들기 실험(단열 변화)
    │   ├── geology/                               ← 하위분류: 지질
    │   │   ├── igneous-rocks/                    ← 화성암 관찰하기
    │   │   ├── sedimentary-rocks/                ← 퇴적암 관찰하기
    │   │   └── geo-eras-expo/                    ← 지질시대 화석 박람회 (지구과학 탭 버전, 황토색)
    │   ├── astronomy/                             ← 하위분류: 우주 (아직 없음)
    │   └── fusion/                                 ← 하위분류: 융합 (아직 없음)
    └── integrated-science/                        ← 통합과학·과학탐구실험 탭
        ├── physics/                                ← 하위분류: 물리학 (아직 없음)
        ├── chemistry/                              ← 하위분류: 화학
        │   ├── neutralization-reaction/          ← 중화 반응 - 이온 모형 실험
        │   ├── ion-movement/                     ← 산성과 염기성을 나타내는 이온의 확인
        │   ├── copper-oxidation/                 ← 산화·환원 실험(1) - 구리판의 변화
        │   └── zinc-copper-reaction/             ← 산화·환원 실험(2) - 아연판과 황산 구리(Ⅱ) 수용액의 반응
        ├── biology/                                ← 하위분류: 생명과학 (아직 없음)
        └── earth-science/                          ← 하위분류: 지구과학
            └── geo-eras-expo/                    ← 지질시대 화석 박람회 (통합과학 탭 버전, 민트색)
```

각 보고서 폴더 안에는 `index.html` 하나만 있다(트리에서는 생략).

**폴더 위치가 곧 분류다.** `reports/<탭 폴더>/<하위분류 폴더>/<보고서 폴더>/index.html` — 이 3단 경로를 보고
허브 페이지가 어느 탭·어느 하위분류에 넣을지 스스로 계산한다. 탭/하위분류 값을 어딘가에 따로 적어 둘 필요가 없다.

> **폴더 이름은 영문·하이픈으로 통일한다.** 경로를 등록하거나 이동할 때 철자와 대소문자를 실제 폴더와 정확히 맞춘다.

`reports/` 아래는 **탭 폴더 → 하위분류 폴더 → 보고서 폴더 → `index.html`** 4단 구조다.
**어느 폴더에 두느냐가 곧 화면에 뜨는 탭·하위분류를 결정한다** — 루트 `index.html`의 `TAB_FOLDERS`·`SUB_FOLDERS`에
"폴더명 → 화면에 뜨는 이름"이 매핑되어 있고, 보고서의 `url` 경로에서 그 폴더명을 읽어 자동으로 계산한다.
그래서 `REPORTS` 배열에는 탭·하위분류 값을 따로 적지 않아도 된다.

보고서 하나 = 폴더 하나 = `index.html` 파일 하나. 각 보고서에는 화면과 동작 코드가 들어 있어 다른 보고서 파일 없이 열 수 있다.
폰트와 PDF 저장 도구는 외부 CDN에서 불러오므로 해당 기능에는 인터넷 연결이 필요하다.

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
- 통합과학(1학년 공통) 수업이나 과학탐구실험 시간에 쓰는 활동 → `integrated-science` 탭 폴더 (내용이 지구과학 소재라도 여기로 — 예: 지질시대 화석 박람회의 통합과학 버전은 `integrated-science/earth-science/`에 있다)

분류를 바꾸려면 보고서 폴더를 옮기고, 루트 `index.html`의 `REPORTS`에 등록된 `url`도 새 경로로 바꾼다. 색상과 kicker도 새 분류에 맞춘다. 진행 배지는 경로별로 저장되므로 이전 경로의 배지는 자동 이전되지 않는다.

**같은 실험을 두 탭에 동시에 노출하고 싶으면**(예: 통합과학 수업과 지구과학 수업 둘 다에서 쓰는 실험) — 두 가지 방법이 있다.

**방법 A. 파일을 실제로 두 곳에 둔 경우** (예: `reports/earth-science/geology/geo-eras-expo/`와
`reports/integrated-science/earth-science/geo-eras-expo/`에 각각 파일이 있음) — `REPORTS` 배열에
**각자의 실제 경로**로 항목을 하나씩 만들면 된다. `tab`·`subcategory`는 각 url에서 알아서 계산된다.
지금 지질시대 화석 박람회가 이 방식이다. 이때 두 파일은 **포인트 색(탭에 맞게)과 localStorage 키(`geofair_` / `geofairint_`)를 서로 다르게** 둬야 한다 — 키가 같으면 GitHub Pages에서 두 버전의 저장 내용이 섞인다.

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
  /* ... 기존 항목들 ... */
  {
    name: '여기에 새 실험 제목',      /* 보고서 파일의 <h1>과 똑같이 */
    desc: '한두 문장으로 이 실험이 뭘 다루는지 설명',
    emoji: '🧪',
    url: 'reports/integrated-science/chemistry/new-folder-name/index.html'
  }
].map(r => Object.assign(deriveMeta(r.url), r));
```

> ⚠️ 마지막 줄은 반드시 `Object.assign(deriveMeta(r.url), r)` 순서여야 한다. 순서를 거꾸로(`Object.assign(r, deriveMeta(r.url))`) 쓰면
> 폴더에서 자동 계산한 값이 직접 적은 `tab`·`subcategory`를 덮어써서, 앞의 "방법 B"가 작동하지 않는다.

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
  '우주':      { color: '#7dd3c8', icon: '🪐' },
  '융합':      { color: '#7dd3c8', icon: '🔗' },
  '물리학':    { color: '#7dd3c8', icon: '⚛️' },
  '화학':      { color: '#7dd3c8', icon: '🧪' },
  '생명과학':  { color: '#7dd3c8', icon: '🧬' },
  '지구과학':  { color: '#7dd3c8', icon: '🌍' },
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
2. `SUB_META`에 그 하위분류의 색·아이콘 추가 — 색은 design-guide.md 1장 표를 따르고(지구과학 대기·해양·지질만 고유색, 나머지는 민트 `#7dd3c8`), 바꿀 때는 그 표와 보고서 파일 `:root`도 같이 고친다
3. `TAB_FOLDERS`(새 탭인 경우) 또는 `SUB_FOLDERS`(새 하위분류인 경우)에 "폴더명 → id/이름" 매핑 추가
4. `reports/` 아래에 그 폴더명으로 실제 폴더를 만든다

- 학생 기기에서 보고서를 쓰기 시작하면 허브 카드에 "작성 중 · n/m단계" 또는 "✓ PDF 저장 완료" 배지가 뜬다. 각 보고서가 `sjstatus:<경로>` 키에 진행 상태를 남기고 허브가 그걸 읽는 방식이라 서버가 필요 없고, 학생 각자의 기기에만 보인다(자세한 내용은 design-guide.md 10장).
- 하위분류에 아직 보고서가 없어도 점선 테두리로 "곧 추가될 실험을 위한 자리예요"가 자동으로 표시된다.
- `SUB_FOLDERS`에 등록 안 된 폴더명을 쓰면 `융합`으로, `TAB_FOLDERS`에 없는 폴더명을 쓰면 첫 번째 탭으로 조용히 분류된다 — 에러는 안 나지만 의도한 곳에 안 나타나니 폴더명은 항상 표와 정확히 맞춰 쓸 것.

## 각 보고서 파일 자체를 재사용하는 법

각 보고서(`reports/*/index.html`)는 이번에 정리해 둔 디자인(다크 배경 + 분류별 포인트 색, Pretendard 폰트),
표 형태 정보입력, 목표·준비물 고정 표시, 자동 저장, 빈칸+정답 확인(맞으면 초록/틀리면 빨강 표시),
사진 업로드(카메라 촬영 또는 갤러리 선택), PDF 저장 구조를 그대로 갖고 있다. 새 실험을 만들 때는

- 정보 입력 탭의 필드 구성(반/학번/이름/일시/장소 등, 실험 성격에 맞게 가감)
- 이론적 배경(또는 개념 확인) 탭의 빈칸 내용과 `THEORY_ANSWERS`(정답)
- 관찰/실험 탭의 항목 구성
- 파일 상단의 `FIXED_GOAL`·`FIXED_MATERIALS`(목표·준비물, 학생이 수정 불가), `DEFAULT_SUBMIT_URL`(제출 링크)

만 그 실험에 맞게 바꾸면, 나머지 구조(저장, 검증, PDF 내보내기 등)는 그대로 재사용할 수 있다.

### 빈칸 채점 기능

빈칸 채점(실시간 표시 + **"빈칸 확인하기"** 버튼 + 2회 재시도 + 정답 공개 팝업 + 재입력 유도)은 design-guide.md 6장에 표준 코드가 있다.
새로 짜지 말고 기존 보고서 파일의 해당 부분을 그대로 복사해서 `THEORY_ANSWERS`(정답)와 `BLANK_LABELS`(각 빈칸 설명)만 바꾸는 게 가장 안전하다.

> `neutralization-reaction.html`(중화 반응)은 다른 파일과 구조가 다른 예외 파일이라 베이스로 쓰지 않는다.

## 저장과 PDF 처리

- 화석 박람회 두 버전과 퇴적암의 추가 관찰 행은 이름·내용·사진까지 저장한다. 행 삭제와 전체 초기화도 저장 자료에 반영한다.
- 화석 박람회 저장 키는 지구과학판 `geofair_`, 통합과학판 `geofairint_`이다. 이전 공유 데이터는 자동 이동하지 않아 통합과학판에서 기존 입력이 비어 보일 수 있다.
- 구리판 실험은 저장소의 정상 원본(`7925a7e`)에서 복구했으며 `redox_copper_1_v5_`를 사용한다. 잘못 공유하던 아연·구리 데이터는 구리판 보고서로 옮기지 않는다.
- 사진은 긴 변 900px 이내의 JPEG(품질 75%)로 저장한다. 저장 실패는 현재 탭과 관계없이 고정 알림으로 표시한다.
- PDF 저장 도구의 완료 응답 후 해당 보고서의 저장된 사진만 정리한다. 글·현재 화면의 사진은 유지한다. 다시 열면 사진 재업로드 안내가 나오며, 페이지를 닫기 전 다시 수정하면 화면의 사진도 다시 저장된다.
- ‘PDF 저장 완료’는 저장 도구가 완료 응답을 반환했다는 뜻이다. 내려받은 파일은 학생이 확인해야 한다.
- 진행 배지는 중화 반응을 포함한 모든 보고서에 적용된다. 새 입력이나 실험 조작을 하면 ‘작성 중’으로 바뀐다. 중화 반응의 ‘새 실험’ 버튼은 실험 초기화이며 전체 보고서 삭제 버튼이 아니다.

## 검증 기록

2026-10-06 기준으로 전체 보고서의 HTML·스크립트, 제목·경로·저장 키·초성 힌트, 저장 경고·PDF 오류 복구·사진 정리·진행 배지를 확인했다. 추가 관찰 행의 글·사진 복원, 삭제와 초기화도 확인했다.

ARGO·화석·구리판·중화 반응은 실제 PDF를 생성해 사진 비율과 페이지 배치를 확인했다. 검증용 스크립트와 임시 출력 폴더는 점검 후 정리했다.

PDF 캡처 시에는 사진 비율을 이미지 자체에 반영해 세로 사진이 늘어나지 않도록 한다. 빈 사진 자리는 임시 투명 이미지로 처리하고, 작은 제목·내용 묶음만 함께 넘긴다. 캡처 후 원래 화면을 복구한다.

실제 PDF의 사진·줄바꿈·페이지 여백과 아이패드·갤럭시탭에서의 다운로드는 배포 전 별도로 확인한다.
