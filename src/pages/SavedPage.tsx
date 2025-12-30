import React, { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getRandomBackground } from '../utils/randomBackground';
import MainBar from '../components/ui/main_bar.tsx';
import type { ActivityType, ParticipantType } from '../types/game';

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

const SavedPage: React.FC = () => {
  const backgroundImage = useGameStore(state => state.backgroundImage);
  const setCurrentPage = useGameStore(state => state.setCurrentPage);
  const getSavedGames = useGameStore(state => state.getSavedGames);
  const loadSavedGame = useGameStore(state => state.loadSavedGame);
  const deleteSavedGame = useGameStore(state => state.deleteSavedGame);
  const savedGames = getSavedGames();

  const selectedBackground = useMemo(
    () => backgroundImage ?? getRandomBackground(),
    [backgroundImage]
  );

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

        {savedGames.length === 0 ? (
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
                    onClick={() => loadSavedGame(saved.gameId)}
                    className="rounded-full border border-white/50 bg-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/30"
                  >
                    이어하기
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSavedGame(saved.gameId)}
                    className="rounded-full border border-white/20 bg-black/40 px-5 py-2 text-sm font-semibold text-white/70 transition hover:border-white/60 hover:text-white"
                  >
                    삭제
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
