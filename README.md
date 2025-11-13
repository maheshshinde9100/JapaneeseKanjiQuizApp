# 漢字 Reading Quiz Application

A beautiful, interactive Japanese kanji reading practice quiz application built with vanilla HTML, Bootstrap, CSS, and JavaScript.

## Features

### Core Functionality
- **86 Kanji Characters**: Complete dataset with On'yomi and Kun'yomi readings
- **Dual Reading Practice**: Separate grids for both reading types
- **Multi-Select Answers**: Select multiple correct readings per kanji
- **Randomized Options**: Mix of correct and incorrect readings for each question
- **Real-time Validation**: Instant visual feedback on answer checking
- **Progressive Quiz Flow**: Sequential progression through the kanji set

### Interactive Design
- **Animated Background**: Floating kanji characters for aesthetic appeal
- **Color-Coded System**: 
  - Green for On'yomi readings
  - Blue for Kun'yomi readings
- **Visual Feedback States**:
  - Selected (highlighted with color)
  - Correct (green with checkmark)
  - Incorrect (red with X)
  - Missed (yellow with pulse animation)
- **Smooth Animations**: Slide-in effects, hover states, and transitions

### Score Tracking
- **Dual Scoring**: Separate scores for On'yomi and Kun'yomi
- **Total Score**: Combined accuracy percentage
- **Streak Counter**: Track consecutive perfect answers
- **Statistics Modal**: Detailed performance metrics
- **Progress Bar**: Visual representation of quiz completion

### User Experience
- **Skip Functionality**: Skip difficult kanji
- **Reset Quiz**: Start over with confirmation
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Completion Screen**: Personalized feedback based on performance
- **Selection Counters**: Real-time count of selected readings

## File Structure

```
kanji-quiz/
├── index.html          # Main HTML structure
├── styles.css          # Custom styling and animations
├── kanji-data.js       # Kanji dataset (86 characters)
├── app.js              # Quiz logic and functionality
└── README.md           # Documentation
```

## How to Use

1. **Open the Application**: Open `index.html` in any modern web browser
2. **View the Kanji**: A large kanji character is displayed in the center
3. **Select Readings**: Click on the readings you think are correct
   - Left grid: On'yomi (音読み) readings
   - Right grid: Kun'yomi (訓読み) readings
4. **Check Answers**: Click "Check Answers" to validate your selections
5. **Review Feedback**: 
   - Green = Correct selection
   - Red = Incorrect selection
   - Yellow = Missed correct answer
6. **Continue**: Click "Next Kanji" to proceed
7. **Track Progress**: Monitor your scores and streak in the dashboard
8. **View Stats**: Click "Stats" button for detailed performance metrics

## Features Breakdown

### Dashboard Cards
- **On'yomi Score**: Tracks Chinese reading accuracy
- **Kun'yomi Score**: Tracks Japanese reading accuracy
- **Total Score**: Overall performance percentage
- **Current Streak**: Consecutive perfect answers

### Interactive Elements
- **Hover Effects**: Buttons lift and glow on hover
- **Click Animations**: Smooth transitions on selection
- **Pulse Effects**: Kanji character pulses gently
- **Gradient Backgrounds**: Modern, colorful design

### Feedback System
- **Perfect Score**: Trophy emoji with congratulations
- **Good Performance**: Star emoji with encouragement
- **Needs Practice**: Supportive message with motivation

## Technologies Used

- **HTML5**: Semantic structure
- **Bootstrap 5.3**: Responsive grid and utilities
- **Font Awesome 6.4**: Icons and visual elements
- **Vanilla JavaScript**: ES6+ features, classes, and modern syntax
- **CSS3**: Custom properties, gradients, animations, and flexbox/grid

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Customization

### Adding More Kanji
Edit `kanji-data.js` and add entries in this format:
```javascript
{ kanji: '字', onyomi: ['ジ'], kunyomi: ['あざ'] }
```

### Changing Colors
Modify CSS variables in `styles.css`:
```css
:root {
    --onyomi-color: #10b981;
    --kunyomi-color: #3b82f6;
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjusting Difficulty
In `app.js`, modify the `generateOptions()` method to change the number of options per reading type.

## Performance Features

- **Smooth Animations**: Hardware-accelerated CSS transforms
- **Efficient Rendering**: Minimal DOM manipulation
- **Responsive Images**: Optimized for all screen sizes
- **Fast Loading**: No external dependencies except CDN links

## Educational Value

This quiz helps learners:
- Distinguish between On'yomi and Kun'yomi readings
- Practice multiple readings per kanji
- Build reading recognition speed
- Track learning progress over time
- Identify weak areas for focused study

## Future Enhancements

Potential additions:
- Local storage for progress persistence
- Difficulty levels (beginner, intermediate, advanced)
- Timed mode for speed practice
- Kanji meaning display
- Audio pronunciation
- Study mode with hints
- Export results to CSV

## License

Free to use for educational purposes.

## Credits

Built with ❤️ for Japanese language learners worldwide.
