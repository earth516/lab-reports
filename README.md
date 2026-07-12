# SJ 활동 · 실험 보고서 사이트

서버 없이 정적 HTML 파일들로만 동작하는 실험 보고서 모음 사이트. GitHub Pages로 그대로 배포한다.

## 폴더 구조

```
/
├── index.html                                   ← 허브 페이지 (여기서 항목을 클릭하면 각 보고서로 이동)
├── README.md
└── reports/
    ├── earth-science/
    │   └── deep-circulation/
    │       └── index.html                       ← "심층 순환의 발생 원리 추론하기" 보고서
    └── integrated-science/
        └── geo-eras-expo/
            └── index.html                       ← "지질시대 박람회" 활동 보고서
```

> **폴더 이름은 한글 대신 영문·하이픈을 쓴다.** 한글 폴더명은 깃허브에서 인식이 잘 안 될 때가
> 있다 (맥에서 만든 폴더는 유니코드가 분해형(NFD)으로 저장되는데 깃허브·브라우저는 완성형(NFC)을
> 기대해서 링크가 깨지는 경우가 흔하다). 화면에 보이는 분류 이름(`통합과학 · 과탐실`, `지구과학`)은
> 폴더명과 무관하게 `index.html`의 `REPORTS` 배열에서 따로 지정한다.

`reports/` 아래는 **분류 폴더 → 보고서 폴더 → `index.html`** 3단 구조다. 분류 폴더 이름은
허브 페이지의 `CATEGORIES`와 반드시 같을 필요는 없다(폴더 이름과 화면에 뜨는 분류 이름은 서로 독립적으로,
`index.html`의 `REPORTS` 배열에서 각 보고서마다 `category`를 직접 지정한다). 다만 헷갈리지 않게
같은 이름으로 맞춰서 관리하는 걸 추천한다.

보고서 하나 = 폴더 하나 = `index.html` 파일 하나. 각 보고서 파일은 완전히 독립적으로 동작한다
(다른 파일을 참조하지 않는다).

## GitHub Pages로 배포하기

1. 이 폴더 전체를 GitHub 저장소에 올린다 (레포 이름 아무거나, 예: `sj-lab-reports`).
2. 저장소 **Settings → Pages**로 들어간다.
3. **Source**를 `Deploy from a branch`로, **Branch**를 `main` / `(root)`로 설정하고 저장한다.
4. 몇 분 뒤 `https://<깃허브아이디>.github.io/<저장소이름>/` 주소로 접속되면 끝.
   허브 페이지(`index.html`)가 첫 화면으로 뜨고, 각 카드를 누르면 `reports/.../index.html`로 이동한다.

이후로는 **그냥 이 폴더에 파일을 추가하고 커밋 → 푸시**하면 사이트에 바로 반영된다. 별도 빌드 과정이 없다.

## 새 실험 보고서 추가하는 법

1. `reports/분류-폴더/` 안에 새 폴더를 만든다. 폴더 이름은 반드시 영문·하이픈으로 (예: `reports/earth-science/salinity-density/`).
   해당 분류 폴더가 아직 없다면 새로 만들면 된다.
2. 그 안에 보고서 HTML 파일을 넣고 이름을 `index.html`로 한다.
   (기존 `reports/earth-science/deep-circulation/index.html`을 복사해서 내용만 바꾸는 게 제일 빠르다.)
3. 루트의 `index.html`을 열어 `<script>` 안 `REPORTS` 배열에 한 줄 추가한다.

```js
const REPORTS = [
  {
    category: '지구과학',
    name: '심층 순환의 발생 원리 추론하기',
    desc: '수온·염분 차이로 밀도류와 심층 순환이 일어나는 원리를 추론해요',
    emoji: '🌊',
    url: 'reports/earth-science/deep-circulation/index.html'
  },
  {
    category: '통합과학 · 과탐실',
    name: '여기에 새 실험 제목',
    desc: '한두 문장으로 이 실험이 뭘 다루는지 설명',
    emoji: '🧪',
    url: 'reports/integrated-science/new-folder-name/index.html'
  }
];
```

`category` 값은 반드시 바로 위 `CATEGORIES` 배열에 있는 두 값(`'통합과학 · 과탐실'`, `'지구과학'`) 중
하나와 **정확히 똑같이** 써야 한다. 오타가 나면 그 카드는 어느 분류에도 나타나지 않는다.

4. 커밋하고 푸시하면 끝. 새 카드가 해당 분류 아래에 자동으로 나타난다.

> **참고**: git은 빈 폴더를 저장하지 않는다. 새 분류를 만들었는데 아직 보고서가 하나도 없다면,
> 그 폴더가 저장소에서 사라지지 않도록 폴더 안에 `README.md` 같은 파일을 하나 넣어 두자.
> 첫 보고서를 추가하면 그 안내용 파일은 지워도 무방하다.

## 분류(카테고리)를 추가/변경하려면

루트 `index.html`의 `CATEGORIES` 배열에 이름을 추가하면 새 분류 섹션이 자동으로 생긴다.
(그 분류에 보고서가 아직 없으면 점선 테두리로 "곧 추가될 실험을 위한 자리예요"라고 표시된다.)

```js
const CATEGORIES = ['통합과학 · 과탐실', '지구과학', '새 분류 이름'];
```

## 각 보고서 파일 자체를 재사용하는 법

각 보고서(`reports/*/index.html`)는 이번에 정리해 둔 흑백·Pretendard 통일 디자인, 자동 저장,
빈칸+정답 확인, 안전 수칙 체크, PDF 저장 구조를 그대로 갖고 있다. 새 실험을 만들 때는

- 탭 3(개념), 탭 4(실험/측정)의 내용만 그 실험에 맞게 바꾸고
- 파일 상단의 `TEXTBOOK_PAGES`(참고 쪽수), `DEFAULT_SUBMIT_URL`(제출 링크)만 새로 설정하면

나머지 구조(정보 입력, 안전 수칙, PDF 저장, 자동 저장 등)는 그대로 재사용할 수 있다.
