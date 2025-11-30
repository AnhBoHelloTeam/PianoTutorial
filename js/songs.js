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
        this.volume = 1.0;
        
        this.songs = {
            'twinkle': {
                title: 'Twinkle Twinkle Little Star',
                notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
                delays: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500]
            },
            'happy': {
                title: 'Happy Birthday',
                notes: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4', 'C4', 'C4', 'C5', 'A4', 'F4', 'E4', 'D4'],
                delays: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400]
            },
            'mary': {
                title: 'Mary Had a Little Lamb',
                notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'D4', 'D4', 'D4', 'E4', 'G4', 'G4', 'E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'E4', 'D4', 'D4', 'E4', 'D4', 'C4'],
                delays: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400, 5700, 6000, 6300, 6600, 6900, 7200, 7500]
            },
            'fur-elise': {
                title: 'Für Elise (Đoạn đầu)',
                notes: ['E5', 'D#5', 'E5', 'D#5', 'E5', 'B4', 'D5', 'C5', 'A4', 'C4', 'E4', 'A4', 'B4', 'E4', 'G#4', 'B4', 'C5', 'E4', 'E5', 'D#5', 'E5', 'D#5', 'E5', 'B4', 'D5', 'C5', 'A4'],
                delays: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400, 5700, 6000, 6300, 6600, 6900, 7200, 7500, 7800]
            },
            'jingle-bells': {
                title: 'Jingle Bells',
                notes: ['E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'G4', 'C4', 'D4', 'E4', 'F4', 'F4', 'F4', 'F4', 'F4', 'E4', 'E4', 'E4', 'E4', 'E4', 'D4', 'D4', 'E4', 'D4', 'G4'],
                delays: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400, 5700, 6000, 6300, 6600, 6900, 7200, 7500]
            },
            'ode-to-joy': {
                title: 'Ode to Joy (Beethoven)',
                notes: ['E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'C4', 'D4', 'E4', 'E4', 'D4', 'D4', 'E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'C4', 'D4', 'E4', 'D4', 'C4', 'C4'],
                delays: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600, 8000, 8400, 8800, 9200, 9600, 10000, 10400, 10800, 11200, 11600]
            },
            'canon-pachelbel': {
                title: 'Canon in D (Pachelbel)',
                notes: ['D4', 'A3', 'B3', 'F#3', 'G3', 'D3', 'G3', 'A3', 'D4', 'A3', 'B3', 'F#3', 'G3', 'D3', 'G3', 'A3', 'D4', 'F#4', 'G4', 'D4', 'G4', 'A4', 'D4', 'A4', 'B4', 'D4', 'G4', 'A4', 'D4', 'F#4', 'G4', 'D4'],
                delays: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500]
            },
            'lac-troi': {
                title: 'Lạc Trôi - Sơn Tùng M-TP',
                notes: ['E4', 'G4', 'A4', 'G4', 'E4', 'D4', 'E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'E4', 'D4', 'E4', 'G4', 'A4', 'G4', 'E4', 'G4', 'A4', 'B4', 'C5', 'B4', 'A4', 'G4'],
                delays: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600, 8000, 8400, 8800, 9200, 9600, 10000]
            },
            'hay-trao-cho-anh': {
                title: 'Hãy Trao Cho Anh - Sơn Tùng M-TP',
                notes: ['C4', 'E4', 'G4', 'A4', 'G4', 'E4', 'D4', 'E4', 'G4', 'A4', 'C5', 'A4', 'G4', 'E4', 'D4', 'C4', 'E4', 'G4', 'A4', 'C5', 'A4', 'G4', 'E4', 'D4', 'C4'],
                delays: [0, 350, 700, 1050, 1400, 1750, 2100, 2450, 2800, 3150, 3500, 3850, 4200, 4550, 4900, 5250, 5600, 5950, 6300, 6650, 7000, 7350, 7700, 8050, 8400]
            },
            'chung-ta-cua-hien-tai': {
                title: 'Chúng Ta Của Hiện Tại - Sơn Tùng M-TP',
                notes: ['D4', 'F#4', 'G4', 'A4', 'G4', 'F#4', 'E4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'A4', 'G4', 'F#4', 'E4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'A4', 'G4'],
                delays: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600, 8000, 8400, 8800, 9200, 9600]
            },
            'em-cua-ngay-hom-qua': {
                title: 'Em Của Ngày Hôm Qua - Sơn Tùng M-TP',
                notes: ['C4', 'D4', 'E4', 'G4', 'E4', 'D4', 'C4', 'D4', 'E4', 'G4', 'A4', 'G4', 'E4', 'D4', 'C4', 'D4', 'E4', 'G4', 'A4', 'G4', 'E4', 'D4', 'C4'],
                delays: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600, 8000, 8400, 8800]
            },
            'noi-nay-co-anh': {
                title: 'Nơi Này Có Anh - Sơn Tùng M-TP',
                notes: [
                    // Intro: F G Am Em F G C (theo hợp âm)
                    'F4', 'G4', 'A4', 'E4', 'F4', 'G4', 'C5',
                    // Verse: Em là ai từ đâu bước đến
                    'C5', 'C5', 'F4', 'G4', 'A4', 'A4', 'G4', 'F4', 'E4', 'C5',
                    'C5', 'C5', 'F4', 'G4', 'A4', 'A4', 'G4', 'F4', 'E4', 'C5',
                    // Chorus: Cầm tay anh, dựa vai anh
                    'C5', 'C5', 'A4', 'A4', 'F4', 'G4', 'G4', 'C5',
                    'C5', 'C5', 'A4', 'A4', 'F4', 'G4', 'G4', 'C5',
                    // Kề bên anh nơi này có anh
                    'C5', 'C5', 'A4', 'A4', 'F4', 'G4', 'G4', 'C5',
                    'C5', 'C5', 'A4', 'A4', 'F4', 'G4', 'G4', 'C5',
                    // Gió mang câu tình ca
                    'C5', 'A4', 'F4', 'G4', 'A4', 'C5', 'C5', 'A4'
                ],
                delays: [
                    // Intro
                    0, 400, 800, 1200, 1600, 2000, 2400,
                    // Verse
                    2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400,
                    6800, 7200, 7600, 8000, 8400, 8800, 9200, 9600, 10000, 10400,
                    // Chorus
                    10800, 11200, 11600, 12000, 12400, 12800, 13200, 13600,
                    14000, 14400, 14800, 15200, 15600, 16000, 16400, 16800,
                    // Kề bên anh
                    17200, 17600, 18000, 18400, 18800, 19200, 19600, 20000,
                    20400, 20800, 21200, 21600, 22000, 22400, 22800, 23200,
                    // Gió mang
                    23600, 24000, 24400, 24800, 25200, 25600, 26000, 26400
                ]
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

        // Tempo slider
        const tempoSlider = document.getElementById('tempoSlider');
        const tempoValue = document.getElementById('tempoValue');
        if (tempoSlider) {
            const updateTempo = () => {
                const percent = parseInt(tempoSlider.value, 10);
                const speed = percent / 100; // 50%..150% -> 0.5..1.5
                this.setSpeed(speed);
                if (tempoValue) tempoValue.textContent = `${percent}%`;
            };
            tempoSlider.addEventListener('input', updateTempo);
            updateTempo();
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

        // Volume control
        const songVolumeSlider = document.getElementById('songVolumeSlider');
        const songVolumeValue = document.getElementById('songVolumeValue');
        if (songVolumeSlider) {
            songVolumeSlider.addEventListener('input', (e) => {
                this.volume = parseInt(e.target.value, 10) / 100;
                if (songVolumeValue) songVolumeValue.textContent = `${e.target.value}%`;
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

        // Search & filter
        const searchInput = document.getElementById('songSearchInput');
        const difficultySelect = document.getElementById('songDifficultyFilter');
        const favoritesOnlyToggle = document.getElementById('favoritesOnlyToggle');
        const getFavs = () => JSON.parse(localStorage.getItem('pv-favorites') || '[]');
        const setFavs = (arr) => localStorage.setItem('pv-favorites', JSON.stringify(arr));
        const filterFn = () => {
            const q = (searchInput?.value || '').toLowerCase();
            const diff = (difficultySelect?.value || 'all');
            const favs = new Set(getFavs());
            document.querySelectorAll('.song-card').forEach(card => {
                const title = card.querySelector('.song-info h3')?.textContent?.toLowerCase() || '';
                const diffEl = card.querySelector('.difficulty');
                const cardDiff = (diffEl?.classList?.contains('easy') && 'easy') || (diffEl?.classList?.contains('medium') && 'medium') || (diffEl?.classList?.contains('hard') && 'hard') || 'all';
                const id = card.getAttribute('data-song');
                const matchText = !q || title.includes(q);
                const matchDiff = diff === 'all' || diff === cardDiff;
                const matchFav = !favoritesOnlyToggle?.checked || favs.has(id);
                card.style.display = (matchText && matchDiff && matchFav) ? '' : 'none';
            });
        };
        if (searchInput) searchInput.addEventListener('input', window.PianoUtils?.debounce?.(filterFn, 150) || filterFn);
        if (difficultySelect) difficultySelect.addEventListener('change', filterFn);
        if (favoritesOnlyToggle) favoritesOnlyToggle.addEventListener('change', filterFn);
        filterFn();

        // Favorite buttons
        document.querySelectorAll('.favorite-song-btn').forEach(btn => {
            const id = btn.getAttribute('data-song');
            const refreshBtn = () => {
                const favs = new Set(getFavs());
                btn.classList.toggle('active', favs.has(id));
            };
            refreshBtn();
            btn.addEventListener('click', () => {
                const favs = new Set(getFavs());
                if (favs.has(id)) favs.delete(id); else favs.add(id);
                setFavs(Array.from(favs));
                refreshBtn();
                filterFn();
            });
        });
    }

    loadSong(songId) {
        if (!this.songs[songId]) {
            window.PianoUtils.showNotification('Bài hát không tồn tại', 'error');
            return;
        }

        // Nếu đang phát bài khác, dừng lại
        if (this.isPlaying) {
            this.stop();
        }

        this.currentSong = this.songs[songId];
        this.currentNoteIndex = 0;
        this.isPlaying = false;
        this.correctCount = 0;
        this.totalNotes = this.currentSong.notes.length;
        
        // Preload tất cả audio cần thiết cho bài hát này
        const uniqueNotes = [...new Set(this.currentSong.notes)];
        let loadedCount = 0;
        const totalNotes = uniqueNotes.length;
        
        uniqueNotes.forEach(note => {
            const audio = document.querySelector(`audio[data-note="${note}"]`);
            if (audio) {
                // Load audio nếu chưa load
                if (audio.readyState < 2) {
                    audio.load();
                    audio.addEventListener('canplay', () => {
                        loadedCount++;
                        if (loadedCount === totalNotes) {
                            // Tất cả audio đã load xong, tiếp tục
                            this.finishLoadSong();
                        }
                    }, { once: true });
                } else {
                    loadedCount++;
                    if (loadedCount === totalNotes) {
                        this.finishLoadSong();
                    }
                }
            } else {
                loadedCount++;
                if (loadedCount === totalNotes) {
                    this.finishLoadSong();
                }
            }
        });
        
        // Nếu không có note nào, vẫn tiếp tục
        if (totalNotes === 0) {
            this.finishLoadSong();
        }
    }
    
    finishLoadSong() {
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
        
        // Tự động phát sau khi load (delay nhỏ để UI cập nhật)
        setTimeout(() => {
            this.play();
        }, 300);
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

        // Auto-play: tính delay tương đối giữa các nốt liên tiếp
        let accumulatedDelay = 0;
        
        for (let index = this.currentNoteIndex; index < this.currentSong.notes.length; index++) {
            const note = this.currentSong.notes[index];
            const currentDelay = this.currentSong.delays[index] || 0;
            
            // Tính delay tương đối từ nốt trước (hoặc từ 0 nếu là nốt đầu)
            const prevDelay = index > 0 ? (this.currentSong.delays[index - 1] || 0) : 0;
            const relativeDelay = (currentDelay - prevDelay) / this.playbackSpeed;
            
            // Cộng dồn delay để tạo timeout đúng thứ tự
            accumulatedDelay += relativeDelay;
            
            const timeout = setTimeout(() => {
                if (this.isPlaying) {
                    this.playNote(note);
                    this.currentNoteIndex = index + 1;
                    this.updateProgress();
                    this.updateCurrentNote(note);
                    this.updateNextNote(index + 1);
                    
                    // Nếu là nốt cuối, dừng sau 1 giây
                    if (index === this.currentSong.notes.length - 1) {
                        setTimeout(() => {
                            if (this.isPlaying) this.stop();
                        }, 1000);
                    }
                }
            }, accumulatedDelay);
            
            this.timeouts.push(timeout);
        }
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
            audio.volume = this.volume;
            // Đảm bảo audio được load và phát ngay
            try {
                audio.currentTime = 0;
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        // Silently handle autoplay restrictions
                        if (e.name !== 'NotAllowedError') {
                            console.warn('Audio play failed:', e);
                            // Nếu lỗi, thử load lại và phát
                            audio.load();
                            audio.play().catch(err => {
                                if (err.name !== 'NotAllowedError') {
                                    console.warn('Retry play failed:', err);
                                }
                            });
                        }
                    });
                }
            } catch (e) {
                console.warn('Audio play error:', e);
            }
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
