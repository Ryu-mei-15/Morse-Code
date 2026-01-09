class AudioHandler {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.analyser = null;
        this.microphone = null;
        this.scriptProcessor = null;
        this.isRecognizing = false;
        this.noiseLevel = -100.0; // dB

        // モールス信号のタイミング設定 (WPM: Words Per Minute)
        const wpm = 20;
        this.dotDuration = 1.2 / wpm; // 短点「・」の長さ（秒）
        this.dashDuration = this.dotDuration * 3; // 長点「ー」の長さ
        this.symbolSpace = this.dotDuration; // 符号間のスペース
        this.letterSpace = this.dotDuration * 3; // 文字間のスペース
        this.wordSpace = this.dotDuration * 7; // 単語間のスペース
    }

    // AudioContextを初期化
    _initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /**
     * モールス信号の文字列をビープ音で再生する
     * @param {string} morseString - 再生するモールス信号
     * @param {number} frequency - 再生周波数 (Hz)
     */
    playMorseCode(morseString, frequency = 800) {
        this._initAudioContext();
        let currentTime = this.audioContext.currentTime;

        const playSound = (duration, time) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(1, time + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, time + duration - 0.01);
            oscillator.start(time);
            oscillator.stop(time + duration);
        };

        for (const symbol of morseString) {
            switch (symbol) {
                case '・':
                    playSound(this.dotDuration, currentTime);
                    currentTime += this.dotDuration + this.symbolSpace;
                    break;
                case '－':
                    playSound(this.dashDuration, currentTime);
                    currentTime += this.dashDuration + this.symbolSpace;
                    break;
                case '/':
                    currentTime += this.letterSpace - this.symbolSpace;
                    break;
                case ' ': // 単語間のスペース
                    currentTime += this.wordSpace - this.letterSpace;
                    break;
            }
        }
    }

    /**
     * 音声認識を開始する
     * @param {object} config - 設定オブジェクト { frequency, threshold, noiseCancel, onRecognize }
     */
    async startAudioRecognition(config) {
        if (this.isRecognizing) return;
        this._initAudioContext();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048; // FFTサイズ

            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Float32Array(bufferLength);
            
            this.microphone.connect(this.analyser);
            this.isRecognizing = true;

            // 簡易ノイズキャンセル: 最初の0.5秒の平均音量をノイズレベルとする
            if (config.noiseCancel) {
                this.noiseLevel = await this._measureNoiseLevel(dataArray);
            } else {
                this.noiseLevel = -100.0;
            }

            let soundOn = false;
            let startTime = 0;
            let silenceStartTime = 0;
            let recognizedSymbols = [];

            const targetBin = Math.round(config.frequency * this.analyser.fftSize / this.audioContext.sampleRate);

            const processAudio = () => {
                if (!this.isRecognizing) return;

                this.analyser.getFloatFrequencyData(dataArray);
                const volume = dataArray[targetBin];
                const threshold = config.threshold + (config.noiseCancel ? Math.max(0, this.noiseLevel + 20) : 0);

                if (volume > threshold) { // 音を検知
                    if (!soundOn) {
                        soundOn = true;
                        startTime = this.audioContext.currentTime;
                        const silenceDuration = startTime - silenceStartTime;
                        
                        if (silenceDuration > this.wordSpace) {
                            recognizedSymbols.push(' '); // 単語区切り
                        } else if (silenceDuration > this.letterSpace) {
                            recognizedSymbols.push('/'); // 文字区切り
                        }
                        config.onRecognize(recognizedSymbols.join(''));
                    }
                } else { // 無音を検知
                    if (soundOn) {
                        soundOn = false;
                        const duration = this.audioContext.currentTime - startTime;
                        if (duration > this.dashDuration * 0.8) {
                            recognizedSymbols.push('－');
                        } else {
                            recognizedSymbols.push('・');
                        }
                        config.onRecognize(recognizedSymbols.join(''));
                        silenceStartTime = this.audioContext.currentTime;
                    }
                }
                requestAnimationFrame(processAudio);
            };
            
            silenceStartTime = this.audioContext.currentTime;
            processAudio();

        } catch (err) {
            console.error('マイクへのアクセスが拒否されました:', err);
            alert(config.micErrorMsg || 'Please allow access to the microphone.');
            this.isRecognizing = false;
        }
    }
    
    // 簡易的なノイズレベル測定
    _measureNoiseLevel(dataArray) {
        return new Promise(resolve => {
            let total = 0;
            let count = 0;
            const interval = setInterval(() => {
                this.analyser.getFloatFrequencyData(dataArray);
                total += Math.max(...dataArray);
                count++;
            }, 50);
            setTimeout(() => {
                clearInterval(interval);
                resolve(count > 0 ? total / count : -100.0);
            }, 500);
        });
    }

    /**
     * 音声認識を停止する
     */
    stopAudioRecognition() {
        if (!this.isRecognizing) return;
        this.isRecognizing = false;
        if (this.microphone) {
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
            this.microphone.disconnect();
            this.microphone = null;
        }
        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }
    }
}
