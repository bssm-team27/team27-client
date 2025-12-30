import React, { useMemo, useEffect, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getRandomBackground } from '../utils/randomBackground';
import MainBar from '../components/ui/main_bar.tsx';
import type { ActivityType, ParticipantType, SavedGameSummary } from '../types/game';
import { gameLocalStorage, type StoredGameState } from '../utils/localStorage';

const participantLabel: Record<ParticipantType, string> = {
  single: '혼자',
  double: '둘이서',
  group: '단체'
};

const activityLabel: Record<ActivityType, string> = {
  swimming: '해수욕',
  fishing: '낚시',
  leisure: '레저활동'
};

const phaseLabel: Record<string, string> = {
  setup: '설정 중',
  playing: '진행 중',
  analysis: '분석 대기',
  finished: '분석 완료'
};

const feedbackSamples = {
  positive: [
    '위험 요소를 빠르게 파악하고 대응한 점이 돋보였습니다.',
    '침착하게 절차를 지켜 안전을 확보했습니다.',
    '주변 상황을 고려한 선택이었습니다.'
  ],
  neutral: [
    '기본적인 대응은 적절했지만 추가 확인이 필요했습니다.',
    '무난한 선택이었으나 더 안전한 대안이 있었습니다.',
    '중립적인 판단이었고 상황 파악이 조금 더 필요했습니다.'
  ],
  negative: [
    '위험 요소를 놓쳐 추가 대응이 필요했습니다.',
    '안전에 대한 고려가 부족해 보였습니다.',
    '현장 조건을 다시 확인하는 것이 좋았습니다.'
  ]
};

const mockStrengths = [
  '위험 상황에서도 침착하게 판단하려는 태도',
  '안전 규칙을 우선적으로 고려하는 습관',
  '상황을 빠르게 정리하고 선택한 점'
];

const mockImprovements = [
  '주변 위험 요소를 다시 한번 확인하는 습관',
  '대안 시나리오를 비교 검토하는 태도',
  '안전 장비 사용 여부를 점검하는 절차'
];

const getSafetyGrade = (percentage: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

const getFeedbackForRating = (rating: number, index: number) => {
  if (rating >= 4) {
    return feedbackSamples.positive[index % feedbackSamples.positive.length];
  }
  if (rating === 3) {
    return feedbackSamples.neutral[index % feedbackSamples.neutral.length];
  }
  return feedbackSamples.negative[index % feedbackSamples.negative.length];
};

const SavedPage: React.FC = () => {
  const backgroundImage = useGameStore(state => state.backgroundImage);
  const setCurrentPage = useGameStore(state => state.setCurrentPage);
  const [savedGames, setSavedGames] = useState<SavedGameSummary[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<StoredGameState | null>(null);

  useEffect(() => {
    const summaries = gameLocalStorage.getGamesSummary();
    summaries.sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime());
    setSavedGames(summaries);
  }, []);

  useEffect(() => {
    if (!selectedGameId) {
      setSelectedGame(null);
      return;
    }

    const stored = gameLocalStorage.loadGame(selectedGameId);
    if (!stored) {
      setSelectedGameId(null);
      return;
    }
    setSelectedGame(stored);
  }, [selectedGameId]);

  const selectedBackground = useMemo(
    () => backgroundImage ?? getRandomBackground(),
    [backgroundImage]
  );

  const detailedView = useMemo(() => {
    if (!selectedGame) return null;

    const totalScore = selectedGame.choices.reduce((sum, choice) => sum + choice.safetyRating, 0);
    const maxScore = Math.max(selectedGame.choices.length * 5, 5);
    const percentage = Math.round((totalScore / maxScore) * 100);
    const safetyGrade = getSafetyGrade(percentage);
    const strengths = mockStrengths.slice(0, safetyGrade === 'A' || safetyGrade === 'B' ? 3 : 2);
    const improvements = mockImprovements.slice(0, safetyGrade === 'F' || safetyGrade === 'D' ? 3 : 2);

    const scenarioById = new Map(selectedGame.scenarios.map(scenario => [scenario.id, scenario]));

    const choiceDetails = selectedGame.choices.map((choice, index) => {
      const scenario = scenarioById.get(choice.scenarioId);
      const selectedChoice = scenario?.choices.find(item => item.id === choice.choiceId);
      return {
        scenarioTitle: scenario?.title ?? `시나리오 ${index + 1}`,
        scenarioId: choice.scenarioId,
        choiceText: selectedChoice?.text ?? '선택 기록이 없습니다.',
        score: choice.safetyRating,
        feedback: getFeedbackForRating(choice.safetyRating, index)
      };
    });

    const summary = `총 ${selectedGame.choices.length}회의 선택 중 평균 안전 점수는 ${Math.round(totalScore / Math.max(selectedGame.choices.length, 1) * 10) / 10}점입니다.`;

    return {
      totalScore,
      maxScore,
      safetyGrade,
      strengths,
      improvements,
      summary,
      choiceDetails
    };
  }, [selectedGame]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${selectedBackground})` }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <MainBar />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-28">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">Archive</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">저장된 항해 기록</h1>
          <p className="mt-4 text-white/70">
            중단했던 시나리오를 이어가거나, 진행 요약을 확인하세요.
          </p>
        </div>

        {selectedGameId && detailedView ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/50">Record</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">저장된 기록 상세</h1>
                {selectedGame && (
                  <p className="mt-3 text-sm text-white/70">
                    {participantLabel[selectedGame.setup.participants]} · {activityLabel[selectedGame.setup.activity]} ·{' '}
                    {new Date(selectedGame.lastSaved).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedGameId(null)}
                  className="rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/70 hover:bg-white/20"
                >
                  목록으로
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('main')}
                  className="rounded-full border border-white/20 bg-black/40 px-5 py-2 text-sm font-semibold text-white/70 transition hover:border-white/60 hover:text-white"
                >
                  메인으로
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-lg">
                <h2 className="text-lg font-semibold text-white">종합 점수</h2>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {detailedView.totalScore} / {detailedView.maxScore}
                </p>
                <p className="mt-2 text-sm text-white/70">안전 등급: {detailedView.safetyGrade}</p>
                <p className="mt-4 text-sm text-white/70">{detailedView.summary}</p>
              </div>

              <div className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-lg">
                <h2 className="text-lg font-semibold text-white">강점</h2>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {detailedView.strengths.map((strength) => (
                    <li key={strength}>• {strength}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-lg">
                <h2 className="text-lg font-semibold text-white">개선 포인트</h2>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {detailedView.improvements.map((improvement) => (
                    <li key={improvement}>• {improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-lg">
              <h2 className="text-lg font-semibold text-white">선택지별 점수 & 피드백</h2>
              <div className="mt-5 space-y-4">
                {detailedView.choiceDetails.length === 0 ? (
                  <p className="text-sm text-white/60">저장된 선택 기록이 없습니다.</p>
                ) : (
                  detailedView.choiceDetails.map((detail, index) => (
                    <div
                      key={`${detail.scenarioId}-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                          {detail.scenarioTitle}
                        </span>
                        <span className="text-sm text-white/60">안전 점수 {detail.score}점</span>
                      </div>
                      <p className="mt-3 text-sm text-white/80">{detail.choiceText}</p>
                      <p className="mt-2 text-sm text-white/60">{detail.feedback}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : savedGames.length === 0 ? (
          <div className="rounded-3xl border border-white/15 bg-black/35 p-10 text-center backdrop-blur-lg">
            <p className="text-lg font-semibold text-white">아직 저장된 게임이 없습니다.</p>
            <p className="mt-3 text-sm text-white/60">
              메인 페이지에서 시나리오를 시작하면 자동으로 저장됩니다.
            </p>
            <button
              type="button"
              onClick={() => setCurrentPage('main')}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/70 hover:bg-white/20"
            >
              메인으로 이동
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedGames.map((saved) => (
              <div
                key={saved.gameId}
                className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-lg md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                      {phaseLabel[saved.phase] ?? '진행 기록'}
                    </span>
                    <span className="text-sm text-white/60">
                      {new Date(saved.lastSaved).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">
                    {participantLabel[saved.setup.participants]} · {activityLabel[saved.setup.activity]}
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    시나리오 {saved.scenarioCount}개 · 선택 {saved.choiceCount}회
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedGameId(saved.gameId)}
                    className="rounded-full border border-white/50 bg-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/30"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
