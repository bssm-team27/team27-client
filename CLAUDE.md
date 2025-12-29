# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based marine safety simulation service (해양 안전 시뮬레이션 서비스) that provides interactive choice-based scenarios to educate users about ocean safety. The application is built with React 19, TypeScript, Zustand for state management, and Tailwind CSS v4.

## Common Development Commands

### Development Server
- `npm run dev` - Start development server (Vite) on http://localhost:5173
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Package Management
- `npm install` - Install dependencies
- `npm ci` - Clean install for production/CI environments

## Architecture Overview

### Core Technology Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Zustand stores (`src/stores/`)
- **Styling**: Tailwind CSS v4 with PostCSS
- **HTTP Client**: Axios for API calls (currently using mock data)

### Project Structure
```
src/
├── api/               # API layer and mock data
│   ├── gameAPI.ts    # Main game API class with methods for game flow
│   └── mockData.ts   # Comprehensive mock scenarios and data
├── components/        # Reusable React components
│   ├── ui/           # Basic UI components (Button, Modal, LoadingSpinner)
│   ├── game/         # Game-specific components (BackgroundImage, ScenarioDescription, ChoiceList)
│   └── common/       # Shared components
├── pages/            # Page-level components for routing
│   ├── MainPage.tsx     # Landing page
│   ├── GameSetupPage.tsx # Participant and activity selection
│   ├── GameplayPage.tsx  # Main game experience
│   └── AnalysisPage.tsx  # Results and feedback
├── stores/           # Zustand state management
│   ├── gameStore.ts  # Core game state and actions
│   └── uiStore.ts    # UI state (menus, notifications)
├── types/            # TypeScript type definitions
│   └── game.ts       # Comprehensive game-related types
└── App.tsx           # Main application component with page routing
```

### State Management Pattern

The application uses Zustand with TypeScript for predictable state management:

- **gameStore.ts**: Manages entire game lifecycle including setup, scenario progression, choice selection, and analysis
- **uiStore.ts**: Handles UI-specific state like modals and notifications
- All store actions are async-capable and include comprehensive error handling
- State updates follow immutable patterns for predictability

### Game Flow Architecture

1. **Setup Phase**: User selects participant type (single/double/group) and activity (swimming/fishing/leisure)
2. **Playing Phase**: Progressive scenario presentation with safety-rated choices (1-5 scale)
3. **Analysis Phase**: Comprehensive feedback with scores, grades (A-F), and improvement suggestions

### Component Design Patterns

#### UI Components (`src/components/ui/`)
- **Button**: Variants (primary/secondary/danger), sizes (sm/md/lg), loading states
- **Modal**: Reusable dialog with backdrop and close handling
- **LoadingSpinner**: Configurable sizes with optional messages

#### Game Components (`src/components/game/`)
- **BackgroundImage**: Handles scenario imagery with loading states
- **ScenarioDescription**: Typing animation effect for immersive storytelling
- **ChoiceList**: Color-coded choices based on safety ratings (red=dangerous, green=safe)

### API Layer Design

The API layer is designed for easy backend integration:
- **gameAPI.ts**: Class-based API with methods for createGame, selectChoice, getAnalysis
- **mockData.ts**: 30+ realistic marine safety scenarios covering different activities and participant types
- All API responses use consistent `APIResponse<T>` interface for type safety
- Error handling is centralized and propagated to UI components

### Styling Architecture

- **Tailwind CSS v4**: Latest CSS framework with PostCSS integration
- **Responsive Design**: Mobile-first approach with consistent breakpoints
- **Color System**: Ocean-themed palette using 'sky' colors for consistency
- **Animations**: Smooth transitions, fade-ins, and hover effects for enhanced UX

## Key Implementation Details

### TypeScript Integration
- Strict type checking enabled across all files
- Comprehensive type definitions in `src/types/game.ts`
- React component props are fully typed for better development experience
- API responses and store state are type-safe

### Tailwind CSS v4 Setup
- Uses `@tailwindcss/postcss` package for PostCSS integration
- Custom configuration in `tailwind.config.js` with typography plugin
- Ocean-themed color palette for consistent marine safety theme

### Mock Data Structure
The application includes comprehensive mock scenarios:
- Different difficulty progressions for each activity type
- Realistic safety situations with educational value
- Safety ratings (1-5) that affect scoring and feedback
- Detailed consequence explanations for learning

## Development Guidelines

### Component Conventions
- Use functional components with React hooks
- Implement proper TypeScript interfaces for all props
- Follow the established component structure with ui/game/common separation
- Use Zustand stores for state that needs to persist across components

### API Integration
- When implementing real backend, replace mock calls in `gameAPI.ts`
- Maintain the existing `APIResponse<T>` interface structure
- Keep error handling patterns consistent with current implementation

### State Management
- Use Zustand stores for application state
- Keep UI state separate from business logic state
- Implement proper loading states for all async operations
- Handle errors gracefully with user-friendly messages

### Testing Strategy
- No specific test framework is currently configured
- When adding tests, consider React Testing Library for component testing
- Mock the game API for consistent test scenarios
- Focus on user interactions and state transitions

## Important Notes

- The application currently runs entirely on mock data for demonstration purposes
- All game scenarios and feedback are pre-defined in `src/api/mockData.ts`
- The project uses the latest React 19 features and Tailwind CSS v4
- State management follows functional programming principles with immutable updates