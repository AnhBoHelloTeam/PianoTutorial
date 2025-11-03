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
        this.exportRecBtn = document.getElementById('exportRecBtn');
        this.importRecInput = document.getElementById('importRecInput');
        this.autoSaveRecToggle = document.getElementById('autoSaveRecToggle');
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
        this.exportTracksBtn = document.getElementById('exportTracksBtn');
        this.importTracksInput = document.getElementById('importTracksInput');
        this.exportMidiBtn = document.getElementById('exportMidiBtn');

        // MIDI
        this.midiToggleBtn = document.getElementById('midiToggle');
        this.midiAccess = null;
        this.midiEnabled = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        // try load persisted single recording
        if (this.loadRecordingFromStorage()) {
            this.updateUI();
        }
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

        if (this.exportRecBtn) {
            this.exportRecBtn.addEventListener('click', () => this.exportRecording());
        }
        if (this.importRecInput) {
            this.importRecInput.addEventListener('change', (e) => this.importRecording(e));
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

        if (this.exportTracksBtn) {
            this.exportTracksBtn.addEventListener('click', () => this.exportTracks());
        }
        if (this.importTracksInput) {
            this.importTracksInput.addEventListener('change', (e) => this.importTracks(e));
        }

        if (this.midiToggleBtn) {
            this.midiToggleBtn.addEventListener('click', () => this.toggleMIDI());
        }

        if (this.exportMidiBtn) {
            this.exportMidiBtn.addEventListener('click', () => this.exportMIDI());
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

        this.maybeAutoSaveRecording();
    }

    recordNote(note) {
        const timestamp = Date.now() - this.startTime;
        this.recordedNotes.push({ note, timestamp });
        this.maybeAutoSaveRecording(true);
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

        this.saveRecordingToStorage([]);
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

    // Recording persistence and import/export
    storageKey() { return 'pv-single-recording'; }
    storageAutoKey() { return 'pv-single-recording-auto'; }

    maybeAutoSaveRecording(throttled = false) {
        if (!this.autoSaveRecToggle || !this.autoSaveRecToggle.checked) return;
        // simple throttle by saving only every ~10 notes when throttled
        if (throttled && (this.recordedNotes.length % 10 !== 0)) return;
        this.saveRecordingToStorage(this.recordedNotes);
    }

    saveRecordingToStorage(data) {
        try {
            localStorage.setItem(this.storageKey(), JSON.stringify({ version: 1, recordedNotes: data }));
        } catch(e) {}
    }

    loadRecordingFromStorage() {
        try {
            const raw = localStorage.getItem(this.storageKey());
            if (!raw) return false;
            const json = JSON.parse(raw);
            if (json && Array.isArray(json.recordedNotes)) {
                this.recordedNotes = json.recordedNotes;
                return true;
            }
        } catch(e) {}
        return false;
    }

    exportRecording() {
        if (!this.recordedNotes.length) {
            window.PianoUtils?.showNotification?.('Chưa có ghi âm để export', 'error');
            return;
        }
        const data = { version: 1, recordedNotes: this.recordedNotes };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piano-recording.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.PianoUtils?.showNotification?.('Đã export ghi âm', 'success');
    }

    importRecording(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result);
                if (json && Array.isArray(json.recordedNotes)) {
                    this.recordedNotes = json.recordedNotes;
                    this.updateUI();
                    this.saveRecordingToStorage(this.recordedNotes);
                    window.PianoUtils?.showNotification?.('Đã import ghi âm', 'success');
                } else {
                    throw new Error('invalid');
                }
            } catch (err) {
                window.PianoUtils?.showNotification?.('Import ghi âm thất bại', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
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

    // Export/Import tracks
    exportTracks() {
        const data = {
            version: 1,
            tracks: this.tracks
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piano-tracks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.PianoUtils?.showNotification?.('Đã export tracks', 'success');
    }

    importTracks(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result);
                if (json && json.tracks) {
                    this.tracks = json.tracks;
                    this.updateTracksInfo();
                    window.PianoUtils?.showNotification?.('Đã import tracks', 'success');
                } else {
                    throw new Error('Invalid format');
                }
            } catch (err) {
                window.PianoUtils?.showNotification?.('Import thất bại', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // MIDI support
    async toggleMIDI() {
        if (this.midiEnabled) {
            this.disableMIDI();
            return;
        }
        try {
            const access = await navigator.requestMIDIAccess();
            this.midiAccess = access;
            this.enableMIDIInputs();
            this.midiEnabled = true;
            this.midiToggleBtn.innerHTML = '<i class="fas fa-keyboard"></i> MIDI ON';
            window.PianoUtils?.showNotification?.('MIDI: ON', 'success');
        } catch (e) {
            window.PianoUtils?.showNotification?.('MIDI không khả dụng', 'error');
        }
    }

    disableMIDI() {
        if (!this.midiAccess) return;
        this.midiAccess.inputs.forEach(input => input.onmidimessage = null);
        this.midiEnabled = false;
        if (this.midiToggleBtn) this.midiToggleBtn.innerHTML = '<i class="fas fa-keyboard"></i> MIDI Input';
        window.PianoUtils?.showNotification?.('MIDI: OFF', 'info');
    }

    enableMIDIInputs() {
        if (!this.midiAccess) return;
        this.midiAccess.inputs.forEach(input => {
            input.onmidimessage = (msg) => this.handleMIDIMessage(msg);
        });
    }

    handleMIDIMessage(message) {
        const [status, noteNumber, velocity] = message.data;
        const command = status & 0xf0;
        if (command === 0x90 && velocity > 0) { // note on
            const noteName = this.midiNoteNumberToName(noteNumber);
            if (noteName) {
                this.playNote(noteName);
                if (this.isRecording) this.recordNote(noteName);
                if (this.isRecordingTrack) this.recordTrackNote(noteName);
            }
        }
        // Optional: handle note off if needed
    }

    midiNoteNumberToName(num) {
        // MIDI 60 = C4
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(num / 12) - 1;
        const name = names[num % 12];
        return `${name}${octave}`;
    }

    noteNameToMidi(note) {
        const m = note.match(/^([A-G])(#?)(\d)$/);
        if (!m) return null;
        const names = { 'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11 };
        const n = m[1] + (m[2] === '#' ? '#' : '');
        const octave = parseInt(m[3], 10);
        return (octave + 1) * 12 + names[n];
    }

    // Build a simple SMF Type 1 with one tempo/meta track and N note tracks
    exportMIDI() {
        const hasAny = Object.values(this.tracks).some(t => t.length > 0);
        if (!hasAny) {
            window.PianoUtils?.showNotification?.('Không có track để export MIDI', 'error');
            return;
        }
        const tpq = 480; // ticks per quarter
        const tempo = 500000; // 120 BPM
        const noteDurationMs = 200; // fixed length
        const noteDurTicks = Math.round(tpq * (noteDurationMs / 500)); // 200ms at 120BPM => 192 ticks

        const encodeStr = (s) => new TextEncoder().encode(s);
        const write32 = (n) => new Uint8Array([ (n>>>24)&255, (n>>>16)&255, (n>>>8)&255, n&255 ]);
        const write16 = (n) => new Uint8Array([ (n>>>8)&255, n&255 ]);
        const varLen = (value) => {
            let buffer = value & 0x7F;
            const bytes = [];
            while ((value >>= 7)) {
                buffer <<= 8;
                buffer |= ((value & 0x7F) | 0x80);
            }
            while (true) {
                bytes.push(buffer & 0xFF);
                if (buffer & 0x80) buffer >>= 8; else break;
            }
            return new Uint8Array(bytes);
        };

        const tracksBytes = [];
        // Tempo/meta track
        {
            const ev = [];
            // delta 0, set tempo
            ev.push(...Array.from(varLen(0)));
            ev.push(0xFF, 0x51, 0x03, (tempo>>>16)&255, (tempo>>>8)&255, tempo&255);
            // End of track
            ev.push(0x00, 0xFF, 0x2F, 0x00);
            const body = new Uint8Array(ev);
            const header = encodeStr('MTrk');
            const len = write32(body.length);
            tracksBytes.push(new Uint8Array([...header, ...len, ...body]));
        }
        // For each track 1..3
        [1,2,3].forEach(trackNum => {
            const items = this.tracks[trackNum];
            if (!items || items.length === 0) return;
            const sorted = [...items].sort((a,b) => a.timestamp - b.timestamp);
            const ev = [];
            let lastMs = 0;
            sorted.forEach(n => {
                const midi = this.noteNameToMidi(n.note);
                if (midi == null) return;
                const deltaMs = Math.max(0, n.timestamp - lastMs);
                const deltaTicks = Math.round(deltaMs * tpq / 500); // since 120BPM => 500ms per quarter
                ev.push(...Array.from(varLen(deltaTicks)));
                ev.push(0x90, midi & 0x7F, 0x64); // Note on, velocity 100
                // note off after fixed duration
                ev.push(...Array.from(varLen(noteDurTicks)));
                ev.push(0x80, midi & 0x7F, 0x40);
                lastMs = n.timestamp + noteDurationMs;
            });
            // End of track
            ev.push(0x00, 0xFF, 0x2F, 0x00);
            const body = new Uint8Array(ev);
            const header = encodeStr('MTrk');
            const len = write32(body.length);
            tracksBytes.push(new Uint8Array([...header, ...len, ...body]));
        });

        const numTracks = tracksBytes.length;
        const header = new Uint8Array([
            ...encodeStr('MThd'), ...write32(6), ...write16(1), ...write16(numTracks), ...write16(tpq)
        ]);
        let totalLen = header.length + tracksBytes.reduce((s,b)=>s+b.length,0);
        const full = new Uint8Array(totalLen);
        let off = 0;
        full.set(header, off); off += header.length;
        tracksBytes.forEach(b => { full.set(b, off); off += b.length; });

        const blob = new Blob([full], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piano-tracks.mid';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.PianoUtils?.showNotification?.('Đã export MIDI', 'success');
    }
}

// Initialize piano recorder when page loads
document.addEventListener('DOMContentLoaded', function() {
    new PianoRecorder();
});
