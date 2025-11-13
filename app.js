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
        this.resetBtn = document.getElementById('resetBtn');
        this.onyomiScoreEl = document.getElementById('onyomiScore');
        this.kunyomiScoreEl = document.getElementById('kunyomiScore');
        this.onyomiTotalEl = document.getElementById('onyomiTotal');
        this.kunyomiTotalEl = document.getElementById('kunyomiTotal');
        this.currentKanjiEl = document.getElementById('currentKanji');
        this.totalKanjiEl = document.getElementById('totalKanji');
        this.progressBar = document.getElementById('progressBar');
    }
    
    attachEventListeners() {
        this.checkBtn.addEventListener('click', () => this.checkAnswers());
        this.nextBtn.addEventListener('click', () => this.nextKanji());
        this.resetBtn.addEventListener('click', () => this.resetQuiz());
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
        
        this.checkBtn.style.display = 'inline-block';
        this.nextBtn.style.display = 'none';
        
        this.updateProgress();
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
            
            btn.addEventListener('click', () => this.toggleSelection(btn, type, reading));
            
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
        
        if (selectedSet.has(reading)) {
            selectedSet.delete(reading);
            btn.classList.remove('selected');
        } else {
            selectedSet.add(reading);
            btn.classList.add('selected');
        }
    }
    
    checkAnswers() {
        if (this.isChecked) return;
        
        this.isChecked = true;
        const current = this.kanjiList[this.currentIndex];
        
        this.checkReadingType('onyomi', current.onyomi);
        this.checkReadingType('kunyomi', current.kunyomi);
        
        this.updateScores();
        
        this.checkBtn.style.display = 'none';
        this.nextBtn.style.display = 'inline-block';
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
    }
    
    updateScores() {
        this.onyomiScoreEl.textContent = this.onyomiScore;
        this.onyomiTotalEl.textContent = this.onyomiTotal;
        this.kunyomiScoreEl.textContent = this.kunyomiScore;
        this.kunyomiTotalEl.textContent = this.kunyomiTotal;
    }
    
    updateProgress() {
        this.currentKanjiEl.textContent = this.currentIndex + 1;
        this.totalKanjiEl.textContent = this.kanjiList.length;
        
        const percentage = ((this.currentIndex + 1) / this.kanjiList.length) * 100;
        this.progressBar.style.width = percentage + '%';
    }
    
    nextKanji() {
        this.currentIndex++;
        this.loadKanji();
    }
    
    resetQuiz() {
        this.currentIndex = 0;
        this.onyomiScore = 0;
        this.kunyomiScore = 0;
        this.onyomiTotal = 0;
        this.kunyomiTotal = 0;
        this.selectedOnyomi.clear();
        this.selectedKunyomi.clear();
        this.isChecked = false;
        
        this.updateScores();
        this.loadKanji();
    }
    
    showCompletion() {
        const totalScore = this.onyomiScore + this.kunyomiScore;
        const totalPossible = this.onyomiTotal + this.kunyomiTotal;
        const percentage = Math.round((totalScore / totalPossible) * 100);
        
        this.kanjiChar.textContent = '完了';
        this.onyomiGrid.innerHTML = `<div class="text-center p-4"><h4>Quiz Complete!</h4><p>Final Score: ${totalScore} / ${totalPossible} (${percentage}%)</p></div>`;
        this.kunyomiGrid.innerHTML = `<div class="text-center p-4"><p>Great job! Click "Reset Quiz" to try again.</p></div>`;
        
        this.checkBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KanjiQuiz();
});
