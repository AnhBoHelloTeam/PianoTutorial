// Piano page specific JavaScript

class PianoRecorder {
    constructor() {
        this.isRecording = false;
        this.recordedNotes = [];
        this.startTime = null;
        this.currentOctave = 4;
        this.recordBtn = document.getElementById('recordBtn');
        this.playBtn = document.getElementById('playBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.currentNoteDisplay = document.getElementById('currentNote');
        this.recordingStatus = document.getElementById('recordingStatus');
        this.octaveSelect = document.getElementById('octaveSelect');
        this.sustainOn = false;

        // Metronome elements/state
        this.metronomeBpmInput = document.getElementById('metronomeBpm');
        this.metronomeSignatureSelect = document.getElementById('metronomeSignature');
        this.metronomeToggleBtn = document.getElementById('metronomeToggle');
        this.metronomeInterval = null;
        this.metronomeBeat = 0;
        this.audioCtx = null;

        // Multi-track
        this.tracks = { 1: [], 2: [], 3: [] };
        this.trackStartTimes = { 1: null, 2: null, 3: null };
        this.currentTrack = 1;
        this.isRecordingTrack = false;
        this.recordTrackBtn = document.getElementById('recordTrackBtn');
        this.playAllTracksBtn = document.getElementById('playAllTracksBtn');
        this.clearAllTracksBtn = document.getElementById('clearAllTracksBtn');
        this.tracksInfo = document.getElementById('tracksInfo');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        if (this.recordBtn) {
            this.recordBtn.addEventListener('click', () => this.toggleRecording());
        }
        
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.playRecording());
        }
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearRecording());
        }

        if (this.octaveSelect) {
            this.octaveSelect.addEventListener('change', (e) => {
                this.currentOctave = parseInt(e.target.value, 10);
            });
        }

        // Hotkeys: Z/X octave, Space sustain
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            if (e.key.toLowerCase() === 'z') {
                this.currentOctave = Math.max(2, this.currentOctave - 1);
                if (this.octaveSelect) this.octaveSelect.value = String(this.currentOctave);
                window.PianoUtils?.showNotification?.(`Octave: ${this.currentOctave}`, 'info');
            }
            if (e.key.toLowerCase() === 'x') {
                this.currentOctave = Math.min(6, this.currentOctave + 1);
                if (this.octaveSelect) this.octaveSelect.value = String(this.currentOctave);
                window.PianoUtils?.showNotification?.(`Octave: ${this.currentOctave}`, 'info');
            }
            if (e.code === 'Space') {
                e.preventDefault();
                this.sustainOn = !this.sustainOn;
                window.PianoUtils?.showNotification?.(this.sustainOn ? 'Sustain: ON' : 'Sustain: OFF', this.sustainOn ? 'success' : 'info');
            }
        });

        // Metronome toggle
        if (this.metronomeToggleBtn) {
            this.metronomeToggleBtn.addEventListener('click', () => this.toggleMetronome());
        }

        // Multi-track listeners
        document.querySelectorAll('.track-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const track = parseInt(e.target.getAttribute('data-track') || e.target.closest('.track-btn').getAttribute('data-track'), 10);
                if (track) {
                    this.selectTrack(track);
                }
            });
        });

        if (this.recordTrackBtn) {
            this.recordTrackBtn.addEventListener('click', () => this.toggleTrackRecording());
        }

        if (this.playAllTracksBtn) {
            this.playAllTracksBtn.addEventListener('click', () => this.playAllTracks());
        }

        if (this.clearAllTracksBtn) {
            this.clearAllTracksBtn.addEventListener('click', () => this.clearAllTracks());
        }

        // Add click listeners to piano keys
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', (e) => {
                const baseNote = key.getAttribute('data-note');
                const note = this.applyOctave(baseNote);
                if (note) {
                    this.playNote(note);
                    if (this.isRecording) {
                        this.recordNote(note);
                    }
                }
            });
        });

        // Add keyboard listeners
        const keyMap = {
            'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5', 'l': 'D5',
            'w': 'C#4', 'e': 'D#4', 't': 'F#4', 'y': 'G#4', 'u': 'A#4', 'o': 'C#5', 'p': 'D#5'
        };

        document.addEventListener('keydown', (e) => {
            const baseNote = keyMap[e.key.toLowerCase()];
            const note = baseNote ? this.applyOctave(baseNote) : null;
            if (note) {
                e.preventDefault();
                this.playNote(note);
                if (this.isRecording) {
                    this.recordNote(note);
                }
                if (this.isRecordingTrack) {
                    this.recordTrackNote(note);
                }
            }
        });
    }

    applyOctave(note) {
        // note like C4, D#4
        const match = note.match(/^(^[A-G](#)?)(\d)$/);
        if (!match) return note;
        const letter = match[1];
        return `${letter}${this.currentOctave}`;
    }

    toggleMetronome() {
        if (this.metronomeInterval) {
            clearInterval(this.metronomeInterval);
            this.metronomeInterval = null;
            this.metronomeBeat = 0;
            if (this.metronomeToggleBtn) this.metronomeToggleBtn.innerHTML = '<i class="fas fa-play"></i> Metronome';
            window.PianoUtils?.showNotification?.('Metronome OFF', 'info');
            return;
        }

        const bpm = parseInt(this.metronomeBpmInput?.value || '100', 10);
        const beatsPerBar = parseInt(this.metronomeSignatureSelect?.value || '4', 10);
        const intervalMs = Math.max(60000 / Math.max(30, Math.min(240, bpm)), 50);

        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const click = (isAccent) => {
            const ctx = this.audioCtx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = isAccent ? 1200 : 900;
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.001);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        };

        this.metronomeBeat = 0;
        this.metronomeInterval = setInterval(() => {
            const isAccent = this.metronomeBeat % beatsPerBar === 0;
            click(isAccent);
            this.metronomeBeat++;
        }, intervalMs);

        if (this.metronomeToggleBtn) this.metronomeToggleBtn.innerHTML = '<i class="fas fa-stop"></i> Metronome';
        window.PianoUtils?.showNotification?.(`Metronome ${bpm} BPM • ${beatsPerBar}/4`, 'success');
    }

    playNote(note) {
        const audio = document.querySelector(`audio[data-note="${note}"]`);
        if (audio) {
            if (!this.sustainOn) {
                audio.currentTime = 0;
            }
            audio.play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }

        // Update current note display
        if (this.currentNoteDisplay) {
            this.currentNoteDisplay.textContent = note;
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

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        this.isRecording = true;
        this.recordedNotes = [];
        this.startTime = Date.now();
        this.updateUI();
        
        if (this.recordingStatus) {
            this.recordingStatus.textContent = 'Đang ghi âm...';
            this.recordingStatus.style.color = '#f44336';
        }
    }

    stopRecording() {
        this.isRecording = false;
        this.updateUI();
        
        if (this.recordingStatus) {
            this.recordingStatus.textContent = `Đã ghi ${this.recordedNotes.length} nốt nhạc`;
            this.recordingStatus.style.color = '#4caf50';
        }
    }

    recordNote(note) {
        const timestamp = Date.now() - this.startTime;
        this.recordedNotes.push({ note, timestamp });
    }

    playRecording() {
        if (this.recordedNotes.length === 0) {
            window.PianoUtils.showNotification('Không có bản ghi nào để phát', 'error');
            return;
        }

        this.recordedNotes.forEach(({ note, timestamp }) => {
            setTimeout(() => {
                this.playNote(note);
            }, timestamp);
        });
    }

    clearRecording() {
        this.recordedNotes = [];
        this.isRecording = false;
        this.updateUI();
        
        if (this.recordingStatus) {
            this.recordingStatus.textContent = 'Sẵn sàng ghi âm';
            this.recordingStatus.style.color = '#666';
        }
    }

    updateUI() {
        if (this.recordBtn) {
            if (this.isRecording) {
                this.recordBtn.innerHTML = '<i class="fas fa-stop"></i> Dừng ghi âm';
                this.recordBtn.style.background = '#f44336';
            } else {
                this.recordBtn.innerHTML = '<i class="fas fa-circle"></i> Ghi âm';
                this.recordBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            }
        }

        if (this.playBtn) {
            this.playBtn.disabled = this.recordedNotes.length === 0;
        }

        this.updateTracksInfo();
    }

    // Multi-track methods
    selectTrack(track) {
        this.currentTrack = track;
        document.querySelectorAll('.track-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`.track-btn[data-track="${track}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        window.PianoUtils?.showNotification?.(`Đã chọn Track ${track}`, 'info');
    }

    toggleTrackRecording() {
        if (this.isRecordingTrack) {
            this.stopTrackRecording();
        } else {
            this.startTrackRecording();
        }
    }

    startTrackRecording() {
        this.isRecordingTrack = true;
        this.tracks[this.currentTrack] = [];
        this.trackStartTimes[this.currentTrack] = Date.now();
        if (this.recordTrackBtn) {
            this.recordTrackBtn.innerHTML = '<i class="fas fa-stop"></i> Dừng Ghi';
            this.recordTrackBtn.style.background = '#f44336';
        }
        window.PianoUtils?.showNotification?.(`Đang ghi Track ${this.currentTrack}...`, 'info');
    }

    stopTrackRecording() {
        this.isRecordingTrack = false;
        if (this.recordTrackBtn) {
            this.recordTrackBtn.innerHTML = '<i class="fas fa-circle"></i> Ghi Track';
            this.recordTrackBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        }
        this.updateTracksInfo();
        window.PianoUtils?.showNotification?.(`Đã ghi ${this.tracks[this.currentTrack].length} nốt vào Track ${this.currentTrack}`, 'success');
    }

    recordTrackNote(note) {
        const timestamp = Date.now() - this.trackStartTimes[this.currentTrack];
        this.tracks[this.currentTrack].push({ note, timestamp });
        this.updateTracksInfo();
    }

    playAllTracks() {
        const hasAny = Object.values(this.tracks).some(t => t.length > 0);
        if (!hasAny) {
            window.PianoUtils?.showNotification?.('Không có track nào để phát', 'error');
            return;
        }

        [1, 2, 3].forEach(trackNum => {
            this.tracks[trackNum].forEach(({ note, timestamp }) => {
                setTimeout(() => {
                    this.playNote(note);
                }, timestamp);
            });
        });

        const maxDuration = Math.max(...Object.values(this.tracks).map(t => t.length ? Math.max(...t.map(n => n.timestamp)) : 0));
        window.PianoUtils?.showNotification?.(`Đang phát tất cả tracks...`, 'success');
    }

    clearAllTracks() {
        this.tracks = { 1: [], 2: [], 3: [] };
        this.trackStartTimes = { 1: null, 2: null, 3: null };
        this.isRecordingTrack = false;
        if (this.recordTrackBtn) {
            this.recordTrackBtn.innerHTML = '<i class="fas fa-circle"></i> Ghi Track';
            this.recordTrackBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        }
        this.updateTracksInfo();
        window.PianoUtils?.showNotification?.('Đã xóa tất cả tracks', 'info');
    }

    updateTracksInfo() {
        if (this.tracksInfo) {
            const info = [1, 2, 3].map(t => `Track ${t}: ${this.tracks[t].length} nốt`).join(' | ');
            this.tracksInfo.textContent = info;
        }
        if (this.playAllTracksBtn) {
            const hasAny = Object.values(this.tracks).some(t => t.length > 0);
            this.playAllTracksBtn.disabled = !hasAny;
        }
    }
}

// Initialize piano recorder when page loads
document.addEventListener('DOMContentLoaded', function() {
    new PianoRecorder();
});
