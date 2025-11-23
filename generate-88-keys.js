// Script to generate 88 piano keys and audio elements
const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
let fileNum = 1;
let audioHtml = '';
let keysHtml = '';

// A0, A#0, B0
for (let i = 0; i < 3; i++) {
    const note = notes[i] + '0';
    audioHtml += `            <audio data-note="${note}" src="../assets/audio/${fileNum}.mp3" preload="none"></audio>\n`;
    const isBlack = note.includes('#');
    keysHtml += `                    <div class="key ${isBlack ? 'black-key' : 'white-key'}" data-note="${note}">\n                        <span class="key-label">${note}</span>\n                    </div>\n`;
    fileNum++;
}

// C1 to B7 - each octave has all 12 notes
for (let octave = 1; octave <= 7; octave++) {
    // C to G# for each octave
    for (let i = 3; i < notes.length; i++) {
        const note = notes[i] + octave;
        audioHtml += `            <audio data-note="${note}" src="../assets/audio/${fileNum}.mp3" preload="none"></audio>\n`;
        const isBlack = note.includes('#');
        keysHtml += `                    <div class="key ${isBlack ? 'black-key' : 'white-key'}" data-note="${note}">\n                        <span class="key-label">${note}</span>\n                    </div>\n`;
        fileNum++;
    }
    // A, A#, B for each octave
    for (let i = 0; i < 3; i++) {
        const note = notes[i] + octave;
        audioHtml += `            <audio data-note="${note}" src="../assets/audio/${fileNum}.mp3" preload="none"></audio>\n`;
        const isBlack = note.includes('#');
        keysHtml += `                    <div class="key ${isBlack ? 'black-key' : 'white-key'}" data-note="${note}">\n                        <span class="key-label">${note}</span>\n                    </div>\n`;
        fileNum++;
    }
}

// C8 (last note)
const note = 'C8';
audioHtml += `            <audio data-note="${note}" src="../assets/audio/${fileNum}.mp3" preload="none"></audio>\n`;
keysHtml += `                    <div class="key white-key" data-note="${note}">\n                        <span class="key-label">${note}</span>\n                    </div>\n`;
fileNum++;

console.log('AUDIO ELEMENTS:');
console.log(audioHtml);
console.log('\n\nPIANO KEYS:');
console.log(keysHtml);

