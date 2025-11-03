// Karaoke page specific JavaScript

class KaraokePlayer {
    constructor() {
        this.currentSong = null;
        this.isPlaying = false;
        this.currentLineIndex = 0;
        this.currentWordIndex = 0;
        this.timeouts = [];
        this.startTime = null;
        this.transpose = 0;
        
        this.songs = {
            'lyrics-song': {
                title: 'Bài Hát Có Lời',
                lyrics: [
                    "Yên bình có quá đắt không?",
                    "Mà sao? cơn giông vội vã kéo đến",
                    "Phủ kín nát lòng, ngơ ngác",
                    "Choáng váng vì linh hồn ta",
                    "Dường như hiếu động",
                    "Về một thế giới mang tên cầu vồng",
                    "Dòng thời gian lặng im",
                    "Thờ ơ về ngôi nhà ta",
                    "Muốn thu mình trong màn đêm",
                    "Bao nhiêu là thêm là bớt",
                    "Cho nỗi niềm găm sâu vào tim",
                    "Bình yên ơi sao lại khó tìm?"
                ],
                delays: [
                    [200, 300, 300, 200, 200, 700],
                    [500, 500, 200, 450, 200, 200, 200, 200],
                    [200, 200, 200, 1200, 200, 800],
                    [400, 300, 300, 200, 200, 200],
                    [200, 200, 200, 600],
                    [350, 500, 400, 600, 400, 400, 800, 3000],
                    [700, 700, 800, 200, 800],
                    [300, 200, 200, 200, 200, 700],
                    [300, 400, 200, 400, 400, 800],
                    [200, 400, 200, 400, 200, 200],
                    [200, 200, 300, 200, 200, 200, 800],
                    [600, 500, 500, 500, 500, 500, 200]
                ],
                notes: [
                    ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
                    ['A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'C4'],
                    ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
                    ['A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
                    ['C4', 'D4', 'E4', 'F4'],
                    ['G4', 'A4', 'B4', 'C5', 'B4', 'A4', 'G4', 'F4'],
                    ['E4', 'F4', 'G4', 'A4', 'G4'],
                    ['F4', 'E4', 'D4', 'C4', 'B3', 'C4'],
                    ['D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
                    ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
                    ['A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3'],
                    ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
                ]
            },
            'twinkle': {
                title: 'Twinkle Twinkle Little Star',
                lyrics: [
                    "Twinkle twinkle little star",
                    "How I wonder what you are",
                    "Up above the world so high",
                    "Like a diamond in the sky",
                    "Twinkle twinkle little star",
                    "How I wonder what you are"
                ],
                delays: [
                    [500, 500, 500, 500, 500, 500, 1000],
                    [500, 500, 500, 500, 500, 500, 1000],
                    [500, 500, 500, 500, 500, 500, 1000],
                    [500, 500, 500, 500, 500, 500, 1000],
                    [500, 500, 500, 500, 500, 500, 1000],
                    [500, 500, 500, 500, 500, 500, 1000]
                ],
                notes: [
                    ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
                    ['F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
                    ['G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
                    ['G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
                    ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
                    ['F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
                ]
            },
            'happy': {
                title: 'Happy Birthday',
                lyrics: [
                    "Happy birthday to you",
                    "Happy birthday to you",
                    "Happy birthday dear friend",
                    "Happy birthday to you"
                ],
                delays: [
                    [400, 400, 800, 400],
                    [400, 400, 800, 400],
                    [400, 400, 400, 800],
                    [400, 400, 800, 400]
                ],
                notes: [
                    ['C4', 'C4', 'D4', 'C4'],
                    ['C4', 'C4', 'D4', 'C4'],
                    ['C4', 'C4', 'F4', 'E4'],
                    ['C4', 'C4', 'D4', 'C4']
                ]
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSongSelector();
    }

    setupEventListeners() {
        // Control buttons
        const playBtn = document.getElementById('playKaraokeBtn');
        const pauseBtn = document.getElementById('pauseKaraokeBtn');
        const stopBtn = document.getElementById('stopKaraokeBtn');
        const resetBtn = document.getElementById('resetKaraokeBtn');
        const transposeUp = document.getElementById('transposeUp');
        const transposeDown = document.getElementById('transposeDown');
        const transposeValue = document.getElementById('transposeValue');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.play());
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stop());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        const updateTransposeUI = () => { if (transposeValue) transposeValue.textContent = String(this.transpose); };
        updateTransposeUI();
        if (transposeUp) {
            transposeUp.addEventListener('click', () => { this.transpose = Math.min(12, this.transpose + 1); updateTransposeUI(); });
        }
        if (transposeDown) {
            transposeDown.addEventListener('click', () => { this.transpose = Math.max(-12, this.transpose - 1); updateTransposeUI(); });
        }
    }

    setupSongSelector() {
        document.querySelectorAll('.song-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const songId = e.target.getAttribute('data-song');
                this.selectSong(songId);
            });
        });
    }

    selectSong(songId) {
        if (!this.songs[songId]) {
            window.PianoUtils.showNotification('Bài hát không tồn tại', 'error');
            return;
        }

        // Update active button
        document.querySelectorAll('.song-option').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-song="${songId}"]`).classList.add('active');

        this.currentSong = this.songs[songId];
        this.currentLineIndex = 0;
        this.currentWordIndex = 0;
        this.isPlaying = false;
        
        this.displayLyrics();
        this.updateControls();
        
        window.PianoUtils.showNotification(`Đã chọn: ${this.currentSong.title}`, 'success');
    }

    displayLyrics() {
        const container = document.getElementById('lyricsContainer');
        if (!container || !this.currentSong) return;

        container.innerHTML = '';
        
        this.currentSong.lyrics.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'lyrics-line';
            lineElement.textContent = line;
            lineElement.id = `line-${index}`;
            container.appendChild(lineElement);
        });
    }

    play() {
        if (!this.currentSong) {
            window.PianoUtils.showNotification('Vui lòng chọn một bài hát', 'error');
            return;
        }

        if (this.isPlaying) return;

        this.isPlaying = true;
        this.startTime = Date.now();
        this.updateControls();
        this.startKaraoke();
    }

    pause() {
        this.isPlaying = false;
        this.updateControls();
        
        // Clear all timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
    }

    stop() {
        this.pause();
        this.currentLineIndex = 0;
        this.currentWordIndex = 0;
        this.resetLyricsDisplay();
        this.updateProgress();
    }

    reset() {
        this.stop();
        this.displayLyrics();
    }

    startKaraoke() {
        this.displayLine(0);
    }

    displayLine(lineIndex) {
        if (!this.isPlaying || lineIndex >= this.currentSong.lyrics.length) {
            this.isPlaying = false;
            this.updateControls();
            return;
        }

        const lineElement = document.getElementById(`line-${lineIndex}`);
        if (lineElement) {
            lineElement.classList.add('active');
        }

        // Play piano notes for this line
        this.playLineNotes(lineIndex);

        // Move to next line after delay
        const totalDelay = this.currentSong.delays[lineIndex].reduce((sum, delay) => sum + delay, 0);
        const timeout = setTimeout(() => {
            if (lineElement) {
                lineElement.classList.remove('active');
                lineElement.classList.add('completed');
            }
            this.currentLineIndex = lineIndex + 1;
            this.updateProgress();
            this.displayLine(lineIndex + 1);
        }, totalDelay);
        
        this.timeouts.push(timeout);
    }

    playLineNotes(lineIndex) {
        const notes = this.currentSong.notes[lineIndex];
        const delays = this.currentSong.delays[lineIndex];
        
        if (!notes || !delays) return;

        let currentDelay = 0;
        notes.forEach((note, noteIndex) => {
            const timeout = setTimeout(() => {
                this.playNote(this.transposeNote(note, this.transpose));
            }, currentDelay);
            
            this.timeouts.push(timeout);
            currentDelay += delays[noteIndex] || 500;
        });
    }

    playNote(note) {
        const audio = document.querySelector(`audio[data-note="${note}"]`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }

        // Highlight key
        const key = document.querySelector(`.key[data-note="${note}"]`);
        if (key) {
            key.classList.add('active');
            setTimeout(() => {
                key.classList.remove('active');
            }, 200);
        }
    }

    transposeNote(note, semitones) {
        if (!semitones) return note;
        const m = note.match(/^([A-G])(#?)(\d)$/);
        if (!m) return note;
        const base = m[1];
        const sharp = m[2] === '#';
        let octave = parseInt(m[3], 10);
        const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
        let idx = names.indexOf(base + (sharp ? '#' : ''));
        if (idx < 0) return note;
        let midi = (octave + 1) * 12 + idx; // MIDI mapping
        midi += semitones;
        const newOct = Math.floor(midi / 12) - 1;
        const newIdx = ((midi % 12) + 12) % 12;
        const newName = names[newIdx] + String(newOct);
        return newName;
    }

    resetLyricsDisplay() {
        document.querySelectorAll('.lyrics-line').forEach(line => {
            line.classList.remove('active', 'completed');
        });
    }

    updateControls() {
        const playBtn = document.getElementById('playKaraokeBtn');
        const pauseBtn = document.getElementById('pauseKaraokeBtn');
        const stopBtn = document.getElementById('stopKaraokeBtn');

        if (playBtn) {
            playBtn.disabled = this.isPlaying || !this.currentSong;
        }
        
        if (pauseBtn) {
            pauseBtn.disabled = !this.isPlaying;
        }
        
        if (stopBtn) {
            stopBtn.disabled = !this.isPlaying && this.currentLineIndex === 0;
        }
    }

    updateProgress() {
        if (!this.currentSong) return;

        const progress = document.getElementById('karaokeProgress');
        const currentTime = document.getElementById('karaokeCurrentTime');
        const totalTime = document.getElementById('karaokeTotalTime');
        
        if (progress) {
            const percentage = (this.currentLineIndex / this.currentSong.lyrics.length) * 100;
            progress.style.width = `${percentage}%`;
        }

        if (currentTime && totalTime) {
            const current = this.currentLineIndex * 2000; // Approximate time per line
            const total = this.currentSong.lyrics.length * 2000;
            
            currentTime.textContent = window.PianoUtils.formatTime(current / 1000);
            totalTime.textContent = window.PianoUtils.formatTime(total / 1000);
        }
    }
}

// Initialize karaoke player when page loads
document.addEventListener('DOMContentLoaded', function() {
    new KaraokePlayer();
});
