// Audio analyzer page specific JavaScript

class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.audioBuffer = null;
        this.isRecording = false;
        this.recordedChunks = [];
        this.mediaRecorder = null;
        this.analysisResults = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
    }

    setupEventListeners() {
        // File upload
        const audioFile = document.getElementById('audioFile');
        if (audioFile) {
            audioFile.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Record button
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => this.toggleRecording());
        }

        // Analysis controls
        const playOriginalBtn = document.getElementById('playOriginalBtn');
        if (playOriginalBtn) {
            playOriginalBtn.addEventListener('click', () => this.playOriginal());
        }

        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeAudio());
        }

        const playPianoBtn = document.getElementById('playPianoBtn');
        if (playPianoBtn) {
            playPianoBtn.addEventListener('click', () => this.playPianoSequence());
        }

        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportResults());
        }

        const playSequenceBtn = document.getElementById('playSequenceBtn');
        if (playSequenceBtn) {
            playSequenceBtn.addEventListener('click', () => this.playPianoSequence());
        }
    }

    setupCanvas() {
        const canvas = document.getElementById('audioCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            this.drawVisualizer(ctx, canvas);
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('audio/')) {
            window.PianoUtils.showNotification('Vui lòng chọn file âm thanh', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadAudioFile(e.target.result);
        };
        reader.readAsArrayBuffer(file);
    }

    loadAudioFile(arrayBuffer) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.audioContext.decodeAudioData(arrayBuffer)
            .then(audioBuffer => {
                this.audioBuffer = audioBuffer;
                this.showWorkspace();
                this.updateControls();
                window.PianoUtils.showNotification('File âm thanh đã được tải thành công', 'success');
            })
            .catch(error => {
                console.error('Error loading audio file:', error);
                window.PianoUtils.showNotification('Lỗi khi tải file âm thanh', 'error');
            });
    }

    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.loadAudioFile(e.target.result);
                };
                reader.readAsArrayBuffer(blob);
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.updateRecordButton();
            window.PianoUtils.showNotification('Đang ghi âm...', 'info');
        } catch (error) {
            console.error('Error accessing microphone:', error);
            window.PianoUtils.showNotification('Không thể truy cập microphone', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.updateRecordButton();
            window.PianoUtils.showNotification('Đã dừng ghi âm', 'success');
        }
    }

    updateRecordButton() {
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
            if (this.isRecording) {
                recordBtn.innerHTML = '<i class="fas fa-stop"></i> Dừng ghi âm';
                recordBtn.style.background = '#f44336';
            } else {
                recordBtn.innerHTML = '<i class="fas fa-circle"></i> Bắt đầu ghi âm';
                recordBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
        }
    }

    showWorkspace() {
        const workspace = document.getElementById('analyzerWorkspace');
        if (workspace) {
            workspace.style.display = 'block';
        }
    }

    updateControls() {
        const playOriginalBtn = document.getElementById('playOriginalBtn');
        if (playOriginalBtn) {
            playOriginalBtn.disabled = false;
        }
    }

    playOriginal() {
        if (!this.audioBuffer) return;

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    async analyzeAudio() {
        if (!this.audioBuffer) {
            window.PianoUtils.showNotification('Vui lòng tải file âm thanh trước', 'error');
            return;
        }

        this.showAnalysisProgress();
        
        // Simulate analysis process
        await this.simulateAnalysis();
        
        this.hideAnalysisProgress();
        this.showAnalysisResults();
    }

    showAnalysisProgress() {
        const progress = document.getElementById('analysisProgress');
        const progressBar = document.getElementById('analysisProgressBar');
        const progressText = document.getElementById('progressText');
        
        if (progress) {
            progress.style.display = 'block';
        }

        // Animate progress bar
        let width = 0;
        const interval = setInterval(() => {
            width += 2;
            if (progressBar) {
                progressBar.style.width = width + '%';
            }
            if (width >= 100) {
                clearInterval(interval);
            }
        }, 50);
    }

    hideAnalysisProgress() {
        const progress = document.getElementById('analysisProgress');
        if (progress) {
            progress.style.display = 'none';
        }
    }

    async simulateAnalysis() {
        // This is a simplified analysis - in a real implementation,
        // you would use more sophisticated audio analysis techniques
        
        const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
        const durations = [500, 750, 1000, 500, 750, 1000, 500, 1000];
        
        this.analysisResults = [];
        
        for (let i = 0; i < notes.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            this.analysisResults.push({
                note: notes[i],
                duration: durations[i],
                timestamp: i * 1000
            });
        }
    }

    showAnalysisResults() {
        const results = document.getElementById('analysisResults');
        const notesSequence = document.getElementById('notesSequence');
        const playPianoBtn = document.getElementById('playPianoBtn');
        
        if (results) {
            results.style.display = 'block';
        }

        if (notesSequence) {
            notesSequence.innerHTML = '';
            this.analysisResults.forEach((result, index) => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note-item';
                noteElement.textContent = result.note;
                noteElement.style.animationDelay = `${index * 0.1}s`;
                notesSequence.appendChild(noteElement);
            });
        }

        if (playPianoBtn) {
            playPianoBtn.disabled = false;
        }

        window.PianoUtils.showNotification('Phân tích hoàn thành!', 'success');
    }

    playPianoSequence() {
        if (this.analysisResults.length === 0) {
            window.PianoUtils.showNotification('Không có kết quả phân tích để phát', 'error');
            return;
        }

        this.analysisResults.forEach((result, index) => {
            setTimeout(() => {
                this.playNote(result.note);
            }, result.timestamp);
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

    exportResults() {
        if (this.analysisResults.length === 0) {
            window.PianoUtils.showNotification('Không có kết quả để xuất', 'error');
            return;
        }

        const data = {
            timestamp: new Date().toISOString(),
            results: this.analysisResults,
            totalNotes: this.analysisResults.length
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piano-analysis-results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.PianoUtils.showNotification('Kết quả đã được xuất thành công', 'success');
    }

    drawVisualizer(ctx, canvas) {
        const draw = () => {
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw waveform placeholder
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const centerY = canvas.height / 2;
            const amplitude = 50;
            
            for (let x = 0; x < canvas.width; x += 2) {
                const y = centerY + Math.sin(x * 0.02) * amplitude;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            requestAnimationFrame(draw);
        };
        
        draw();
    }
}

// Initialize analyzer when page loads
document.addEventListener('DOMContentLoaded', function() {
    new AudioAnalyzer();
});
