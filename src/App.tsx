import React from 'react';
import { useGameStore } from './stores/gameStore';
import { MainPage, GameSetupPage, GameplayPage, AnalysisPage } from './pages';

function App() {
  const currentPage = useGameStore(state => state.currentPage);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage />;
      case 'setup':
        return <GameSetupPage />;
      case 'game':
        return <GameplayPage />;
      case 'analysis':
        return <AnalysisPage />;
      default:
        return <MainPage />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
