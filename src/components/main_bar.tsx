import React from 'react';
import { useGameStore } from '../stores/gameStore';
import type { PageType } from '../types/game';

type MainBarProps = {
  className?: string;
  position?: 'sticky' | 'absolute';
};

const navItems: Array<{ id: PageType; label: string }> = [
  { id: 'main', label: '메인' },
  { id: 'saved', label: '저장' }
];

const MainBar: React.FC<MainBarProps> = ({ className, position = 'sticky' }) => {
  const currentPage = useGameStore(state => state.currentPage);
  const setCurrentPage = useGameStore(state => state.setCurrentPage);
  const positionClass =
    position === 'absolute' ? 'absolute top-0 left-0 right-0' : 'sticky top-0';

  return (
    <header
      className={`w-full ${positionClass} z-30 ${className ?? ''}`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 shadow-lg">
          <div className="flex items-center gap-3 text-white">
            <span className="h-2 w-2 rounded-full bg-white/70" />
            <span className="text-sm font-semibold tracking-[0.2em] text-white/70">
              SEA CHOICE
            </span>
          </div>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = item.id === currentPage;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentPage(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'border-white/60 bg-white/20 text-white shadow-md'
                      : 'border-white/20 bg-black/20 text-white/70 hover:border-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default MainBar;
