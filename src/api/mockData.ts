import type {
  Scenario,
  GameCreationResponse,
  ChoiceResponse,
  AnalysisData,
  ScenarioFeedback,
  GameSetup
} from '../types/game';

// 목 배경 이미지 URL들
const MOCK_BACKGROUNDS = {
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  ocean: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  boat: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  fishing: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  leisure: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
};

// 해수욕 시나리오
const SWIMMING_SCENARIOS: Scenario[] = [
  {
    id: 'swim_1',
    title: '해변 도착',
    description: '가족과 함께 해수욕장에 도착했습니다. 파도가 높고 바람이 강하게 불고 있습니다. 어떻게 하시겠습니까?',
    backgroundImageUrl: MOCK_BACKGROUNDS.beach,
    context: '여름 성수기, 오후 2시, 강한 남서풍',
    choices: [
      {
        id: 'swim_1_a',
        text: '파도가 높지만 신나 보이니 바로 바다에 들어간다',
        safetyRating: 2,
        explanation: '높은 파도는 위험할 수 있습니다. 안전 확인이 우선입니다.'
      },
      {
        id: 'swim_1_b',
        text: '해변 안전요원에게 바다 상황을 문의한다',
        safetyRating: 5,
        explanation: '훌륭한 선택입니다. 전문가의 조언을 구하는 것이 가장 안전합니다.'
      },
      {
        id: 'swim_1_c',
        text: '파도가 좀 잦아들 때까지 해변에서 기다린다',
        safetyRating: 4,
        explanation: '신중한 판단입니다. 상황을 관찰하는 것은 좋은 접근입니다.'
      }
    ]
  },
  {
    id: 'swim_2',
    title: '물놀이 중 상황 발생',
    description: '바다에서 놀고 있는데 갑자기 파도가 더 커지기 시작합니다. 멀리 있던 아이가 파도에 휩쓸려 당황하고 있습니다.',
    backgroundImageUrl: MOCK_BACKGROUNDS.ocean,
    context: '수심 1.5m, 파도 높이 증가, 아이와 거리 약 20m',
    choices: [
      {
        id: 'swim_2_a',
        text: '즉시 아이에게 수영해서 도움을 준다',
        safetyRating: 2,
        explanation: '직접 구조는 위험할 수 있습니다. 구조 장비나 전문가의 도움이 필요합니다.'
      },
      {
        id: 'swim_2_b',
        text: '해변 안전요원에게 즉시 신고하고 구조를 요청한다',
        safetyRating: 5,
        explanation: '완벽한 대응입니다. 전문 구조요원의 도움이 가장 안전합니다.'
      },
      {
        id: 'swim_2_c',
        text: '큰 소리로 아이에게 침착하라고 외치며 주변 사람들에게 도움을 요청한다',
        safetyRating: 4,
        explanation: '좋은 판단입니다. 여러 사람의 협조로 더 안전한 구조가 가능합니다.'
      }
    ]
  }
];

// 낚시 시나리오
const FISHING_SCENARIOS: Scenario[] = [
  {
    id: 'fish_1',
    title: '낚시 장소 선택',
    description: '바다 낚시를 위해 방파제에 도착했습니다. 파도가 방파제를 넘나들고 바위가 미끄러워 보입니다.',
    backgroundImageUrl: MOCK_BACKGROUNDS.fishing,
    context: '밤 11시, 만조 시간, 젖은 바위',
    choices: [
      {
        id: 'fish_1_a',
        text: '파도가 좋아 보이니 가장 끝자락에서 낚시한다',
        safetyRating: 1,
        explanation: '매우 위험합니다. 방파제 끝은 파도에 휩쓸릴 위험이 높습니다.'
      },
      {
        id: 'fish_1_b',
        text: '안전한 곳을 찾아 구명조끼를 착용하고 낚시한다',
        safetyRating: 5,
        explanation: '완벽한 안전 준비입니다. 구명조끼는 필수 안전장비입니다.'
      },
      {
        id: 'fish_1_c',
        text: '파도가 잦아들 때까지 차에서 기다린다',
        safetyRating: 4,
        explanation: '안전한 선택입니다. 조건이 개선될 때까지 기다리는 것이 좋습니다.'
      }
    ]
  },
  {
    id: 'fish_2',
    title: '갑작스런 기상 변화',
    description: '낚시 중에 갑자기 바람이 강해지고 파도가 높아집니다. 날씨 앱을 확인하니 태풍이 접근하고 있습니다.',
    backgroundImageUrl: MOCK_BACKGROUNDS.boat,
    context: '새벽 4시, 태풍 경보, 풍속 15m/s',
    choices: [
      {
        id: 'fish_2_a',
        text: '이미 왔으니 조금 더 낚시하고 돌아간다',
        safetyRating: 1,
        explanation: '매우 위험한 판단입니다. 태풍 상황에서는 즉시 대피해야 합니다.'
      },
      {
        id: 'fish_2_b',
        text: '즉시 낚시를 중단하고 안전한 곳으로 대피한다',
        safetyRating: 5,
        explanation: '완벽한 안전 판단입니다. 생명보다 중요한 것은 없습니다.'
      },
      {
        id: 'fish_2_c',
        text: '바람이 직접 닿지 않는 방파제 안쪽으로 이동한다',
        safetyRating: 3,
        explanation: '부분적으로 안전하지만, 태풍 상황에서는 완전한 대피가 필요합니다.'
      }
    ]
  }
];

// 레저활동 시나리오
const LEISURE_SCENARIOS: Scenario[] = [
  {
    id: 'leisure_1',
    title: '수상스키 체험',
    description: '수상스키 체험을 하려고 합니다. 강사가 간단한 안전교육을 하고 있는데, 바빠 보이며 빠르게 설명하고 있습니다.',
    backgroundImageUrl: MOCK_BACKGROUNDS.leisure,
    context: '오후 3시, 바람 5m/s, 파도 1m',
    choices: [
      {
        id: 'leisure_1_a',
        text: '빨리 시작하고 싶어서 대충 듣고 바로 시작한다',
        safetyRating: 1,
        explanation: '매우 위험합니다. 안전교육을 제대로 받지 않으면 사고 위험이 높습니다.'
      },
      {
        id: 'leisure_1_b',
        text: '이해되지 않는 부분에 대해 자세히 질문한다',
        safetyRating: 5,
        explanation: '완벽한 접근입니다. 안전에 대해서는 완전히 이해하고 시작해야 합니다.'
      },
      {
        id: 'leisure_1_c',
        text: '다른 사람들이 하는 것을 먼저 관찰한다',
        safetyRating: 4,
        explanation: '좋은 접근입니다. 관찰 학습도 안전교육의 일부입니다.'
      }
    ]
  }
];

// 활동별 시나리오 매핑
const ACTIVITY_SCENARIOS = {
  swimming: SWIMMING_SCENARIOS,
  fishing: FISHING_SCENARIOS,
  leisure: LEISURE_SCENARIOS
};

// 게임 생성 모의 데이터
export const createMockGame = (setup: GameSetup): GameCreationResponse => {
  const scenarios = ACTIVITY_SCENARIOS[setup.activity];
  const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    gameId,
    initialScenario: scenarios[0]
  };
};

// 선택지 응답 모의 데이터
export const getMockChoiceResponse = (_gameId: string, choiceId: string): ChoiceResponse => {
  const scenarios = Object.values(ACTIVITY_SCENARIOS).flat();

  // 현재 시나리오와 선택지 찾기
  let currentScenario = null;
  let selectedChoice = null;

  for (const scenario of scenarios) {
    const choice = scenario.choices.find(c => c.id === choiceId);
    if (choice) {
      currentScenario = scenario;
      selectedChoice = choice;
      break;
    }
  }

  if (!currentScenario || !selectedChoice) {
    return {
      feedback: '선택지를 찾을 수 없습니다.',
      isGameComplete: true,
      immediateConsequence: '게임이 종료되었습니다.'
    };
  }

  // 다음 시나리오 찾기
  const currentIndex = scenarios.findIndex(s => s.id === currentScenario!.id);
  const nextScenario = currentIndex < scenarios.length - 1 ? scenarios[currentIndex + 1] : null;

  // 피드백 생성
  const feedback = selectedChoice.explanation || '선택을 완료했습니다.';
  const immediateConsequence = generateImmediateConsequence(selectedChoice.safetyRating);

  return {
    feedback,
    nextScenario: nextScenario || undefined,
    isGameComplete: !nextScenario,
    immediateConsequence
  };
};

// 즉시 결과 생성
const generateImmediateConsequence = (safetyRating: number): string => {
  if (safetyRating >= 5) {
    return '매우 안전한 선택입니다! 👏';
  } else if (safetyRating >= 4) {
    return '좋은 판단입니다! 👍';
  } else if (safetyRating >= 3) {
    return '무난한 선택이네요. 🤔';
  } else if (safetyRating >= 2) {
    return '조금 위험할 수 있습니다. ⚠️';
  } else {
    return '매우 위험한 선택입니다! ❌';
  }
};

// 분석 데이터 모의 생성
export const getMockAnalysis = (): AnalysisData => {
  // 실제로는 사용자의 선택 기록을 바탕으로 분석
  // 여기서는 예시 데이터를 반환

  const totalScore = Math.floor(Math.random() * 50) + 50; // 50-100 점
  const maxScore = 100;
  const percentage = (totalScore / maxScore) * 100;

  let safetyGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (percentage >= 90) safetyGrade = 'A';
  else if (percentage >= 80) safetyGrade = 'B';
  else if (percentage >= 70) safetyGrade = 'C';
  else if (percentage >= 60) safetyGrade = 'D';
  else safetyGrade = 'F';

  const strengths = [
    '위험 상황을 잘 인식하고 계십니다',
    '안전장비 사용에 대한 이해도가 높습니다',
    '전문가의 도움을 구하는 판단력이 우수합니다'
  ];

  const improvements = [
    '응급상황 대응 매뉴얼을 숙지해보세요',
    '해양 기상정보 확인 습관을 기르세요',
    '동반자와의 안전 신호 체계를 만들어보세요'
  ];

  const detailedFeedback: ScenarioFeedback[] = [
    {
      scenarioId: 'swim_1',
      chosenChoice: SWIMMING_SCENARIOS[0].choices[1],
      optimalChoice: SWIMMING_SCENARIOS[0].choices[1],
      feedback: '전문가에게 문의하는 것은 항상 최선의 선택입니다.',
      impact: 'positive'
    }
  ];

  return {
    totalScore,
    maxScore,
    safetyGrade,
    strengths: strengths.slice(0, Math.floor(Math.random() * 3) + 1),
    improvements: improvements.slice(0, Math.floor(Math.random() * 3) + 1),
    detailedFeedback,
    summary: `전체적으로 ${safetyGrade} 등급의 해양 안전 의식을 보여주셨습니다. ${totalScore}점으로 안전 의식이 ${percentage > 70 ? '높은' : '개선이 필요한'} 편입니다.`
  };
};
