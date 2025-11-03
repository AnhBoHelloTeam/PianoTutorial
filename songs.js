// Songs page specific JavaScript

class SongPlayer {
    constructor() {
        this.currentSong = null;
        this.isPlaying = false;
        this.currentNoteIndex = 0;
        this.playbackSpeed = 1;
        this.timeouts = [];
        this.tutorMode = false;
        this.correctCount = 0;
        this.totalNotes = 0;
        
        this.songs = {
            'twinkle': {
                title: 'Twinkle Twinkle Little Star',
                notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
                delays: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500]
            },
            'happy': {
                title: 'Happy Birthday',
                notes: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4'],
                delays: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400]
            },
            'mary': {
                title: 'Mary Had a Little Lamb',
                notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'D4', 'D4', 'D4', 'E4', 'G4', 'G4'],
                delays: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800]
            },
            'fur-elise': {
                title: 'Für Elise',
                notes: ['E5', 'D#5', 'E5', 'D#5', 'E5', 'B4', 'D5', 'C5', 'A4', 'C4', 'E4', 'A4', 'B4', 'E4', 'G#4', 'B4', 'C5'],
                delays: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800]
            },
            // Các giai điệu rút gọn, phục vụ học tập (không phải bản đầy đủ)
            'lac-troi': {
                title: 'Lạc Trôi (melody rút gọn)',
                notes: ['E4','G4','A4','G4','E4','D4','E4','G4','A4','B4','A4','G4','E4','D4','E4','G4','A4','G4'],
                delays: [0,400,800,1200,1600,2000,2400,2800,3200,3600,4000,4400,4800,5200,5600,6000,6400,7000]
            },
            'hay-trao-cho-anh': {
                title: 'Hãy Trao Cho Anh (melody rút gọn)',
                notes: ['C4','E4','G4','A4','G4','E4','D4','E4','G4','A4','C5','A4','G4','E4','D4','C4'],
                delays: [0,350,700,1050,1400,1750,2100,2450,2800,3150,3500,3850,4200,4550,4900,5400]
            },
            'chung-ta-cua-hien-tai': {
                title: 'Chúng Ta Của Hiện Tại (melody rút gọn)',
                notes: ['D4','F#4','G4','A4','G4','F#4','E4','D4','E4','F#4','G4','A4','B4','A4','G4'],
                delays: [0,400,800,1200,1600,2000,2400,2800,3200,3600,4000,4400,4800,5200,5800]
            },
            'long-song': {
                title: 'Bài Hát Dài (Từ file có sẵn)',
                notes: [
                    "C5", "B4", "C5", "D5", "C5", "A5", "C5", "B4", "C5", "D5", "C5", "G5", "C5", "B4", "C5", "D5", "C5", "F5",
                    "F5", "E5", "F5", "E5", "D5", "C5", "F5", "E5", "C5", "B4", "C5", "D5", "C5", "A5", "C5", "B4", "C5", "D5", 
                    "C5", "G5", "C5", "B4", "C5", "D5", "C5", "F5", "F5", "E5", "F5", "E5", "D5", "C5", "D5", "C5"
                ],
                delays: [
                    0, 350, 900, 1200, 1700, 2433, 4266, 4550, 5000, 5300, 5800, 6600, 8533, 8866, 9350, 9650, 10150, 10666, 
                    11733, 12466, 12733, 13150, 13450, 13900, 14433, 15233, 16600, 16900, 17500, 17800, 18300, 19033, 20500, 
                    20833, 21266, 21600, 22133, 22933, 24466, 24766, 25266, 25533, 26066, 26866, 27766, 28553, 28800, 29300, 
                    29550, 30000, 30750, 31550
                ]
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSongCards();
    }

    setupEventListeners() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        // Stop button
        const stopBtn = document.getElementById('stopBtn');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stop());
        }

        // Speed controls
        const slowBtn = document.getElementById('slowBtn');
        if (slowBtn) {
            slowBtn.addEventListener('click', () => this.setSpeed(0.5));
        }

        const normalBtn = document.getElementById('normalBtn');
        if (normalBtn) {
            normalBtn.addEventListener('click', () => this.setSpeed(1));
        }

        // Close player
        const closePlayer = document.getElementById('closePlayer');
        if (closePlayer) {
            closePlayer.addEventListener('click', () => this.closePlayer());
        }

        const tutorToggle = document.getElementById('tutorModeToggle');
        if (tutorToggle) {
            tutorToggle.addEventListener('change', (e) => {
                this.tutorMode = !!e.target.checked;
                window.PianoUtils?.showNotification?.(this.tutorMode ? 'Tutor mode: ON' : 'Tutor mode: OFF', this.tutorMode ? 'success' : 'info');
            });
        }

        // Listen to user-played notes from global piano handlers
        window.addEventListener('user-played-note', (ev) => {
            if (!this.tutorMode || !this.currentSong || !this.isPlaying) return;
            const played = ev.detail?.note;
            const expected = this.currentSong.notes[this.currentNoteIndex];
            if (!expected) return;
            if (played === expected) {
                this.correctCount++;
                this.currentNoteIndex++;
                this.updateProgress();
                this.updateCurrentNote(played);
                this.updateNextNote(this.currentNoteIndex);
                if (this.currentNoteIndex >= this.currentSong.notes.length) {
                    this.finishTutor();
                }
            } else {
                // brief visual feedback
                window.PianoUtils?.showNotification?.(`Sai nốt: ${played}. Kỳ vọng: ${expected}`, 'error');
            }
        });
    }

    setupSongCards() {
        document.querySelectorAll('.play-song-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const songId = e.target.closest('.song-card').getAttribute('data-song');
                this.loadSong(songId);
            });
        });
    }

    loadSong(songId) {
        if (!this.songs[songId]) {
            window.PianoUtils.showNotification('Bài hát không tồn tại', 'error');
            return;
        }

        this.currentSong = this.songs[songId];
        this.currentNoteIndex = 0;
        this.isPlaying = false;
        this.correctCount = 0;
        this.totalNotes = this.currentSong.notes.length;
        
        // Show player
        const player = document.getElementById('songPlayer');
        if (player) {
            player.style.display = 'block';
        }

        // Update title
        const title = document.getElementById('currentSongTitle');
        if (title) {
            title.textContent = `Đang chơi: ${this.currentSong.title}`;
        }

        // Update progress
        this.updateProgress();
        
        window.PianoUtils.showNotification(`Đã tải bài: ${this.currentSong.title}`, 'success');
    }

    togglePlayPause() {
        if (!this.currentSong) {
            window.PianoUtils.showNotification('Vui lòng chọn một bài hát', 'error');
            return;
        }

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.currentSong) return;

        this.isPlaying = true;
        this.updatePlayButton();

        if (this.tutorMode) {
            // Tutor: chờ người chơi bấm đúng từng nốt, không dùng timeouts
            this.updateCurrentNote('-');
            this.updateNextNote(this.currentNoteIndex);
            window.PianoUtils?.showNotification?.('Tutor mode: hãy bấm nốt tiếp theo đúng thứ tự', 'info');
            return;
        }

        // Auto-play: theo delays
        this.currentSong.notes.forEach((note, index) => {
            if (index >= this.currentNoteIndex) {
                const delay = this.currentSong.delays[index] / this.playbackSpeed;
                const timeout = setTimeout(() => {
                    this.playNote(note);
                    this.currentNoteIndex = index + 1;
                    this.updateProgress();
                    this.updateCurrentNote(note);
                    this.updateNextNote(index + 1);
                }, delay);
                this.timeouts.push(timeout);
            }
        });

        const totalDuration = Math.max(...this.currentSong.delays) / this.playbackSpeed;
        const endTimeout = setTimeout(() => {
            this.stop();
        }, totalDuration + 1000);
        this.timeouts.push(endTimeout);
    }

    pause() {
        this.isPlaying = false;
        this.updatePlayButton();
        
        // Clear all timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
    }

    stop() {
        this.pause();
        this.currentNoteIndex = 0;
        this.updateProgress();
        this.updateCurrentNote('-');
        this.updateNextNote('-');
    }

    finishTutor() {
        this.isPlaying = false;
        this.updatePlayButton();
        const score = Math.round((this.correctCount / this.totalNotes) * 100);
        window.PianoUtils?.showNotification?.(`Hoàn thành! Độ chính xác: ${score}%`, 'success');
    }

    setSpeed(speed) {
        if (this.isPlaying) {
            this.pause();
            this.playbackSpeed = speed;
            this.play();
        } else {
            this.playbackSpeed = speed;
        }
        
        window.PianoUtils.showNotification(`Tốc độ: ${speed === 0.5 ? 'Chậm' : 'Bình thường'}`, 'info');
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

    updatePlayButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            if (this.isPlaying) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }

    updateProgress() {
        if (!this.currentSong) return;

        const progress = document.getElementById('progress');
        const currentTime = document.getElementById('currentTime');
        const totalTime = document.getElementById('totalTime');
        
        if (progress) {
            const percentage = (this.currentNoteIndex / this.currentSong.notes.length) * 100;
            progress.style.width = `${percentage}%`;
        }

        if (currentTime && totalTime) {
            const current = this.currentNoteIndex > 0 ? this.currentSong.delays[this.currentNoteIndex - 1] : 0;
            const total = Math.max(...this.currentSong.delays);
            
            currentTime.textContent = window.PianoUtils.formatTime(current / 1000);
            totalTime.textContent = window.PianoUtils.formatTime(total / 1000);
        }
    }

    updateCurrentNote(note) {
        const currentNoteText = document.getElementById('currentNoteText');
        if (currentNoteText) {
            currentNoteText.textContent = note;
        }
    }

    updateNextNote(index) {
        const nextNoteText = document.getElementById('nextNoteText');
        if (nextNoteText && this.currentSong) {
            if (index < this.currentSong.notes.length) {
                nextNoteText.textContent = this.currentSong.notes[index];
            } else {
                nextNoteText.textContent = '-';
            }
        }
    }

    closePlayer() {
        this.stop();
        const player = document.getElementById('songPlayer');
        if (player) {
            player.style.display = 'none';
        }
    }
}

// Initialize song player when page loads
document.addEventListener('DOMContentLoaded', function() {
    new SongPlayer();
});
