# 🛠 Developer Guide - Kasooti Game

This guide provides detailed technical information for developers working on the Kasooti Game platform.

## 🏗 Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Audio**: Web Audio API with custom sound utilities

### Component Hierarchy
```
QuizGame (Root Container)
├── QuestionListScreen (Question Grid View)
│   └── QuestionBox (Individual Question Cards)
└── QuizScreen (Game Play Interface)
    ├── Timer (Countdown Display)
    ├── ClueBox (Interactive Clue Containers)
    └── AnswerBox (Results Display)
```

## 📂 File Structure Explained

### Core Components (`/src/components/`)

#### `QuizGame.tsx`
**Purpose**: Main application container and state management
**Key Features**:
- CSV data loading and parsing
- Question navigation state
- Error handling and loading states
- Responsive layout management

**Key Functions**:
```typescript
parseCSV(csv: string): Question[] // Converts CSV to Question objects
handleSelectQuestion(index: number) // Navigates to specific question
handleUpdateQuestion(updatedQuestion: Question) // Updates question state
handleExitQuiz() // Returns to question grid
```

#### `QuestionListScreen.tsx`
**Purpose**: Grid view of all available questions
**Key Features**:
- Color-coded question types (Personality, Place, Event)
- Progress tracking with visual indicators
- Hover animations and interactive states
- Responsive grid layout

**Styling System**:
- Uses `getQuestionTypeColor()` for dynamic theming
- Implements floating animations for visual interest
- Glass morphism effects for modern UI

#### `QuizScreen.tsx`
**Purpose**: Individual question gameplay interface
**Key Features**:
- Progressive clue revelation system
- Real-time timer with audio warnings
- Coach control buttons for scoring
- Animated answer reveal with celebrations

**Game Logic**:
```typescript
calculatePossibleScore() // Determines score based on revealed clues
handleRevealClue(boxNumber: number) // Shows clue with animation
handleAnswer(isCorrect: boolean) // Processes coach's scoring decision
```

### Configuration (`/src/config/`)

#### `constants.ts`
**Purpose**: Centralized game configuration
**Customizable Settings**:
```typescript
APP_CONFIG = {
  eventTitle: string,           // Event branding
  instituteName: string,        // Organization name
  timerConfig: {
    totalSeconds: number,       // Question time limit
    warningBeepInterval: number,// Beep frequency
    dangerZoneSeconds: number,  // Red timer threshold
  },
  scoring: {
    firstClue: number,         // Points for 1st clue answer
    secondClue: number,        // Points for 2nd clue answer
    thirdClue: number,         // Points for 3rd clue answer
    fourthClue: number,        // Points for 4th clue answer
    defaultMark: number,       // Points for not answering
    wrongPenalty: number,      // Penalty points
  }
}
```

### Design System (`/src/styles/`)

#### `theme.ts`
**Purpose**: Design tokens and theme configuration
**Key Exports**:
- `COLORS`: Comprehensive color palette with opacity variants
- `FONT_SIZES`: Typographic scale
- `FONT_WEIGHTS`: Font weight definitions
- `SPACING`: Consistent spacing values
- `BORDER_RADIUS`: Border radius scale
- `SHADOWS`: Shadow definitions
- `ANIMATIONS`: Animation timing and easing

#### `globals.css`
**Purpose**: Global styles and CSS animations
**Key Features**:
- CSS custom properties for dynamic theming
- Keyframe animations for micro-interactions
- Responsive utilities
- Glass morphism effects
- Hover state definitions

### Types (`/src/types.ts`)

#### Question Interface
```typescript
interface Question {
  Type: string;        // Category: PERSONALITY, PLACE, EVENT
  Answer: string;      // The correct answer
  Hint1: string;       // First clue (highest points)
  Hint2: string;       // Second clue
  Hint3: string;       // Third clue
  Hint4: string;       // Fourth clue (lowest points)
  score: number;       // Current question score
  wrongAttempts: number; // Number of incorrect attempts
  penalty: number;     // Penalty points applied
  isCorrect: boolean;  // Whether answered correctly
  showAnswer: boolean; // Whether answer is revealed
  isOpened: boolean;   // Whether question has been played
}
```

### Audio System (`/src/utils/soundUtils.ts`)

#### Sound Management
```typescript
playSound(soundName: string): void
// Plays one-time audio effects (beep, correct, wrong)

playLoopedSound(soundName: string, interval: number): () => void
// Plays repeating sounds (timer tick), returns stop function
```

**Audio Files**:
- `beep.mp3`: General notifications and clue reveals
- `correct.mp3`: Correct answer celebration
- `wrong.mp3`: Incorrect answer feedback  
- `tick.mp3`: Timer warning in danger zone

## 🎨 Styling and Animations

### CSS Classes Reference

#### Component-Specific Classes
```css
.clue-box                 /* Base clue container */
.clue-box-revealed        /* Revealed clue state */
.clue-box-unrevealed      /* Hidden clue state */
.timer                    /* Timer container */
.timer-normal            /* Timer normal state (green) */
.timer-warning           /* Timer warning state (red) */
.question-card           /* Question grid card */
.question-card-disabled  /* Completed question card */
```

#### Utility Classes
```css
.glass-effect           /* Glass morphism background */
.gradient-text          /* Gradient text effect */
.floating              /* Floating animation */
.reveal-animation      /* Content reveal transition */
.score-bounce          /* Score display animation */
.loading-spinner       /* Loading state animation */
```

### Animation System

#### Keyframes
- `floating`: Subtle up-down movement (3s cycle)
- `pulse-green`: Timer normal state pulsing
- `pulse-red`: Timer warning state with glow
- `spin`: Loading spinner rotation
- `revealContent`: 3D flip reveal animation
- `scoreBounce`: Celebratory score animation
- `correctAnswer`: Success state celebration
- `incorrectAnswer`: Error state shake

#### Transition Patterns
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```
- **Fast**: 150ms for micro-interactions
- **Normal**: 300ms for standard transitions
- **Slow**: 500ms for dramatic state changes

## 🔧 Development Workflows

### Adding New Question Types

1. **Update CSV Data**:
   ```csv
   Type,Answer,Hint1,Hint2,Hint3,Hint4
   SCIENCE,DNA,Building blocks of life,Double helix structure,Discovered by Watson and Crick,Stores genetic information
   ```

2. **Add Color Mapping**:
   ```typescript
   // In QuestionListScreen.tsx
   const getQuestionTypeColor = (type: string) => {
     switch (type.toLowerCase()) {
       case 'science': return COLORS.success[500];
       // ... existing cases
     }
   };
   ```

3. **Add Gradient Mapping**:
   ```typescript
   const getQuestionTypeGradient = (type: string) => {
     switch (type.toLowerCase()) {
       case 'science': return 'from-green-400 to-emerald-400';
       // ... existing cases
     }
   };
   ```

### Customizing Animations

1. **Modify Timing**:
   ```typescript
   // In theme.ts
   ANIMATIONS: {
     duration: {
       fast: "100ms",    // Faster micro-interactions
       normal: "400ms",  // Slower standard transitions
     }
   }
   ```

2. **Add New Keyframes**:
   ```css
   /* In globals.css */
   @keyframes customAnimation {
     0% { transform: scale(1); }
     50% { transform: scale(1.1) rotate(5deg); }
     100% { transform: scale(1) rotate(0deg); }
   }
   
   .custom-class {
     animation: customAnimation 0.5s ease-in-out;
   }
   ```

### Modifying Scoring System

1. **Update Configuration**:
   ```typescript
   // In constants.ts
   scoring: {
     firstClue: 50,        // Increased from 40
     secondClue: 35,       // Increased from 30
     thirdClue: 25,        // Increased from 20
     fourthClue: 15,       // Increased from 10
     defaultMark: 5,       // Increased from 0
     wrongPenalty: -15,    // Increased penalty
   }
   ```

2. **Add Bonus Logic**:
   ```typescript
   // In QuizScreen.tsx
   const calculateBonusScore = () => {
     if (revealedClues.length === 1 && timeLeft > 60) {
       return 10; // Speed bonus
     }
     return 0;
   };
   ```

## 🧪 Testing Guidelines

### Component Testing
```typescript
// Example test structure
describe('QuizScreen', () => {
  it('should reveal clues when clicked', () => {
    // Test clue revelation functionality
  });
  
  it('should update score correctly', () => {
    // Test scoring logic
  });
  
  it('should handle timer expiration', () => {
    // Test timer functionality
  });
});
```

### End-to-End Testing
1. **Question Loading**: Verify CSV parsing and question display
2. **Navigation**: Test question selection and return to grid
3. **Game Flow**: Complete question lifecycle (clues → answer → score)
4. **Audio**: Verify sound effects play correctly
5. **Responsive**: Test on different screen sizes

## 🚀 Performance Optimization

### Best Practices

1. **Code Splitting**:
   ```typescript
   // Dynamic imports for heavy components
   const QuizScreen = dynamic(() => import('./QuizScreen'), {
     loading: () => <LoadingSpinner />,
   });
   ```

2. **Memoization**:
   ```typescript
   const expensiveCalculation = useMemo(() => {
     return calculateComplexScore(questions);
   }, [questions]);
   ```

3. **Audio Preloading**:
   ```typescript
   useEffect(() => {
     // Preload audio files on app start
     ['beep.mp3', 'correct.mp3'].forEach(sound => {
       const audio = new Audio(`/assets/sounds/${sound}`);
       audio.preload = 'auto';
     });
   }, []);
   ```

### Bundle Optimization
- Use `next/dynamic` for code splitting
- Optimize images with Next.js Image component
- Minimize CSS with PurgeCSS in production
- Enable gzip compression on server

## 🐛 Common Issues and Solutions

### Audio Issues
**Problem**: Sounds not playing in browser
**Solution**: 
```typescript
// Ensure user interaction before audio
const playWithUserGesture = () => {
  document.addEventListener('click', () => {
    playSound('beep');
  }, { once: true });
};
```

### CSV Parsing Issues
**Problem**: Special characters breaking CSV parsing
**Solution**:
```typescript
const sanitizeCSV = (csv: string) => {
  return csv
    .replace(/"/g, '""')  // Escape quotes
    .replace(/\r\n/g, '\n'); // Normalize line endings
};
```

### Performance Issues
**Problem**: Animations causing lag
**Solution**:
```css
/* Use transform and opacity for better performance */
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force hardware acceleration */
}
```

## 📈 Analytics and Monitoring

### Recommended Metrics
- Question completion rates
- Average time per question
- Score distributions
- Error rates and types
- User engagement patterns

### Implementation Example
```typescript
// Simple analytics tracking
const trackEvent = (event: string, data: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, data);
  }
};

// Usage in components
trackEvent('question_completed', {
  question_type: question.Type,
  score: finalScore,
  time_taken: originalTime - timeLeft,
});
```

## 🔐 Security Considerations

### Data Validation
```typescript
const validateQuestion = (question: any): question is Question => {
  return (
    typeof question.Type === 'string' &&
    typeof question.Answer === 'string' &&
    typeof question.Hint1 === 'string'
    // ... validate all fields
  );
};
```

### Content Security
- Sanitize CSV input to prevent XSS
- Validate file uploads on server side
- Use HTTPS for production deployments
- Implement proper CORS policies

---

This developer guide provides the technical foundation for extending and maintaining the Kasooti Game platform. Follow these patterns and practices to ensure consistent, maintainable code.