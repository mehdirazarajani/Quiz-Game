# 🎯 Kasooti Game - Interactive Quiz Platform

A modern, engaging quiz platform designed for educational activities where coaches/instructors can conduct interactive sessions with students. Features a beautiful UI with animations, sound effects, and real-time scoring.

## 🌟 Features

### ✨ Core Functionality
- **Dynamic Question Management**: Load questions from CSV files with support for different categories (Personality, Place, Event)
- **Interactive Clue System**: 4 progressive clues per question with scoring that decreases as more clues are revealed
- **Real-time Timer**: Configurable countdown timer with visual and audio warnings
- **Sound Effects**: Audio feedback for different game events (correct answers, wrong answers, timer warnings)
- **Coach Controls**: Simple interface for coaches to mark answers as correct/incorrect

### 🎨 Modern UI/UX
- **Beautiful Animations**: Smooth transitions, hover effects, and engaging micro-interactions
- **Responsive Design**: Works perfectly on all screen sizes
- **Glass Morphism Effects**: Modern design with backdrop blur and transparency
- **Gradient Backgrounds**: Vibrant color schemes that adapt to question types
- **Floating Elements**: Subtle animations that bring the interface to life

### 🎮 User Experience
- **Keyboard Shortcuts**: Quick access to all functions (1-4 for clues, +/- for scoring, ESC to exit)
- **Progress Tracking**: Visual progress indicators and scoring displays
- **Category Color Coding**: Different colors for Personality (purple), Place (blue), and Event (orange) questions
- **Completion States**: Clear visual feedback for completed questions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kasooti-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/
│   ├── QuizGame.tsx          # Main game container
│   ├── QuestionListScreen.tsx # Question selection grid
│   └── QuizScreen.tsx        # Individual question interface
├── config/
│   └── constants.ts          # Game configuration
├── styles/
│   ├── globals.css          # Global styles and animations
│   └── theme.ts            # Design system and color palette
├── types.ts                # TypeScript type definitions
└── utils/
    └── soundUtils.ts       # Audio management utilities

public/
├── assets/
│   └── sounds/            # Game audio files
│       ├── beep.mp3      # General notification
│       ├── correct.mp3   # Correct answer sound
│       ├── wrong.mp3     # Wrong answer sound
│       └── tick.mp3      # Timer warning sound
└── data/
    └── questions.csv     # Question database
```

## 🔧 Configuration

### Game Settings (`src/config/constants.ts`)
```typescript
export const APP_CONFIG = {
  eventTitle: "Quiz Challenge 2024",
  instituteName: "Knowledge Institute",
  timerConfig: {
    totalSeconds: 90,        // Total time per question
    warningBeepInterval: 15, // Beep interval in normal mode
    dangerZoneSeconds: 75,   // When timer turns red and ticks
  },
  scoring: {
    firstClue: 40,          // Points for answering after 1st clue
    secondClue: 30,         // Points for answering after 2nd clue
    thirdClue: 20,          // Points for answering after 3rd clue
    fourthClue: 10,         // Points for answering after 4th clue
    defaultMark: 0,         // Points for not answering the question
    wrongPenalty: -10,      // Penalty for wrong answers
  }
};
```

### Questions Format (`public/data/questions.csv`)
```csv
Type,Answer,Hint1,Hint2,Hint3,Hint4
PERSONALITY,Albert Einstein,Known for the theory of relativity,Born in Germany in 1879,Won Nobel Prize in Physics,E = mc²
PLACE,Taj Mahal,Located in Agra,Built by Shah Jahan,Completed in 1653,Made of white marble
EVENT,Moon Landing,Happened in 1969,Neil Armstrong,Apollo 11 mission,One small step for man
```

## 🎮 How to Play

### For Coaches/Instructors:

1. **Start the Game**: Launch the application and view the question grid
2. **Select a Question**: Click on any unplayed question to begin
3. **Reveal Clues**: Use keyboard (1-4) or mouse to reveal clues progressively
4. **Monitor Students**: Watch students discuss and formulate their answers
5. **Score Answers**: Use the control buttons or keyboard (+/-) to mark correct/incorrect
6. **Track Progress**: Monitor timing, scoring, and overall game progress

### Keyboard Shortcuts:
- `1-4`: Reveal corresponding clues
- `+`: Mark answer as correct
- `-`: Mark answer as wrong
- `ESC`: Exit current question and return to grid

### For Students:
- Watch as clues are revealed progressively
- Discuss and collaborate to determine the answer
- Try to answer with fewer clues for higher points
- Learn from the interactive feedback system

## 🔊 Audio System

The game includes a comprehensive audio feedback system:

- **Notification Sounds**: Gentle beeps for clue reveals
- **Timer Audio**: Increasing urgency as time runs out
- **Feedback Sounds**: Distinct audio for correct/incorrect answers
- **Background Ambiance**: Subtle audio cues enhance immersion

## 🎨 Design System

### Color Palette
- **Primary Blue**: Questions and interactive elements
- **Purple Accent**: Personality-type questions
- **Orange Warmth**: Event-type questions
- **Green Success**: Correct answers and positive feedback
- **Red Alerts**: Timer warnings and incorrect answers

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Hierarchical Sizing**: Consistent scale from 0.75rem to 6rem
- **Weight Variations**: Light (300) to Extra Bold (800)

### Animations
- **Smooth Transitions**: 300ms cubic-bezier easing
- **Hover Effects**: Subtle scale and shadow transformations
- **Loading States**: Engaging spinner animations
- **Micro-interactions**: Delightful feedback for user actions

## 🛠 Customization

### Adding New Questions
1. Edit `public/data/questions.csv`
2. Follow the CSV format: `Type,Answer,Hint1,Hint2,Hint3,Hint4`
3. Use consistent Types: PERSONALITY, PLACE, EVENT (or add new ones)
4. Reload the application to see new questions

### Modifying Themes
1. Edit `src/styles/theme.ts` for color schemes
2. Modify `src/styles/globals.css` for animations
3. Update component styles in respective `.tsx` files

### Audio Customization
1. Replace audio files in `public/assets/sounds/`
2. Maintain the same file names and formats (.mp3)
3. Adjust volume and timing in `src/utils/soundUtils.ts`

## 🌐 Deployment

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Configure build settings (Next.js preset)
3. Deploy automatically on push

### Deploy to Other Platforms
- **Netlify**: Use the Next.js build adapter
- **AWS/Azure**: Configure for static hosting
- **Docker**: Create containerized deployments

## 📱 Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support with minor audio limitations
- **Edge**: Full support
- **Mobile**: Responsive design works on all mobile browsers

## 🐛 Troubleshooting

### Common Issues

**Audio not playing:**
- Check browser audio permissions
- Ensure audio files exist in `/public/assets/sounds/`
- Try user interaction before audio plays (browser requirement)

**Questions not loading:**
- Verify CSV file format and location
- Check for special characters in CSV data
- Ensure proper encoding (UTF-8)

**Timer not working:**
- Check JavaScript is enabled
- Verify no browser extensions are interfering
- Clear browser cache and reload

### Performance Tips
- Use modern browsers for best performance
- Ensure stable internet connection for audio loading
- Close unnecessary browser tabs during gameplay

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add TypeScript types for new features
- Test all functionality before submitting
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide React**: For the beautiful icon library
- **Google Fonts**: For the Poppins font family
- **Vercel**: For hosting and deployment solutions

## 📞 Support

For questions, issues, or suggestions:

- **Create an Issue**: Use the GitHub issue tracker
- **Documentation**: Check this README for detailed information
- **Community**: Join discussions in the project repository

---

**Made with ❤️ for interactive learning and engagement**

*Transform your quiz sessions into engaging, interactive experiences that students will love and remember!*