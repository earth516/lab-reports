/* =========================================================
   예제 모음 (선생님이 직접 수정하는 파일)

   ▶ 예제 추가하는 방법
   1) 프로그램에서 단면을 그린다
   2) 「💾 파일 → 예제 코드 만들기」에서 제목·설명을 적고 [코드 복사]
   3) 아래 GEO_EXAMPLES 의 [ ] 안에 붙여 넣는다 (예제끼리는 쉼표로 구분)
   4) GitHub에 이 파일을 올리면(커밋) 학생 화면에 바로 반영된다

   ▶ 학생에게 특정 예제를 바로 열어 주려면 주소 뒤에 ?ex=아이디 를 붙인다
      예) https://내아이디.github.io/geo-section/?ex=angular
   ========================================================= */

// 화면 제목을 바꾸고 싶으면 아래 줄의 글자를 고치세요.
window.GEO_TITLE = "지질 단면도 시뮬레이션";

window.GEO_EXAMPLES = [
  {
    id: "angular",
    title: "① 경사 부정합",
    description: "지층이 쌓인 뒤 기울어지고, 깎인 다음 다시 지층이 쌓였어요. 순서대로 만들어 보세요.",
    events: [
      {t:"dep", rock:"basement", level:470},
      {t:"dep", rock:"sandstone", level:425},
      {t:"dep", rock:"shale", level:380},
      {t:"dep", rock:"limestone", level:335},
      {t:"tilt", ang:16, cx:400, cy:260},
      {t:"ero", level:275, mark:"both"},
      {t:"dep", rock:"conglomerate", level:250},
      {t:"dep", rock:"mudstone", level:215}
    ]
  },
  {
    id: "fold-dike",
    title: "② 습곡 · 암맥 · 부정합",
    description: "습곡된 지층을 암맥이 뚫고 들어간 뒤 침식되었어요. 암맥 위 지층에는 변성 흔적이 있을까요?",
    events: [
      {t:"dep", rock:"basement", level:480},
      {t:"dep", rock:"sandstone", level:435},
      {t:"dep", rock:"mudstone", level:395},
      {t:"dep", rock:"limestone", level:355},
      {t:"fold", amp:42, wl:420, ph:60},
      {t:"dike", rock:"granite", x1:300, y1:620, x2:430, y2:150, w:18, bake:6},
      {t:"ero", level:335, mark:"both"},
      {t:"dep", rock:"conglomerate", level:305},
      {t:"dep", rock:"shale", level:265}
    ]
  },
  {
    id: "batholith-fault",
    title: "③ 저반과 정단층",
    description: "화강암 저반이 관입한 뒤 단층이 생겼어요. 단층의 종류와 생성 순서를 생각해 보세요.",
    events: [
      {t:"dep", rock:"basement", level:480},
      {t:"dep", rock:"sandstone", level:440},
      {t:"dep", rock:"shale", level:400},
      {t:"dep", rock:"limestone", level:360},
      {t:"bath", rock:"granite", cx:250, top:385, R:120, bake:8},
      {t:"fault", x1:520, y1:0, x2:640, y2:520, side:-1, d:45},
      {t:"ero", level:345, mark:"dash"},
      {t:"dep", rock:"sandstone", level:310}
    ]
  },
  {
    id: "overturned-fold",
    title: "④ 옆으로 누운 습곡",
    description: "습곡 도구의 눕는 정도를 바꾸어 한쪽 날개가 뒤집히는 모습을 비교하세요. 목표 단면을 내 캔버스로 가져온 뒤 작업 기록의 마지막 습곡을 선택하면 값을 조절할 수 있어요.",
    events: [
      {t:"dep", rock:"basement", level:420},
      {t:"dep", rock:"tuff", level:365},
      {t:"dep", rock:"limestone", level:310},
      {t:"dep", rock:"mudstone", level:255},
      {t:"dep", rock:"shale", level:230},
      {t:"dep", rock:"sandstone", level:190},
      {t:"fold", amp:110, wl:640, ph:80, lean:70, cy:260}
    ]
  }
];
