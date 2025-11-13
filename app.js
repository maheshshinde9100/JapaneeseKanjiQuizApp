class KanjiQuiz {
    constructor() {
        this.kanjiList = [...kanjiData];
        this.currentIndex = 0;
        this.onyomiScore = 0;
        this.kunyomiScore = 0;
        this.onyomiTotal = 0;
        this.kunyomiTotal = 0;
        this.selectedOnyomi = new Set();
        this.selectedKunyomi = new Set();
        this.isChecked = false;
        this.currentStreak = 0;
        this.bestStreak = 0;

        this.initElements();
        this.attachEventListeners();
        this.loadKanji();
    }

    initElements() {
        this.kanjiChar = document.getElementById('kanjiChar');
        this.onyomiGrid = document.getElementById('onyomiGrid');
        this.kunyomiGrid = document.getElementById('kunyomiGrid');
        this.checkBtn = document.getElementById('checkBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.statsBtn = document.getElementById('statsBtn');
        this.onyomiScoreEl = document.getElementById('onyomiScore');
        this.kunyomiScoreEl = document.getElementById('kunyomiScore');
        this.onyomiTotalEl = document.getElementById('onyomiTotal');
        this.kunyomiTotalEl = document.getElementById('kunyomiTotal');
        this.onyomiPercentEl = document.getElementById('onyomiPercent');
        this.kunyomiPercentEl = document.getElementById('kunyomiPercent');
        this.totalScoreEl = document.getElementById('totalScore');
        this.totalPercentEl = document.getElementById('totalPercent');
        this.streakValueEl = document.getElementById('streakValue');
        this.currentKanjiEl = document.getElementById('currentKanji');
        this.totalKanjiEl = document.getElementById('totalKanji');
        this.progressBar = document.getElementById('progressBar');
        this.progressPercentEl = document.getElementById('progressPercent');
        this.kanjiNumberEl = document.getElementById('kanjiNumber');
        this.onyomiSelectedEl = document.getElementById('onyomiSelected');
        this.kunyomiSelectedEl = document.getElementById('kunyomiSelected');
        this.resultFeedback = document.getElementById('resultFeedback');
        this.feedbackIcon = document.getElementById('feedbackIcon');
        this.feedbackMessage = document.getElementById('feedbackMessage');
    }

    attachEventListeners() {
        this.checkBtn.addEventListener('click', () => this.checkAnswers());
        this.nextBtn.addEventListener('click', () => this.nextKanji());
        this.nextQuestionBtn.addEventListener('click', () => this.nextKanji());
        this.skipBtn.addEventListener('click', () => this.skipKanji());
        this.resetBtn.addEventListener('click', () => this.resetQuiz());
        this.statsBtn.addEventListener('click', () => this.updateStatsModal());
    }

    loadKanji() {
        if (this.currentIndex >= this.kanjiList.length) {
            this.showCompletion();
            return;
        }

        const current = this.kanjiList[this.currentIndex];
        this.kanjiChar.textContent = current.kanji;

        this.selectedOnyomi.clear();
        this.selectedKunyomi.clear();
        this.isChecked = false;

        this.renderReadingOptions('onyomi', current.onyomi);
        this.renderReadingOptions('kunyomi', current.kunyomi);

        this.checkBtn.style.display = 'inline-flex';
        this.nextBtn.style.display = 'none';
        this.skipBtn.style.display = 'inline-flex';
        this.resultFeedback.style.display = 'none';

        this.updateProgress();
        this.updateSelectionCounters();
        this.kanjiNumberEl.textContent = this.currentIndex + 1;

        // Add entrance animation
        this.kanjiChar.style.animation = 'none';
        setTimeout(() => {
            this.kanjiChar.style.animation = 'kanjiPulse 2s ease-in-out infinite';
        }, 10);
    }

    renderReadingOptions(type, correctReadings) {
        const grid = type === 'onyomi' ? this.onyomiGrid : this.kunyomiGrid;
        grid.innerHTML = '';

        const allReadings = this.getAllReadings(type);
        const options = this.generateOptions(correctReadings, allReadings, 6);

        options.forEach(reading => {
            const btn = document.createElement('button');
            btn.className = `reading-btn ${type}`;
            btn.textContent = reading;
            btn.dataset.reading = reading;
            btn.dataset.type = type;

            // Add both click and touch events for better mobile support
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSelection(btn, type, reading);
            });

            // Prevent double-tap zoom on mobile
            let touchTimeout;
            btn.addEventListener('touchstart', (e) => {
                clearTimeout(touchTimeout);
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                touchTimeout = setTimeout(() => {
                    this.toggleSelection(btn, type, reading);
                }, 10);
            });

            grid.appendChild(btn);
        });
    }

    getAllReadings(type) {
        const readings = new Set();
        this.kanjiList.forEach(item => {
            const list = type === 'onyomi' ? item.onyomi : item.kunyomi;
            list.forEach(r => readings.add(r));
        });
        return Array.from(readings);
    }

    generateOptions(correct, allOptions, count) {
        const options = new Set(correct);
        const available = allOptions.filter(r => !correct.includes(r));

        while (options.size < count && available.length > 0) {
            const randomIndex = Math.floor(Math.random() * available.length);
            options.add(available[randomIndex]);
            available.splice(randomIndex, 1);
        }

        return this.shuffleArray(Array.from(options));
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    toggleSelection(btn, type, reading) {
        if (this.isChecked) return;

        const selectedSet = type === 'onyomi' ? this.selectedOnyomi : this.selectedKunyomi;
        const current = this.kanjiList[this.currentIndex];
        const correctReadings = type === 'onyomi' ? current.onyomi : current.kunyomi;
        const isCorrectReading = correctReadings.includes(reading);

        if (selectedSet.has(reading)) {
            selectedSet.delete(reading);
            btn.classList.remove('selected');
            btn.classList.remove('preview-correct');
            btn.classList.remove('preview-incorrect');
        } else {
            selectedSet.add(reading);
            btn.classList.add('selected');

            // Add immediate visual feedback
            if (isCorrectReading) {
                btn.classList.add('preview-correct');
                btn.classList.remove('preview-incorrect');
            } else {
                btn.classList.add('preview-incorrect');
                btn.classList.remove('preview-correct');
            }
        }

        this.updateSelectionCounters();
    }

    updateSelectionCounters() {
        this.onyomiSelectedEl.textContent = this.selectedOnyomi.size;
        this.kunyomiSelectedEl.textContent = this.selectedKunyomi.size;
    }

    checkAnswers() {
        if (this.isChecked) return;

        this.isChecked = true;
        const current = this.kanjiList[this.currentIndex];

        const onyomiCorrect = this.checkReadingType('onyomi', current.onyomi);
        const kunyomiCorrect = this.checkReadingType('kunyomi', current.kunyomi);

        this.updateScores();
        this.showFeedback(onyomiCorrect, kunyomiCorrect, current);

        // Update streak
        if (onyomiCorrect === current.onyomi.length && kunyomiCorrect === current.kunyomi.length) {
            this.currentStreak++;
            if (this.currentStreak > this.bestStreak) {
                this.bestStreak = this.currentStreak;
            }
        } else {
            this.currentStreak = 0;
        }

        this.streakValueEl.textContent = this.currentStreak;

        this.checkBtn.style.display = 'none';
        this.nextBtn.style.display = 'inline-flex';
        this.skipBtn.style.display = 'none';
    }

    checkReadingType(type, correctReadings) {
        const grid = type === 'onyomi' ? this.onyomiGrid : this.kunyomiGrid;
        const selected = type === 'onyomi' ? this.selectedOnyomi : this.selectedKunyomi;
        const buttons = grid.querySelectorAll('.reading-btn');

        let correctCount = 0;
        const correctSet = new Set(correctReadings);

        buttons.forEach(btn => {
            const reading = btn.dataset.reading;
            const isCorrect = correctSet.has(reading);
            const isSelected = selected.has(reading);

            btn.disabled = true;

            // Clear preview classes
            btn.classList.remove('preview-correct', 'preview-incorrect');

            if (isSelected && isCorrect) {
                btn.classList.add('correct');
                correctCount++;
            } else if (isSelected && !isCorrect) {
                btn.classList.add('incorrect');
            } else if (!isSelected && isCorrect) {
                btn.classList.add('missed');
            }
        });

        if (type === 'onyomi') {
            this.onyomiTotal += correctReadings.length;
            this.onyomiScore += correctCount;
        } else {
            this.kunyomiTotal += correctReadings.length;
            this.kunyomiScore += correctCount;
        }

        return correctCount;
    }

    showFeedback(onyomiCorrect, kunyomiCorrect, current) {
        const totalCorrect = onyomiCorrect + kunyomiCorrect;
        const totalPossible = current.onyomi.length + current.kunyomi.length;
        const percentage = Math.round((totalCorrect / totalPossible) * 100);

        this.resultFeedback.style.display = 'block';

        if (totalCorrect === totalPossible) {
            this.resultFeedback.className = 'result-feedback feedback-success';
            this.feedbackIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            this.feedbackMessage.textContent = `Perfect! ${totalCorrect}/${totalPossible} correct (${percentage}%)`;
        } else if (percentage >= 50) {
            this.resultFeedback.className = 'result-feedback feedback-partial';
            this.feedbackIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            this.feedbackMessage.textContent = `Good try! ${totalCorrect}/${totalPossible} correct (${percentage}%)`;
        } else {
            this.resultFeedback.className = 'result-feedback feedback-fail';
            this.feedbackIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            this.feedbackMessage.textContent = `Keep practicing! ${totalCorrect}/${totalPossible} correct (${percentage}%)`;
        }
    }

    updateScores() {
        this.onyomiScoreEl.textContent = this.onyomiScore;
        this.onyomiTotalEl.textContent = this.onyomiTotal;
        this.kunyomiScoreEl.textContent = this.kunyomiScore;
        this.kunyomiTotalEl.textContent = this.kunyomiTotal;

        // Update percentages
        const onyomiPercent = this.onyomiTotal > 0 ? Math.round((this.onyomiScore / this.onyomiTotal) * 100) : 0;
        const kunyomiPercent = this.kunyomiTotal > 0 ? Math.round((this.kunyomiScore / this.kunyomiTotal) * 100) : 0;
        const totalScore = this.onyomiScore + this.kunyomiScore;
        const totalPossible = this.onyomiTotal + this.kunyomiTotal;
        const totalPercent = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

        this.onyomiPercentEl.textContent = onyomiPercent + '%';
        this.kunyomiPercentEl.textContent = kunyomiPercent + '%';
        this.totalScoreEl.textContent = `${totalScore}/${totalPossible}`;
        this.totalPercentEl.textContent = totalPercent + '%';
    }

    updateProgress() {
        this.currentKanjiEl.textContent = this.currentIndex + 1;
        this.totalKanjiEl.textContent = this.kanjiList.length;

        const percentage = ((this.currentIndex + 1) / this.kanjiList.length) * 100;
        this.progressBar.style.width = percentage + '%';
        this.progressPercentEl.textContent = Math.round(percentage) + '%';
    }

    skipKanji() {
        if (this.isChecked) return;

        this.currentStreak = 0;
        this.streakValueEl.textContent = this.currentStreak;
        this.nextKanji();
    }

    nextKanji() {
        this.currentIndex++;
        this.loadKanji();
    }

    resetQuiz() {
        if (!confirm('Are you sure you want to reset the quiz? All progress will be lost.')) {
            return;
        }

        this.currentIndex = 0;
        this.onyomiScore = 0;
        this.kunyomiScore = 0;
        this.onyomiTotal = 0;
        this.kunyomiTotal = 0;
        this.currentStreak = 0;
        this.selectedOnyomi.clear();
        this.selectedKunyomi.clear();
        this.isChecked = false;

        this.updateScores();
        this.streakValueEl.textContent = this.currentStreak;
        this.loadKanji();
    }

    updateStatsModal() {
        const totalScore = this.onyomiScore + this.kunyomiScore;
        const totalPossible = this.onyomiTotal + this.kunyomiTotal;
        const overallAccuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
        const onyomiAccuracy = this.onyomiTotal > 0 ? Math.round((this.onyomiScore / this.onyomiTotal) * 100) : 0;
        const kunyomiAccuracy = this.kunyomiTotal > 0 ? Math.round((this.kunyomiScore / this.kunyomiTotal) * 100) : 0;

        document.getElementById('modalKanjiCompleted').textContent = this.currentIndex;
        document.getElementById('modalAccuracy').textContent = overallAccuracy + '%';
        document.getElementById('modalBestStreak').textContent = this.bestStreak;
        document.getElementById('modalOnyomiAcc').textContent = onyomiAccuracy + '%';
        document.getElementById('modalKunyomiAcc').textContent = kunyomiAccuracy + '%';
    }

    showCompletion() {
        const totalScore = this.onyomiScore + this.kunyomiScore;
        const totalPossible = this.onyomiTotal + this.kunyomiTotal;
        const percentage = Math.round((totalScore / totalPossible) * 100);

        this.kanjiChar.textContent = '完了';

        let message = '';
        let emoji = '';
        if (percentage >= 90) {
            message = 'Outstanding! You\'re a Kanji master!';
            emoji = '🏆';
        } else if (percentage >= 75) {
            message = 'Excellent work! Keep it up!';
            emoji = '⭐';
        } else if (percentage >= 60) {
            message = 'Good job! Practice makes perfect!';
            emoji = '👍';
        } else {
            message = 'Keep practicing! You\'ll get better!';
            emoji = '💪';
        }

        this.onyomiGrid.innerHTML = `
            <div class="text-center p-4">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${emoji}</div>
                <h3 style="color: #667eea; margin-bottom: 1rem;">Quiz Complete!</h3>
                <p style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                    ${totalScore} / ${totalPossible}
                </p>
                <p style="font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); 
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">
                    ${percentage}%
                </p>
                <p style="color: #6b7280; font-size: 1.1rem;">${message}</p>
            </div>
        `;

        this.kunyomiGrid.innerHTML = `
            <div class="text-center p-4">
                <h4 style="color: #1f2937; margin-bottom: 1.5rem;">Your Stats</h4>
                <div style="text-align: left; max-width: 300px; margin: 0 auto;">
                    <p style="margin-bottom: 0.75rem;"><strong>Best Streak:</strong> ${this.bestStreak} perfect answers</p>
                    <p style="margin-bottom: 0.75rem;"><strong>On'yomi Accuracy:</strong> ${Math.round((this.onyomiScore / this.onyomiTotal) * 100)}%</p>
                    <p style="margin-bottom: 0.75rem;"><strong>Kun'yomi Accuracy:</strong> ${Math.round((this.kunyomiScore / this.kunyomiTotal) * 100)}%</p>
                </div>
                <button class="btn btn-primary mt-3" onclick="location.reload()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;

        this.checkBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
        this.skipBtn.style.display = 'none';
        this.resultFeedback.style.display = 'none';
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KanjiQuiz();
});
