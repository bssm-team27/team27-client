# 해양 안전 시뮬레이션 게임 설계 문서

## 1. 시스템 아키텍처 개요

### 1.1 전체 아키텍처
```
Frontend (React + TypeScript)
├── UI Layer (Pages & Components)
├── State Management Layer (Zustand)
├── Service Layer (API Services)
└── Type Definition Layer
```

### 1.2 데이터 플로우
```
User Interaction → Component → Store → API Service → Backend
                                ↓
UI Update ← Component ← Store ← API Response ← Backend
```
**과한 전역 상태관리를 피하세요.

## 2. 컴포넌트 설계

### 2.1 페이지 컴포넌트

#### MainPage
```typescript
interface MainPageProps {}

// 책임:
// - 서비스 소개 및 게임 시작 진입점 제공
// - 해양 테마의 시각적 브랜딩 표현
```

#### GameSetupPage
```typescript
interface GameSetupPageProps {}

interface GameSetupState {
  participants: 'single' | 'double' | 'group';
  activity: 'swimming' | 'fishing' | 'leisure';
  isLoading: boolean;
}

// 책임:
// - 게임 설정 수집 (인원, 활동)
// - 설정 검증 및 게임 생성 트리거
// - 로딩 상태 관리
```

#### GameplayPage
```typescript
interface GameplayPageProps {}

interface GameplayState {
  currentScenario: Scenario;
  backgroundImage: string;
  choices: Choice[];
  isWaitingForResponse: boolean;
}

// 책임:
// - 게임 진행 상태 관리
// - 선택지 처리 및 피드백 표시
// - 배경 이미지 및 시나리오 렌더링
```

#### AnalysisPage
```typescript
interface AnalysisPageProps {}

interface AnalysisState {
  gameResult: GameResult;
  analysis: AnalysisData;
  isLoading: boolean;
}

// 책임:
// - 게임 결과 분석 표시
// - 성과 시각화
// - 새 게임 진입점 제공
```

### 2.2 게임 컴포넌트

#### BackgroundImage
```typescript
interface BackgroundImageProps {
  imageUrl: string;
  altText: string;
  isLoading?: boolean;
}

// 책임:
// - AI 생성 배경 이미지 렌더링
// - 이미지 로딩 상태 및 오류 처리
// - 반응형 이미지 표시
```

#### ScenarioDescription
```typescript
interface ScenarioDescriptionProps {
  title: string;
  description: string;
  isVisible: boolean;
}

// 책임:
// - 시나리오 텍스트 표시
// - 타이핑 효과
```

#### ChoiceList
```typescript
interface ChoiceListProps {
  choices: Choice[];
  onChoiceSelect: (choiceId: string) => void;
  disabled?: boolean;
}

interface Choice {
  id: string;
  text: string;
  consequence?: string;
}

// 책임:
// - 선택지 목록 렌더링
// - 선택 이벤트 처리
// - 선택 후 상태 관리
```

### 2.3 UI 컴포넌트

#### Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
```

#### LoadingSpinner
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}
```

## 5. 타입 정의

### 5.1 Core Types
```typescript
// Game Types
type ParticipantType = 'single' | 'double' | 'group';
type ActivityType = 'swimming' | 'fishing' | 'leisure';
type GamePhase = 'setup' | 'playing' | 'analysis' | 'finished';

// UI Types
type PageType = 'main' | 'setup' | 'game' | 'analysis';
type LoadingType = 'game-creating' | 'scenario-loading' | 'analysis-loading';

// API Response Types
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

## 6. 라우팅 설계

### 6.1 라우터 구성
```typescript
// App.tsx에서의 라우팅 로직
const routes = [
  { path: '/', component: MainPage },
  { path: '/setup', component: GameSetupPage },
  { path: '/game/:gameId', component: GameplayPage },
  { path: '/analysis/:gameId', component: AnalysisPage }
];

// 프로그래밍 방식 네비게이션
const navigate = useGameStore(state => state.navigate);
```

## 7. 성능 최적화 전략

### 7.1 이미지 최적화
- Lazy loading for background images
- WebP format 지원 with fallback
- 이미지 사이즈 최적화 (responsive images)

### 7.2 컴포넌트 최적화
- React.memo for pure components
- useMemo for expensive calculations
- useCallback for event handlers

### 7.3 상태 관리 최적화
- Selective subscriptions in Zustand
- 불필요한 리렌더링 방지

## 8. 접근성 고려사항

### 8.1 키보드 내비게이션
- Tab index 순서 관리
- Enter/Space 키로 선택지 선택

## 9. 오류 처리 및 복구

### 9.1 네트워크 오류
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class GameErrorBoundary extends Component<Props, ErrorBoundaryState> {
  // 게임 특화 오류 복구 로직
}
```

### 9.2 게임 상태 복구
- 로컬 스토리지를 통한 임시 상태 백업
- 네트워크 복구 시 자동 재시도
- 사용자 친화적 오류 메시지
